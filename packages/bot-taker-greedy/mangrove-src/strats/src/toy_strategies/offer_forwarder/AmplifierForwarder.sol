// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import "@mgv-strats/src/strategies/offer_forwarder/abstract/Forwarder.sol";
import "@mgv-strats/src/strategies/routers/SimpleRouter.sol";
import {MgvLib, Offer} from "@mgv/src/core/MgvLib.sol";
import {Tick, TickLib} from "@mgv/lib/core/TickLib.sol";

contract AmplifierForwarder is Forwarder {
  IERC20 public immutable BASE;
  IERC20 public immutable STABLE1;
  uint public immutable TICK_SPACING1;
  IERC20 public immutable STABLE2;
  uint public immutable TICK_SPACING2;
  uint public immutable GASREQ;

  struct OfferPair {
    uint id1;
    uint id2;
  }

  mapping(address => OfferPair) offers; // mapping from maker address to id of the offers

  constructor(
    IMangrove mgv,
    IERC20 base,
    IERC20 stable1,
    IERC20 stable2,
    uint tickSpacing1,
    uint tickSpacing2,
    address deployer,
    uint gasreq
  ) Forwarder(mgv, new SimpleRouter()) {
    // SimpleRouter takes promised liquidity from admin's address (wallet)
    STABLE1 = stable1;
    TICK_SPACING1 = tickSpacing1;
    TICK_SPACING2 = tickSpacing2;
    STABLE2 = stable2;
    BASE = base;
    GASREQ = gasreq;

    AbstractRouter router_ = router();
    router_.bind(address(this));
    if (deployer != msg.sender) {
      setAdmin(deployer);
      router_.setAdmin(deployer);
    }
  }

  /**
   * @param gives in BASE decimals
   * @param wants1 in STABLE1 decimals
   * @param wants2 in STABLE2 decimals
   */
  struct NewOffersArgs {
    uint gives;
    uint wants1;
    uint wants2;
    uint fund1;
    uint fund2;
    uint gasreq;
  }

  /**
   * @param args the arguments struct to avoid stack too deep
   * @return (offerid for STABLE1, offerid for STABLE2)
   * @dev these offer's provision must be in msg.value
   * @dev `reserve()` must have approved base for `this` contract transfer prior to calling this function
   */
  function newAmplifiedOffers(NewOffersArgs memory args) external payable returns (uint, uint) {
    // there is a cost of being paternalistic here, we read MGV storage
    // an offer can be in 4 states:
    // - not on mangrove (never has been)
    // - on an offer list (isLive)
    // - not on an offer list (!isLive) (and can be deprovisioned or not)
    // MGV.retractOffer(..., deprovision:bool)
    // deprovisioning an offer (via MGV.retractOffer) credits maker balance on Mangrove (no native token transfer)
    // if maker wishes to retrieve native tokens it should call MGV.withdraw (and have a positive balance)
    OfferPair memory offerPair = offers[msg.sender];

    require(
      !MGV.offers(OLKey(address(BASE), address(STABLE1), TICK_SPACING1), offerPair.id1).isLive(),
      "AmplifierForwarder/offer1AlreadyActive"
    );
    require(
      !MGV.offers(OLKey(address(BASE), address(STABLE2), TICK_SPACING2), offerPair.id2).isLive(),
      "AmplifierForwarder/offer2AlreadyActive"
    );

    // FIXME the above requirements are not enough because offerId might be live on another base, stable market
    Tick tick = TickLib.tickFromVolumes(args.wants1, args.gives);

    (uint _offerId1, bytes32 status1) = _newOffer(
      OfferArgs({
        olKey: OLKey(address(BASE), address(STABLE1), TICK_SPACING1),
        tick: tick,
        gives: args.gives,
        gasreq: args.gasreq, // SimpleRouter is a MonoRouter
        gasprice: 0, // ignored
        fund: args.fund1,
        noRevert: false
      }),
      msg.sender
    );

    tick = TickLib.tickFromVolumes(args.wants2, args.gives);

    offers[msg.sender].id1 = _offerId1;
    // no need to fund this second call for provision
    // since the above call should be enough
    (uint _offerId2, bytes32 status2) = _newOffer(
      OfferArgs({
        olKey: OLKey(address(BASE), address(STABLE2), TICK_SPACING2),
        tick: tick,
        gives: args.gives,
        gasreq: GASREQ,
        gasprice: 0, // ignored
        fund: args.fund2,
        noRevert: false
      }),
      msg.sender
    );
    offers[msg.sender].id2 = _offerId2;

    require(_offerId1 != 0, string(abi.encode(status1)));
    require(_offerId2 != 0, string(abi.encode(status2)));

    return (_offerId1, _offerId2);
  }

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
    // Get the owner of the order. That is the same owner as the alt offer
    address owner = ownerOf(order.olKey.hash(), order.offerId);
    OfferPair memory offerPair = offers[owner];

    (OLKey memory altOlKey, uint alt_offerId) = IERC20(order.olKey.inbound_tkn) == STABLE1
      ? (OLKey(order.olKey.outbound_tkn, address(STABLE2), TICK_SPACING2), offerPair.id2)
      : (OLKey(order.olKey.outbound_tkn, address(STABLE1), TICK_SPACING1), offerPair.id1);

    if (repost_status == REPOST_SUCCESS) {
      (uint new_alt_gives,) = __residualValues__(order); // in base units

      uint gasreq;
      Tick tick;
      {
        Offer alt_offer = MGV.offers(altOlKey, alt_offerId);
        uint new_alt_wants;
        gasreq = MGV.offerDetails(altOlKey, alt_offerId).gasreq(); // to use alt_offer's old gasreq

        unchecked {
          new_alt_wants = (alt_offer.wants() * new_alt_gives) / order.offer.gives();
        }
        //FIXME: amplifiers should probably re-use tick instead of calculating.
        tick = TickLib.tickFromVolumes(new_alt_wants, new_alt_gives);
      }

      //uint prov = getMissingProvision(IERC20(order.outbound_tkn), IERC20(alt_stable), type(uint).max, 0, 0);

      bytes32 reason = _updateOffer(
        OfferArgs({
          olKey: altOlKey,
          tick: tick,
          gives: new_alt_gives,
          gasreq: gasreq,
          gasprice: 0, // ignored
          noRevert: true,
          fund: 0
        }),
        alt_offerId
      );
      if (reason != REPOST_SUCCESS) {
        // might want to Log an incident here because this should not be reachable
        return "posthook/altRepostFail";
      } else {
        return "posthook/bothOfferReposted";
      }
    } else {
      // repost failed or offer was entirely taken
      if (repost_status != "posthook/filled") {
        retractOffer({olKey: altOlKey, offerId: order.offerId, deprovision: false});
      }
      retractOffer({olKey: altOlKey, offerId: alt_offerId, deprovision: false});
      return "posthook/bothRetracted";
    }
  }

  function retractOffer(OLKey memory olKey, uint offerId, bool deprovision)
    public
    mgvOrOwner(olKey.hash(), offerId)
    returns (uint freeWei)
  {
    return _retractOffer(olKey, offerId, deprovision);
  }

  function retractOffers(bool deprovision) external {
    OfferPair memory offerPair = offers[msg.sender];
    retractOffer({
      olKey: OLKey(address(BASE), address(STABLE1), TICK_SPACING1),
      offerId: offerPair.id1,
      deprovision: deprovision
    });
    retractOffer({
      olKey: OLKey(address(BASE), address(STABLE2), TICK_SPACING2),
      offerId: offerPair.id2,
      deprovision: deprovision
    });
  }

  function __posthookFallback__(MgvLib.SingleOrder calldata order, MgvLib.OrderResult calldata)
    internal
    override
    returns (bytes32)
  {
    // Get the owner of the order. That is the same owner as the alt offer
    address owner = ownerOf(order.olKey.hash(), order.offerId);
    // if we reach this code, trade has failed for lack of base token
    OfferPair memory offerPair = offers[owner];
    (IERC20 alt_stable, uint tickSpacing, uint alt_offerId) = IERC20(order.olKey.inbound_tkn) == STABLE1
      ? (STABLE2, TICK_SPACING1, offerPair.id2)
      : (STABLE1, TICK_SPACING2, offerPair.id1);
    retractOffer({
      olKey: OLKey(order.olKey.outbound_tkn, address(alt_stable), tickSpacing),
      offerId: alt_offerId,
      deprovision: false
    });
    return "posthook/bothFailing";
  }
}
