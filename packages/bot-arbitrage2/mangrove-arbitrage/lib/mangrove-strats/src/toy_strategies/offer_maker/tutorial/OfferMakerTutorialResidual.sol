// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

// Import the types we will be using below
import {Direct} from "@mgv-strats/src/strategies/offer_maker/abstract/Direct.sol";
import {MangroveOffer} from "@mgv-strats/src/strategies/MangroveOffer.sol";
import {ILiquidityProvider} from "@mgv-strats/src/strategies/interfaces/ILiquidityProvider.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MgvLib, OLKey} from "@mgv/src/core/MgvLib.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

//----------------

/// @title This is a copy of OfferMakerTutorial.sol with a changed __posthookSuccess__
contract OfferMakerTutorialResidual is Direct, ILiquidityProvider {
  ///@notice Constructor
  ///@param mgv The core Mangrove contract
  ///@param deployer The address of the deployer
  constructor(IMangrove mgv, address deployer)
    // Pass on the reference to the core mangrove contract
    Direct(
      mgv,
      // Do not use a router - i.e., transfer tokens directly to and from the maker's reserve
      NO_ROUTER,
      // Store total gas requirement of this strategy
      100_000,
      deployer
    )
  {}

  //--------------

  ///@inheritdoc ILiquidityProvider
  function newOffer(OLKey memory olKey, Tick tick, uint gives, uint gasreq)
    public
    payable
    override
    onlyAdmin
    returns (uint offerId)
  {
    (offerId,) = _newOffer(
      OfferArgs({
        olKey: olKey,
        tick: tick,
        gives: gives,
        gasreq: gasreq,
        gasprice: 0,
        fund: msg.value, // WEIs in that are used to provision the offer.
        noRevert: false // we want to revert on error
      })
    );
  }

  ///@inheritdoc ILiquidityProvider
  function updateOffer(OLKey memory olKey, Tick tick, uint gives, uint offerId, uint gasreq)
    public
    payable
    override
    adminOrCaller(address(MGV))
  {
    _updateOffer(
      OfferArgs({olKey: olKey, tick: tick, gives: gives, gasreq: gasreq, gasprice: 0, fund: msg.value, noRevert: false}),
      offerId
    );
  }

  ///@inheritdoc ILiquidityProvider
  function retractOffer(OLKey memory olKey, uint offerId, bool deprovision)
    public
    adminOrCaller(address(MGV))
    returns (uint freeWei)
  {
    return _retractOffer(olKey, offerId, deprovision);
  }

  //-------------

  ///@inheritdoc MangroveOffer
  function __lastLook__(MgvLib.SingleOrder calldata order) internal override returns (bytes32 data) {
    data = super.__lastLook__(order);
    require(order.takerWants == order.offer.gives(), "tutorial/mustBeFullyTaken");
  }

  //----------------

  ///@notice Event emitted when the offer is taken successfully.
  ///@param someData is a dummy parameter.
  event OfferTakenSuccessfully(uint someData);

  ///@notice Post-hook that is invoked when the offer is taken successfully.
  ///@param order is a recall of the taker order that is at the origin of the current trade.
  ///@param makerData is the returned value of the `__lastLook__` hook.
  ///@inheritdoc Direct
  function __posthookSuccess__(MgvLib.SingleOrder calldata order, bytes32 makerData)
    internal
    virtual
    override
    returns (bytes32)
  {
    emit OfferTakenSuccessfully(42);
    // repost offer residual if any
    return super.__posthookSuccess__(order, makerData);
  }
}

//---------------------
