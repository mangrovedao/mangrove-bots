// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {Direct} from "@mgv-strats/src/strategies/offer_maker/abstract/Direct.sol";
import {OfferType} from "./TradesBaseQuotePair.sol";
import {HasIndexedBidsAndAsks} from "./HasIndexedBidsAndAsks.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {Local, Offer} from "@mgv/src/core/MgvLib.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

///@title `Direct` strat with an indexed collection of bids and asks which can be populated according to a desired base and quote distribution for gives and wants.
abstract contract DirectWithBidsAndAsksDistribution is Direct, HasIndexedBidsAndAsks {
  ///@notice logs the start of a call to populate
  ///@notice By emitting this, an indexer will be able to know that the following events are in the context of populate.
  event PopulateStart();
  ///@notice logs the end of a call to populate
  ///@notice By emitting this, an indexer will know that the previous PopulateStart event is over.
  event PopulateEnd();

  ///@notice logs the start of a call to retractOffers
  ///@notice By emitting this, an indexer will be able to know that the following events are in the context of retract.
  event RetractStart();
  ///@notice logs the end of a call to retractOffers
  ///@notice By emitting this, an indexer will know that the previous RetractStart event is over.
  event RetractEnd();

  ///@notice Constructor
  ///@param mgv The Mangrove deployment.
  ///@param gasreq the gasreq to use for offers
  ///@param reserveId identifier of this contract's reserve when using a router.
  constructor(IMangrove mgv, uint gasreq, address reserveId) Direct(mgv, NO_ROUTER, gasreq, reserveId) {}

  ///@param index the index of the offer
  ///@param tick the tick for the index (the tick price of base per quote for bids and quote per base for asks)
  ///@param gives the gives for the index (the `quote` for bids and the `base` for asks)
  struct DistributionOffer {
    uint index;
    Tick tick;
    uint gives;
  }

  ///@param asks the asks to populate
  ///@param bids the bids to populate
  struct Distribution {
    DistributionOffer[] asks;
    DistributionOffer[] bids;
  }

  ///@notice Publishes bids/asks for the distribution in the `indices`. Care must be taken to publish offers in meaningful chunks. For instance, for Kandel an offer and its dual should be published in the same chunk (one being optionally initially dead).
  ///@param distribution the distribution of bids and asks to populate
  ///@param gasreq the amount of gas units that are required to execute the trade.
  ///@param gasprice the gasprice used to compute offer's provision.
  ///@dev Gives of 0 means create/update and then retract offer (but update price, gasreq, gasprice of the offer)
  function populateChunkInternal(Distribution memory distribution, uint gasreq, uint gasprice) internal {
    emit PopulateStart();
    // Initialize static values of args
    OfferArgs memory args;
    // args.fund = 0; offers are already funded
    // args.noRevert = false; we want revert in case of failure
    args.gasreq = gasreq;
    args.gasprice = gasprice;

    // Populate bids
    args.olKey = offerListOfOfferType(OfferType.Bid);
    populateOfferListChunkInternal(distribution.bids, OfferType.Bid, args);

    // Populate asks
    args.olKey = args.olKey.flipped();
    populateOfferListChunkInternal(distribution.asks, OfferType.Ask, args);

    emit PopulateEnd();
  }

  ///@notice populates one of the offer lists with the given offers
  ///@param offers the offers to populate
  ///@param ba whether to populate bids or asks
  ///@param args a reused offer creation args structure with defaults passed from caller.
  function populateOfferListChunkInternal(DistributionOffer[] memory offers, OfferType ba, OfferArgs memory args)
    internal
  {
    Local local = MGV.local(args.olKey);
    // Minimum gives for offers (to post and retract)
    uint minGives = local.density().multiplyUp(args.gasreq + local.offer_gasbase());
    for (uint i; i < offers.length; ++i) {
      DistributionOffer memory offer = offers[i];
      uint index = offer.index;
      args.tick = offer.tick;
      args.gives = offer.gives;
      populateIndex(ba, offerIdOfIndex(ba, index), index, args, minGives);
    }
  }

  ///@notice publishes (by either creating or updating) a bid/ask at a given price index.
  ///@param ba whether the offer is a bid or an ask.
  ///@param offerId the Mangrove offer id (0 for a new offer).
  ///@param index the price index.
  ///@param args the argument of the offer. `args.gives=0` means offer will be created/updated and then retracted.
  ///@param minGives the minimum gives to satisfy density requirement - used for creating/updating offers when args.gives=0.
  function populateIndex(OfferType ba, uint offerId, uint index, OfferArgs memory args, uint minGives) internal {
    // if offer does not exist on mangrove yet
    if (offerId == 0) {
      // and offer should be live
      if (args.gives > 0) {
        // create it - we revert in case of failure (see populateChunk), so offerId is always > 0
        (offerId,) = _newOffer(args);
        setIndexMapping(ba, index, offerId);
      } else {
        // else offerId && gives are 0 and the offer is posted and retracted to reserve the offerId and set the price
        // set args.gives to minGives to be above density requirement, we do it here since we use the args.gives=0 to signal a dead offer.
        args.gives = minGives;
        // create it - we revert in case of failure (see populateChunk), so offerId is always > 0
        (offerId,) = _newOffer(args);
        // reset args.gives since args is reused
        args.gives = 0;
        // retract, keeping provision, thus the offer is reserved and ready for use in posthook.
        _retractOffer(args.olKey, offerId, false);
        setIndexMapping(ba, index, offerId);
      }
    }
    // else offer exists
    else {
      // but the offer should be dead since gives is 0
      if (args.gives == 0) {
        // * `gives == 0` may happen from populate in case of re-population where some offers are then retracted by setting gives to 0.
        // set args.gives to minGives to be above density requirement, we do it here since we use the args.gives=0 to signal a dead offer.
        args.gives = minGives;
        // Update offer to set correct price, gasreq, gasprice, then retract
        _updateOffer(args, offerId);
        // reset args.gives since args is reused
        args.gives = 0;
        // retract, keeping provision, thus the offer is reserved and ready for use in posthook.
        _retractOffer(args.olKey, offerId, false);
      } else {
        // so the offer exists and it should, we simply update it with potentially new volume and price
        _updateOffer(args, offerId);
      }
    }
  }

  ///@notice retracts and deprovisions offers of the distribution interval `[from, to[`.
  ///@param from the start index.
  ///@param to the end index.
  ///@dev use in conjunction of `withdrawFromMangrove` if the user wishes to redeem the available WEIs.
  function retractOffers(uint from, uint to) public onlyAdmin {
    emit RetractStart();
    retractOffersOnOfferList(from, to, OfferType.Ask);
    retractOffersOnOfferList(from, to, OfferType.Bid);
    emit RetractEnd();
  }

  ///@notice retracts and deprovisions offers of the distribution interval `[from, to[` for the given offer type.
  ///@param from the start index.
  ///@param to the end index.
  ///@param ba the offer type.
  function retractOffersOnOfferList(uint from, uint to, OfferType ba) internal {
    OLKey memory olKey = offerListOfOfferType(ba);
    for (uint index = from; index < to; ++index) {
      // These offerIds could be recycled in a new populate
      uint offerId = offerIdOfIndex(ba, index);
      if (offerId != 0) {
        _retractOffer(olKey, offerId, true);
      }
    }
  }

  ///@notice gets the Mangrove offer at the given index for the offer type.
  ///@param ba the offer type.
  ///@param index the index.
  ///@return offer the Mangrove offer.
  function getOffer(OfferType ba, uint index) public view returns (Offer offer) {
    uint offerId = offerIdOfIndex(ba, index);
    OLKey memory olKey = offerListOfOfferType(ba);
    offer = MGV.offers(olKey, offerId);
  }

  /// @notice gets the total gives of all offers of the offer type.
  /// @param ba offer type.
  /// @return volume the total gives of all offers of the offer type.
  /// @dev function is very gas costly, for external calls only.
  function offeredVolume(OfferType ba) public view returns (uint volume) {
    for (uint index = 0; index < length; ++index) {
      Offer offer = getOffer(ba, index);
      volume += offer.gives();
    }
  }
}
