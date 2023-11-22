// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import "@mgv-strats/src/strategies/offer_maker/abstract/Direct.sol";
import "@mgv-strats/src/strategies/routers/SimpleRouter.sol";
import {MgvLib, Offer, OfferDetail} from "@mgv/src/core/MgvLib.sol";
import {TickLib, Tick} from "@mgv/lib/core/TickLib.sol";

contract Amplifier is Direct {
  IERC20 public immutable BASE;
  IERC20 public immutable STABLE1;
  IERC20 public immutable STABLE2;
  uint public immutable TICK_SPACING1;
  uint public immutable TICK_SPACING2;

  ///mapping(IERC20 => mapping(IERC20 => uint)) // base -> stable -> offerid

  uint offerId1; // id of the offer on stable 1
  uint offerId2; // id of the offer on stable 2

  //           MangroveOffer <-- makerExecute
  //                  /\
  //                 / \
  //        Forwarder  Direct <-- offer management (our entry point)
  //    OfferForwarder  OfferMaker <-- new offer posting

  constructor(
    IMangrove mgv,
    IERC20 base,
    IERC20 stable1,
    IERC20 stable2,
    uint tickSpacing1,
    uint tickSpacing2,
    address admin
  ) Direct(mgv, NO_ROUTER, admin) {
    // SimpleRouter takes promised liquidity from admin's address (wallet)
    STABLE1 = stable1;
    STABLE2 = stable2;
    TICK_SPACING1 = tickSpacing1;
    TICK_SPACING2 = tickSpacing2;
    BASE = base;
    AbstractRouter router_ = new SimpleRouter();
    setRouter(router_);
    // adding `this` to the allowed makers of `router_` to pull/push liquidity
    // Note: `admin` needs to approve `this.router()` for base token transfer
    router_.bind(address(this));
    router_.setAdmin(admin);
    setAdmin(admin);
  }

  /**
   * @param gives in BASE decimals
   * @param wants1 in STABLE1 decimals
   * @param wants2 in STABLE2 decimals
   * @param gasreq for one offer
   * @return (offerid for STABLE1, offerid for STABLE2)
   * @dev these offer's provision must be in msg.value
   * @dev `reserve(admin())` must have approved base for `this` contract transfer prior to calling this function
   */
  function newAmplifiedOffers(
    // this function posts two asks
    uint gives,
    uint wants1,
    uint wants2,
    uint gasreq
  ) external payable onlyAdmin returns (uint, uint) {
    // there is a cost of being paternalistic here, we read MGV storage
    // an offer can be in 4 states:
    // - not on mangrove (never has been)
    // - on an offer list (isLive)
    // - not on an offer list (!isLive) (and can be deprovisioned or not)
    // MGV.retractOffer(..., deprovision:bool)
    // deprovisioning an offer (via MGV.retractOffer) credits maker balance on Mangrove (no native token transfer)
    // if maker wishes to retrieve native tokens it should call MGV.withdraw (and have a positive balance)
    require(
      !MGV.offers(OLKey(address(BASE), address(STABLE1), TICK_SPACING1), offerId1).isLive(),
      "Amplifier/offer1AlreadyActive"
    );
    require(
      !MGV.offers(OLKey(address(BASE), address(STABLE2), TICK_SPACING2), offerId2).isLive(),
      "Amplifier/offer2AlreadyActive"
    );
    // FIXME the above requirements are not enough because offerId might be live on another base, stable market

    Tick tick = TickLib.tickFromVolumes(wants1, gives);

    (offerId1,) = _newOffer(
      OfferArgs({
        olKey: OLKey(address(BASE), address(STABLE1), TICK_SPACING1),
        tick: tick,
        gives: gives,
        gasreq: gasreq,
        gasprice: 0,
        fund: msg.value,
        noRevert: false
      })
    );
    // no need to fund this second call for provision
    // since the above call should be enough
    tick = TickLib.tickFromVolumes(wants2, gives);

    (offerId2,) = _newOffer(
      OfferArgs({
        olKey: OLKey(address(BASE), address(STABLE2), TICK_SPACING2),
        tick: tick,
        gives: gives,
        gasreq: gasreq,
        gasprice: 0,
        fund: 0,
        noRevert: false
      })
    );

    return (offerId1, offerId2);
  }

  ///FIXME a possibility is to update the alt offer during makerExecute
  /// to do this we can override `__lastLook__` which is a hook called at the beginning of `makerExecute`

  function __posthookSuccess__(MgvLib.SingleOrder calldata order, bytes32 makerData)
    internal
    override
    returns (bytes32)
  {
    // reposts residual if any (conservative hook)
    bytes32 repost_status = super.__posthookSuccess__(order, makerData);
    // write here what you want to do if not `reposted`
    // reasons for not ok are:
    // - residual below density (dust)
    // - not enough provision
    // - offer list is closed (governance call)
    (OLKey memory altOlKey, uint alt_offerId) = IERC20(order.olKey.inbound_tkn) == STABLE1
      ? (OLKey(order.olKey.outbound_tkn, address(STABLE2), TICK_SPACING2), offerId2)
      : (OLKey(order.olKey.outbound_tkn, address(STABLE1), TICK_SPACING1), offerId1);
    if (repost_status == REPOST_SUCCESS) {
      (uint new_alt_gives,) = __residualValues__(order); // in base units
      Offer alt_offer = MGV.offers(altOlKey, alt_offerId);
      OfferDetail alt_detail = MGV.offerDetails(altOlKey, alt_offerId);

      uint old_alt_wants = alt_offer.wants();
      // old_alt_gives is also old_gives
      uint old_alt_gives = order.offer.gives();
      // we want new_alt_wants == (old_alt_wants:96 * new_alt_gives:96)/old_alt_gives:96
      // so no overflow to be expected :)
      uint new_alt_wants;
      unchecked {
        new_alt_wants = (old_alt_wants * new_alt_gives) / old_alt_gives;
      }

      // the call below might throw
      bytes32 reason = _updateOffer(
        OfferArgs({
          olKey: altOlKey,
          gives: new_alt_gives,
          tick: TickLib.tickFromVolumes(new_alt_wants, new_alt_gives),
          gasreq: alt_detail.gasreq(),
          gasprice: 0,
          fund: 0,
          noRevert: true
        }),
        alt_offerId
      );
      if (reason != REPOST_SUCCESS) {
        return "posthook/altOfferRepostFail";
      } else {
        return "posthook/bothOfferReposted";
      }
    } else {
      // repost failed or offer was entirely taken
      retractOffer({olKey: altOlKey, offerId: alt_offerId, deprovision: false});
      return "posthook/bothRetracted";
    }
  }

  function retractOffer(OLKey memory olKey, uint offerId, bool deprovision)
    public
    adminOrCaller(address(MGV))
    returns (uint freeWei)
  {
    return _retractOffer(olKey, offerId, deprovision);
  }

  function retractOffers(bool deprovision) external {
    uint freeWei = retractOffer({
      olKey: OLKey(address(BASE), address(STABLE1), TICK_SPACING1),
      offerId: offerId1,
      deprovision: deprovision
    });
    freeWei += retractOffer({
      olKey: OLKey(address(BASE), address(STABLE2), TICK_SPACING2),
      offerId: offerId2,
      deprovision: deprovision
    });
    if (freeWei > 0) {
      require(MGV.withdraw(freeWei), "Amplifier/withdrawFail");
      // sending native tokens to `msg.sender` prevents reentrancy issues
      // (the context call of `retractOffer` could be coming from `makerExecute` and a different recipient of transfer than `msg.sender` could use this call to make offer fail)
      (bool noRevert,) = admin().call{value: freeWei}("");
      require(noRevert, "Amplifier/weiTransferFail");
    }
  }

  function __posthookFallback__(MgvLib.SingleOrder calldata order, MgvLib.OrderResult calldata)
    internal
    override
    returns (bytes32)
  {
    // if we reach this code, trade has failed for lack of base token
    (IERC20 alt_stable, uint tickSpacing, uint alt_offerId) = IERC20(order.olKey.inbound_tkn) == STABLE1
      ? (STABLE2, TICK_SPACING2, offerId2)
      : (STABLE1, TICK_SPACING1, offerId1);
    retractOffer({
      olKey: OLKey(order.olKey.outbound_tkn, address(alt_stable), tickSpacing),
      offerId: alt_offerId,
      deprovision: false
    });
    return "posthook/bothFailing";
  }
}
