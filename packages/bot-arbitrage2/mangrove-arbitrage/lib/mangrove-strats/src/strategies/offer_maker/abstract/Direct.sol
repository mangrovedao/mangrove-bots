// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveOffer} from "@mgv-strats/src/strategies/MangroveOffer.sol";
import {AbstractRouter} from "@mgv-strats/src/strategies/routers/abstract/AbstractRouter.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MgvLib, OLKey} from "@mgv/src/core/MgvLib.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {IOfferLogic} from "@mgv-strats/src/strategies/interfaces/IOfferLogic.sol";

///@title `Direct` strats is an extension of MangroveOffer that allows contract's admin to manage offers on Mangrove.
abstract contract Direct is MangroveOffer {
  ///@notice `reserveId` is set in the constructor
  ///@param reserveId identifier of this contract's reserve when using a router. This is indexed so that RPC calls can filter on it.
  ///@notice by emitting this event, an indexer will be able to keep track of what reserve is used.
  event SetReserveId(address indexed reserveId);

  ///@notice identifier of this contract's reserve when using a router
  ///@dev RESERVE_ID==address(0) will pass address(this) to the router for the id field.
  ///@dev two contracts using the same RESERVE_ID will share funds, therefore strat builder must make sure this contract is allowed to pull into the given reserve Id.
  ///@dev a safe value for `RESERVE_ID` is `address(this)` in which case the funds will never be shared with another maker contract.
  address public immutable RESERVE_ID;

  ///@notice `Direct`'s constructor.
  ///@param mgv The Mangrove deployment that is allowed to call `this` for trade execution and posthook.
  ///@param router_ the router that this contract will use to pull/push liquidity from offer maker's reserve. This can be `NO_ROUTER`.
  ///@param gasreq Gas requirement when posting offers via this strategy, excluding router requirement.
  ///@param reserveId identifier of this contract's reserve when using a router.
  constructor(IMangrove mgv, AbstractRouter router_, uint gasreq, address reserveId) MangroveOffer(mgv, gasreq) {
    if (router_ != NO_ROUTER) {
      setRouter(router_);
    }
    address reserveId_ = reserveId == address(0) ? address(this) : reserveId;
    RESERVE_ID = reserveId_;
    emit SetReserveId(reserveId_);
  }

  /// @notice Inserts a new offer in Mangrove Offer List.
  /// @param args Function arguments stored in memory.
  /// @return offerId Identifier of the newly created offer. Returns 0 if offer creation was rejected by Mangrove and `args.noRevert` is set to `true`.
  /// @return status NEW_OFFER_SUCCESS if the offer was successfully posted on Mangrove. Returns Mangrove's revert reason otherwise.
  function _newOffer(OfferArgs memory args) internal returns (uint offerId, bytes32 status) {
    try MGV.newOfferByTick{value: args.fund}(args.olKey, args.tick, args.gives, args.gasreq, args.gasprice) returns (
      uint offerId_
    ) {
      offerId = offerId_;
      status = NEW_OFFER_SUCCESS;
    } catch Error(string memory reason) {
      require(args.noRevert, reason);
      status = bytes32(bytes(reason));
    }
  }

  ///@inheritdoc MangroveOffer
  function _updateOffer(OfferArgs memory args, uint offerId) internal override returns (bytes32 status) {
    try MGV.updateOfferByTick{value: args.fund}(args.olKey, args.tick, args.gives, args.gasreq, args.gasprice, offerId)
    {
      status = REPOST_SUCCESS;
    } catch Error(string memory reason) {
      require(args.noRevert, reason);
      status = bytes32(bytes(reason));
    }
  }

  ///@notice Retracts an offer from an Offer List of Mangrove.
  ///@param olKey the offer list key.
  ///@param offerId the identifier of the offer in the offer list
  ///@param deprovision if set to `true` if offer admin wishes to redeem the offer's provision.
  ///@return freeWei the amount of native tokens (in WEI) that have been retrieved by retracting the offer.
  ///@dev An offer that is retracted without `deprovision` is retracted from the offer list, but still has its provisions locked by Mangrove.
  ///@dev Calling this function, with the `deprovision` flag, on an offer that is already retracted must be used to retrieve the locked provisions.
  function _retractOffer(
    OLKey memory olKey,
    uint offerId,
    bool deprovision // if set to `true`, `this` contract will receive the remaining provision (in WEI) associated to `offerId`.
  ) internal returns (uint freeWei) {
    freeWei = MGV.retractOffer(olKey, offerId, deprovision);
  }

  ///@inheritdoc IOfferLogic
  function provisionOf(OLKey memory olKey, uint offerId) external view override returns (uint provision) {
    provision = _provisionOf(olKey, offerId);
  }

  ///@notice direct contract do not need to do anything specific with incoming funds during trade
  ///@dev one should override this function if one wishes to leverage taker's fund during trade execution
  ///@inheritdoc MangroveOffer
  function __put__(uint, MgvLib.SingleOrder calldata) internal virtual override returns (uint) {
    return 0;
  }

  ///@notice `__get__` hook for `Direct` is to ask the router to pull liquidity from `reserveId` if strat is using a router
  /// otherwise the function simply returns what's missing in the local balance
  ///@inheritdoc MangroveOffer
  function __get__(uint amount, MgvLib.SingleOrder calldata order) internal virtual override returns (uint) {
    uint amount_ = IERC20(order.olKey.outbound_tkn).balanceOf(address(this));
    if (amount_ >= amount) {
      return 0;
    }
    amount_ = amount - amount_;
    AbstractRouter router_ = router();
    if (router_ == NO_ROUTER) {
      return amount_;
    } else {
      // if RESERVE_ID is potentially shared by other contracts we are forced to pull in a strict fashion (otherwise another contract sharing funds that would be called in the same market order will fail to deliver)
      uint pulled = router_.pull(IERC20(order.olKey.outbound_tkn), RESERVE_ID, amount_, RESERVE_ID != address(this));
      return pulled >= amount_ ? 0 : amount_ - pulled;
    }
  }

  ///@notice Direct posthook flushes outbound and inbound token back to the router (if any)
  ///@inheritdoc MangroveOffer
  function __posthookSuccess__(MgvLib.SingleOrder calldata order, bytes32 makerData)
    internal
    virtual
    override
    returns (bytes32)
  {
    AbstractRouter router_ = router();
    if (router_ != NO_ROUTER) {
      IERC20[] memory tokens = new IERC20[](2);
      tokens[0] = IERC20(order.olKey.outbound_tkn); // flushing outbound tokens if this contract pulled more liquidity than required during `makerExecute`
      tokens[1] = IERC20(order.olKey.inbound_tkn); // flushing liquidity brought by taker
      router_.flush(tokens, RESERVE_ID);
    }
    // reposting offer residual if any
    return super.__posthookSuccess__(order, makerData);
  }

  ///@notice if strat has a router, verifies that the router is ready to pull/push on behalf of reserve id
  ///@inheritdoc MangroveOffer
  function __checkList__(IERC20 token) internal view virtual override {
    super.__checkList__(token);
    if (router() != NO_ROUTER) {
      router().checkList(token, RESERVE_ID);
    }
  }
}
