// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveOffer} from "@mgv-strats/src/strategies/MangroveOffer.sol";
import {IForwarder} from "@mgv-strats/src/strategies/interfaces/IForwarder.sol";
import {AbstractRouter} from "@mgv-strats/src/strategies/routers/abstract/AbstractRouter.sol";
import {IOfferLogic} from "@mgv-strats/src/strategies/interfaces/IOfferLogic.sol";
import {MgvLib, IERC20, OLKey, OfferDetail, Global, Local} from "@mgv/src/core/MgvLib.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";

///@title Class for maker contracts that forward offer makers instructions to Mangrove in a permissionless fashion.
///@notice Each offer posted via this contract are managed by their offer maker, not by this contract's admin.
///@notice This class implements IForwarder, which contains specific Forwarder logic functions in additions to IOfferLogic interface.

abstract contract Forwarder is IForwarder, MangroveOffer {
  ///@notice approx of amount of gas units required to complete `__posthookFallback__` when evaluating penalty.
  uint constant GAS_APPROX = 2000;

  ///@notice data associated to each offer published on Mangrove by this contract.
  ///@param owner address of the account that can manage (update or retract) the offer
  ///@param weiBalance fraction of `this` balance on Mangrove that is assigned to `owner`.
  ///@dev `OwnerData` packs into one word.
  struct OwnerData {
    address owner;
    uint96 weiBalance;
  }

  ///@notice Owner data mapping.
  ///@dev mapping is olKeyHash -> offerId -> OwnerData
  ///@dev 'ownerData[olKeyHash][offerId].owner == maker` if `maker` is offer owner of `offerId` in the `(out, in)` offer list.
  mapping(bytes32 olKeyHash => mapping(uint offerId => OwnerData)) internal ownerData;

  ///@notice modifier to enforce function caller to be offer owner
  modifier onlyOwner(bytes32 olKeyHash, uint offerId) {
    require(ownerData[olKeyHash][offerId].owner == msg.sender, "AccessControlled/Invalid");
    _;
  }

  ///@notice modifier to enforce function caller to be offer owner or MGV (for use in the offer logic)
  modifier mgvOrOwner(bytes32 olKeyHash, uint offerId) {
    if (msg.sender != address(MGV)) {
      require(ownerData[olKeyHash][offerId].owner == msg.sender, "AccessControlled/Invalid");
    }
    _;
  }

  ///@notice Forwarder constructor
  ///@param mgv the deployed Mangrove contract on which this contract will post offers.
  ///@param router the router that this contract will use to pull/push liquidity from offer maker's reserve. This must not be `NO_ROUTER`.
  constructor(IMangrove mgv, AbstractRouter router) MangroveOffer(mgv) {
    require(router != NO_ROUTER, "Forwarder logics must have a router");
    setRouter(router);
  }

  ///@inheritdoc IForwarder
  function offerOwners(bytes32 olKeyHash, uint[] calldata offerIds)
    public
    view
    override
    returns (address[] memory offerOwners_)
  {
    offerOwners_ = new address[](offerIds.length);
    for (uint i = 0; i < offerIds.length; ++i) {
      offerOwners_[i] = ownerOf(olKeyHash, offerIds[i]);
    }
  }

  /// @notice grants managing (update/retract) rights on a particular offer.
  /// @param olKeyHash the hash of the offer list key.
  /// @param offerId the offer identifier in the offer list.
  /// @param owner the address of the offer maker.
  /// @param leftover the fraction of `msg.value` that is not locked in the offer provision due to rounding error (see `_newOffer`).
  function addOwner(bytes32 olKeyHash, uint offerId, address owner, uint leftover) internal {
    ownerData[olKeyHash][offerId] = OwnerData({owner: owner, weiBalance: uint96(leftover)});
    emit NewOwnedOffer(olKeyHash, offerId, owner);
  }

  /// @notice computes the maximum `gasprice` that can be covered by the amount of provision given in argument.
  /// @param gasreq the gas required by the offer
  /// @param provision the amount of native token one wishes to use, to provision the offer on Mangrove.
  /// @param offerGasbase Mangrove's offer_gasbase.
  /// @return gasprice the gas price that is covered by `provision` - `leftover`.
  /// @return leftover the sub amount of `provision` that is not used to provision the offer.
  /// @dev the returned gasprice is slightly lower than the real gasprice that the provision can cover because of the rounding error due to division
  function deriveGasprice(uint gasreq, uint provision, uint offerGasbase)
    internal
    pure
    returns (uint gasprice, uint leftover)
  {
    unchecked {
      uint num = (offerGasbase + gasreq) * 1e6;
      // pre-check to avoid underflow since 0 is interpreted as "use Mangrove's gasprice"
      require(provision >= num, "mgv/insufficientProvision");
      // Gasprice is eventually a uint26, so too much provision would yield a gasprice overflow
      // Reverting here with a clearer reason
      require(provision < ((1 << 26) - 1) * num, "Forwarder/provisionTooHigh");
      gasprice = provision / num;

      // computing amount of native tokens that are not going to be locked on Mangrove
      // this amount should still be recoverable by offer maker when retracting the offer
      leftover = provision - (gasprice * 1e6 * (offerGasbase + gasreq));
    }
  }

  /// @inheritdoc IForwarder
  function ownerOf(bytes32 olKeyHash, uint offerId) public view override returns (address owner) {
    owner = ownerData[olKeyHash][offerId].owner;
    require(owner != address(0), "Forwarder/unknownOffer");
  }

  /// @notice Derives the gas price for the new offer and verifies it against the global configuration.
  /// @param args function's arguments in memory
  /// @return gasprice the gas price that is covered by `provision` - `leftover`.
  /// @return leftover the sub amount of `provision` that is not used to provision the offer.
  /// @dev the returned gasprice is slightly lower than the real gasprice that the provision can cover because of the rounding error due to division
  function deriveAndCheckGasprice(OfferArgs memory args) internal view returns (uint gasprice, uint leftover) {
    (Global global, Local local) = MGV.config(args.olKey);
    // computing max `gasprice` such that `offData.fund` covers `offData.gasreq` at `gasprice`
    (gasprice, leftover) = deriveGasprice(args.gasreq, args.fund, local.offer_gasbase());
    // mangrove will take max(`mko.gasprice`, `global.gasprice`)
    // if `mko.gasprice < global.gasprice` Mangrove will use available provision of this contract to provision the offer
    // this would potentially take native tokens that have been released after some offer managed by this contract have failed
    // so one needs to make sure here that only provision of this call will be used to provision the offer on mangrove
    require(gasprice >= global.gasprice(), "mgv/insufficientProvision");
  }

  /// @notice Inserts a new offer on a Mangrove Offer List.
  /// @dev If inside a hook, one should call `_newOffer` to create a new offer and not directly `MGV.newOffer` to make sure one is correctly dealing with:
  /// * offer ownership
  /// * offer provisions and gasprice
  /// @param args function's arguments in memory
  /// @param owner the address of the offer owner
  /// @return offerId the identifier of the new offer on the offer list. Can be 0 if posting was rejected by Mangrove and `args.noRevert` is `true`.
  /// @return status the status of the new offer on Mangrove if the call has not reverted. It may be NEW_OFFER_SUCCESS or Mangrove's revert reason if `args.noRevert` was set to true.
  /// Forwarder logic does not manage user funds on Mangrove, as a consequence:
  /// An offer maker's redeemable provisions on Mangrove is just the sum $S_locked(maker)$ of locked provision in all live offers it owns
  /// plus the sum $S_free(maker)$ of `weiBalance`'s in all dead offers it owns (see `OwnerData.weiBalance`).
  /// Notice $\sum_i S_free(maker_i)$ <= MGV.balanceOf(address(this))`.
  /// Any fund of an offer maker on Mangrove that is either not locked on Mangrove or stored in the `OwnerData` free wei's is thus not recoverable by the offer maker (although it is admin recoverable).
  /// Therefore we need to make sure that all `msg.value` is either used to provision the offer at `gasprice` or stored in the offer data under `weiBalance`.
  /// To do so, we do not let offer maker fix a gasprice. Rather we derive the gasprice based on `msg.value`.
  /// Because of rounding errors in `deriveGasprice` a small amount of WEIs will accumulate in mangrove's balance of `this` contract
  /// We assign this leftover to the corresponding `weiBalance` of `OwnerData`.
  function _newOffer(OfferArgs memory args, address owner) internal returns (uint offerId, bytes32 status) {
    // convention for default gasreq value
    (uint gasprice, uint leftover) = deriveAndCheckGasprice(args);

    // the call below cannot revert for lack of provision (by design)
    // it may still revert if `args.fund` yields a gasprice that is too high (Mangrove's gasprice must hold on 26 bits)
    // or if `args.gives` is below density (dust)
    try MGV.newOfferByTick{value: args.fund}(args.olKey, args.tick, args.gives, args.gasreq, gasprice) returns (
      uint offerId_
    ) {
      // assign `offerId_` to caller
      addOwner(args.olKey.hash(), offerId_, owner, leftover);
      offerId = offerId_;
      status = NEW_OFFER_SUCCESS;
    } catch Error(string memory reason) {
      /// letting revert bubble up unless `noRevert` is positioned.
      require(args.noRevert, reason);
      status = bytes32(bytes(reason));
    }
  }

  struct UpdateOfferVars {
    uint leftover;
    Global global;
    Local local;
    OfferDetail offerDetail;
  }

  ///@inheritdoc MangroveOffer
  ///@notice Internal `updateOffer`, using arguments and variables on memory to avoid stack too deep.
  ///@return reason Either REPOST_SUCCESS or Mangrove's revert reason if update was rejected by Mangrove and `args.noRevert` is `true`.
  function _updateOffer(OfferArgs memory args, uint offerId) internal override returns (bytes32 reason) {
    unchecked {
      UpdateOfferVars memory vars;
      (vars.global, vars.local) = MGV.config(args.olKey);
      vars.offerDetail = MGV.offerDetails(args.olKey, offerId);

      uint old_gasreq = vars.offerDetail.gasreq();
      // re-deriving gasprice only if necessary
      if (
        args.fund > 0 // user adds more provision
          || args.gasreq != old_gasreq // offer's `gasreq` is modified
          || vars.offerDetail.offer_gasbase() != vars.local.offer_gasbase() // governance has updated `offer_gasbase`
      ) {
        // adding current locked provision to funds (0 if offer is deprovisioned)
        uint locked_funds = vars.offerDetail.gasprice() * 1e6 * (old_gasreq + vars.offerDetail.offer_gasbase());
        // note that if `args.gasreq < old_gasreq` then offer gasprice will increase (even if `args.fund == 0`) to match the incurred excess of locked provision
        (args.gasprice, vars.leftover) =
          deriveGasprice(args.gasreq, args.fund + locked_funds, vars.local.offer_gasbase());

        // leftover can be safely cast to uint96 since it's a rounding error
        // adding `leftover` to potential previous value since it was not included in args.fund
        ownerData[args.olKey.hash()][offerId].weiBalance += uint96(vars.leftover);
      } else {
        // no funds are added so we keep old gasprice
        args.gasprice = vars.offerDetail.gasprice();
      }
      // if `args.fund` is too low, offer gasprice might be below mangrove's gasprice
      // Mangrove will then take its own gasprice for the offer and would possibly tap into `this` contract's balance to cover for the missing provision
      require(args.gasprice >= vars.global.gasprice(), "mgv/insufficientProvision");
      try MGV.updateOfferByTick{value: args.fund}(
        args.olKey, args.tick, args.gives, args.gasreq, args.gasprice, offerId
      ) {
        return REPOST_SUCCESS;
      } catch Error(string memory _reason) {
        require(args.noRevert, _reason);
        return bytes32(bytes(_reason));
      }
    }
  }

  ///@inheritdoc IOfferLogic
  function provisionOf(OLKey memory olKey, uint offerId) external view override returns (uint provision) {
    provision = _provisionOf(olKey, offerId);
    unchecked {
      provision += ownerData[olKey.hash()][offerId].weiBalance;
    }
  }

  ///@notice Retracts an offer from an Offer List of Mangrove.
  ///@param olKey the offer list key.
  ///@param offerId the identifier of the offer in the offer list
  ///@param deprovision if set to `true` if offer owner wishes to redeem the offer's provision.
  ///@return freeWei the amount of native tokens (in WEI) that have been retrieved by retracting the offer.
  ///@dev An offer that is retracted without `deprovision` is retracted from the offer list, but still has its provisions locked by Mangrove.
  ///@dev Calling this function, with the `deprovision` flag, on an offer that is already retracted must be used to retrieve the locked provisions.
  function _retractOffer(OLKey memory olKey, uint offerId, bool deprovision) internal returns (uint freeWei) {
    OwnerData storage od = ownerData[olKey.hash()][offerId];
    freeWei = deprovision ? od.weiBalance : 0; // (a)
    freeWei += MGV.retractOffer(olKey, offerId, deprovision); // (b)
    if (freeWei > 0) {
      // pulling free wei from Mangrove to `this`
      require(MGV.withdraw(freeWei), "Forwarder/withdrawFail");
      // resetting pending returned provision
      od.weiBalance = 0;
      // Griefing issue: the call below could occur nested inside a call to `makerExecute` originating from Mangrove, so `owner` could make the current trade fail.
      // Here we are safe because callee is offer owner and has no incentive to make current trade fail or waste gas.
      // w.r.t reentrancy:
      // * `od.weiBalance` is set to 0 (storage write) prior to this call, so a reentrant call to `retractOffer` would give `freeWei = 0` at (a)
      // * further call to `MGV.retractOffer` will yield no more WEIs so `freeWei += 0` at (b)
      // * (a /\ b) imply that the above call to `MGV.withdraw` will be done with `freeWei == 0`.
      // * `retractOffer` is the only function that allows non admin users to withdraw WEIs from Mangrove.
      (bool noRevert,) = od.owner.call{value: freeWei}("");
      require(noRevert, "mgvOffer/weiTransferFail");
    }
  }

  ///@dev put received inbound tokens on offer maker's reserve during `makerExecute`
  /// if nothing is done at that stage then it could still be done during `makerPosthook`.
  /// However one would then need to pay attention to the following fact:
  /// if `order.olKey.inbound_tkn` is not pushed to reserve during `makerExecute`, in the posthook of this offer execution, the `order.olKey.inbound_tkn` balance of this contract would then contain
  /// the sum of all payments of offers managed by `this` that are in a better position in the offer list (because posthook is called in the call stack order).
  /// here we maintain an invariant that `this` balance is empty (both for `order.olKey.inbound_tkn` and `order.olKey.outbound_tkn`) at the end of `makerExecute`.
  ///@inheritdoc MangroveOffer
  function __put__(uint amount, MgvLib.SingleOrder calldata order) internal virtual override returns (uint) {
    address owner = ownerOf(order.olKey.hash(), order.offerId);
    uint pushed = router().push(IERC20(order.olKey.inbound_tkn), owner, amount);
    return amount - pushed;
  }

  ///@dev get outbound tokens from offer owner reserve
  ///@inheritdoc MangroveOffer
  function __get__(uint amount, MgvLib.SingleOrder calldata order) internal virtual override returns (uint) {
    address owner = ownerOf(order.olKey.hash(), order.offerId);
    // telling router one is requiring `amount` of `outTkn` for `owner`.
    // because `pull` is strict, `pulled <= amount` (cannot be greater)
    // we do not check local balance here because multi user contracts do not keep more balance than what has been pulled
    uint pulled = router().pull(IERC20(order.olKey.outbound_tkn), owner, amount, true);
    return amount - pulled; // this will make trade fail if `amount != pulled`
  }

  ///@dev if offer failed to execute, Mangrove retracts and deprovisions it after the posthook call.
  /// As a consequence if this hook is reached, `this` balance on Mangrove *will* increase, after the posthook,
  /// of some amount $n$ of native tokens. We evaluate here an underapproximation $~n$ in order to credit the offer maker in a pull based manner:
  /// failed offer owner can retrieve $~n$ by calling `retractOffer` on the failed offer.
  /// because $~n<n$ a small amount of WEIs will accumulate on the balance of `this` on Mangrove over time.
  /// Note that these WEIs are not burnt since they can be admin retrieved using `withdrawFromMangrove`.
  /// @inheritdoc MangroveOffer
  function __handleResidualProvision__(MgvLib.SingleOrder calldata order) internal virtual override {
    mapping(uint => OwnerData) storage semiBookOwnerData = ownerData[order.olKey.hash()];
    // NB if several offers of `this` contract have failed during the market order, the balance of this contract on Mangrove will contain cumulated free provision

    // computing an under approximation of returned provision because of this offer's failure
    uint gasreq = order.offerDetail.gasreq();
    uint provision = 1e6 * order.offerDetail.gasprice() * (gasreq + order.offerDetail.offer_gasbase());

    // gasUsed estimate to complete posthook and penalize this offer is ~1750 (empirical estimate)
    uint gasprice = order.global.gasprice() * 1e6;
    uint approxGasConsumption = gasreq + GAS_APPROX + order.local.offer_gasbase();
    uint approxBounty = (approxGasConsumption - gasleft()) * gasprice;
    uint approxReturnedProvision = approxBounty >= provision ? 0 : provision - approxBounty;

    // storing the portion of this contract's balance on Mangrove that should be attributed back to the failing offer's owner
    // those free WEIs can be retrieved by offer owner, by calling `retractOffer` with the `deprovision` flag.
    semiBookOwnerData[order.offerId].weiBalance += uint96(approxReturnedProvision);
  }

  ///@inheritdoc MangroveOffer
  ///@notice verifies that msg.sender is an allowed reserve id to trade tokens with this contract
  function __checkList__(IERC20 token) internal view virtual override {
    super.__checkList__(token);
    AbstractRouter router_ = router();
    router_.checkList(token, msg.sender);
  }
}
