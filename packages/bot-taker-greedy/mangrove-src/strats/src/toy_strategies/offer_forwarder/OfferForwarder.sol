// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {Forwarder, IMangrove} from "@mgv-strats/src/strategies/offer_forwarder/abstract/Forwarder.sol";
import {ILiquidityProvider} from "@mgv-strats/src/strategies/interfaces/ILiquidityProvider.sol";
import {SimpleRouter, AbstractRouter} from "@mgv-strats/src/strategies/routers/SimpleRouter.sol";
import {MgvLib, OLKey} from "@mgv/src/core/MgvLib.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

contract OfferForwarder is ILiquidityProvider, Forwarder {
  constructor(IMangrove mgv, address deployer) Forwarder(mgv, new SimpleRouter()) {
    AbstractRouter router_ = router();
    router_.bind(address(this));
    if (deployer != msg.sender) {
      setAdmin(deployer);
      router_.setAdmin(deployer);
    }
  }

  /// @inheritdoc ILiquidityProvider
  function newOffer(OLKey memory olKey, Tick tick, uint gives, uint gasreq)
    public
    payable
    override
    returns (uint offerId)
  {
    (offerId,) = _newOffer(
      OfferArgs({
        olKey: olKey,
        tick: tick,
        gives: gives,
        gasreq: gasreq,
        gasprice: 0,
        fund: msg.value,
        noRevert: false // propagates Mangrove's revert data in case of newOffer failure
      }),
      msg.sender
    );
  }

  ///@inheritdoc ILiquidityProvider
  ///@dev the `gasprice` argument is always ignored in `Forwarder` logic, since it has to be derived from `msg.value` of the call (see `_newOffer`).
  function updateOffer(OLKey memory olKey, Tick tick, uint gives, uint offerId, uint gasreq)
    public
    payable
    override
    onlyOwner(olKey.hash(), offerId)
  {
    OfferArgs memory args;

    // funds to compute new gasprice is msg.value. Will use old gasprice if no funds are given
    // it might be tempting to include `od.weiBalance` here but this will trigger a recomputation of the `gasprice`
    // each time a offer is updated.
    args.fund = msg.value; // if inside a hook (Mangrove is `msg.sender`) this will be 0
    args.olKey = olKey;
    args.tick = tick;
    args.gives = gives;
    args.gasreq = gasreq;
    args.noRevert = false; // will throw if Mangrove reverts
    // weiBalance is used to provision offer
    _updateOffer(args, offerId);
  }

  ///@inheritdoc ILiquidityProvider
  function retractOffer(OLKey memory olKey, uint offerId, bool deprovision)
    public
    mgvOrOwner(olKey.hash(), offerId)
    returns (uint freeWei)
  {
    return _retractOffer(olKey, offerId, deprovision);
  }

  function __posthookSuccess__(MgvLib.SingleOrder calldata order, bytes32 maker_data)
    internal
    override
    returns (bytes32 data)
  {
    data = super.__posthookSuccess__(order, maker_data);
    require(
      data == "posthook/reposted" || data == "posthook/filled",
      data == "mgv/insufficientProvision"
        ? "mgv/insufficientProvision"
        : (data == "mgv/writeOffer/density/tooLow" ? "mgv/writeOffer/density/tooLow" : "posthook/failed")
    );
  }
}
