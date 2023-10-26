// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {OfferType} from "./TradesBaseQuotePair.sol";
import {MAX_TICK, MIN_TICK} from "@mgv/lib/core/Constants.sol";
import {DirectWithBidsAndAsksDistribution} from "./DirectWithBidsAndAsksDistribution.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

///@title Library of helper functions for Kandel, mainly to reduce deployed size.
library KandelLib {
  ///@notice returns the destination index to transport received liquidity to - a better (for Kandel) price index for the offer type.
  ///@param ba the offer type to transport to
  ///@param index the price index one is willing to improve
  ///@param step the number of price steps improvements
  ///@param pricePoints the number of price points
  ///@return better destination index
  function transportDestination(OfferType ba, uint index, uint step, uint pricePoints)
    internal
    pure
    returns (uint better)
  {
    if (ba == OfferType.Ask) {
      better = index + step;
      if (better >= pricePoints) {
        better = pricePoints - 1;
      }
    } else {
      if (index >= step) {
        better = index - step;
      }
      // else better = 0
    }
  }

  ///@notice Creates a distribution of bids and asks given by the parameters. Dual offers are included with gives=0.
  ///@param from populate offers starting from this index (inclusive). Must be at most `pricePoints`.
  ///@param to populate offers until this index (exclusive). Must be at most `pricePoints`.
  ///@param baseQuoteTickIndex0 the tick of base per quote for the price point at index 0. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  ///@param _baseQuoteTickOffset the tick offset used for the geometric progression deployment. Must be at least 1. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  ///@param firstAskIndex the (inclusive) index after which offer should be an ask. Must be at most `pricePoints`.
  ///@param bidGives The initial amount of quote to give for all bids. If 0, only book the offer, if type(uint).max then askGives is used as base for bids, and the quote the bid gives is set to according to the price.
  ///@param askGives The initial amount of base to give for all asks. If 0, only book the offer, if type(uint).max then bidGives is used as quote for asks, and the base the ask gives is set to according to the price.
  ///@param stepSize in amount of price points to jump for posting dual offer. Must be less than `pricePoints`.
  ///@param pricePoints the number of price points for the Kandel instance. Must be at least 2.
  ///@return distribution the distribution of bids and asks to populate
  ///@dev the absolute price of an offer is the ratio of quote/base volumes of tokens it trades
  ///@dev the tick of offers on Mangrove are in relative taker price of maker's inbound/outbound volumes of tokens it trades
  ///@dev for Bids, outbound_tkn=quote, inbound_tkn=base so relative taker price of a a bid is the inverse of the absolute price.
  ///@dev for Asks, outbound_tkn=base, inbound_tkn=quote so relative taker price of an ask coincides with absolute price.
  ///@dev Index0 will contain the ask with the lowest relative price and the bid with the highest relative price. Absolute price is geometrically increasing over indexes.
  ///@dev tickOffset moves an offer relative price s.t. `AskTick_{i+1} = AskTick_i + tickOffset` and `BidTick_{i+1} = BidTick_i - tickOffset`
  ///@dev A hole is left in the middle at the size of stepSize - either an offer or its dual is posted, not both.
  ///@dev The caller should make sure the minimum and maximum tick does not exceed the MIN_TICK and MAX_TICK from respectively; otherwise, populate will fail for those offers.
  ///@dev If type(uint).max is used for `bidGives` or `askGives` then very high or low prices can yield gives=0 (which results in both offer an dual being dead) or gives>=type(uin96).max which is not supported by Mangrove.
  function createGeometricDistribution(
    uint from,
    uint to,
    Tick baseQuoteTickIndex0,
    uint _baseQuoteTickOffset,
    uint firstAskIndex,
    uint bidGives,
    uint askGives,
    uint pricePoints,
    uint stepSize
  ) external pure returns (DirectWithBidsAndAsksDistribution.Distribution memory distribution) {
    require(bidGives != type(uint).max || askGives != type(uint).max, "Kandel/bothGivesVariable");

    // First we restrict boundaries of bids and asks.

    // Create live bids up till first ask, except stop where live asks will have a dual bid.
    uint bidBound;
    {
      // Rounding - we skip an extra live bid if stepSize is odd.
      uint bidHoleSize = stepSize / 2 + stepSize % 2;
      // If first ask is close to start, then there are no room for live bids.
      bidBound = firstAskIndex > bidHoleSize ? firstAskIndex - bidHoleSize : 0;
      // If stepSize is large there is not enough room for dual outside
      uint lastBidWithPossibleDualAsk = pricePoints - stepSize;
      if (bidBound > lastBidWithPossibleDualAsk) {
        bidBound = lastBidWithPossibleDualAsk;
      }
    }
    // Here firstAskIndex becomes the index of the first actual ask, and not just the boundary - we need to take `stepSize` and `from` into account.
    firstAskIndex = firstAskIndex + stepSize / 2;
    // We should not place live asks near the beginning, there needs to be room for the dual bid.
    if (firstAskIndex < stepSize) {
      firstAskIndex = stepSize;
    }

    // Finally, account for the from/to boundaries
    if (to < bidBound) {
      bidBound = to;
    }
    if (firstAskIndex < from) {
      firstAskIndex = from;
    }

    // Allocate distributions - there should be room for live bids and asks, and their duals.
    {
      uint count = (from < bidBound ? bidBound - from : 0) + (firstAskIndex < to ? to - firstAskIndex : 0);
      distribution.bids = new DirectWithBidsAndAsksDistribution.DistributionOffer[](count);
      distribution.asks = new DirectWithBidsAndAsksDistribution.DistributionOffer[](count);
    }

    // Start bids at from
    uint index = from;
    // Calculate the taker relative tick of the first price point
    int tick = -(Tick.unwrap(baseQuoteTickIndex0) + int(_baseQuoteTickOffset) * int(index));
    // A counter for insertion in the distribution structs
    uint i = 0;
    for (; index < bidBound; ++index) {
      // Add live bid
      // Use askGives unless it should be derived from bid at the price
      distribution.bids[i] = DirectWithBidsAndAsksDistribution.DistributionOffer({
        index: index,
        tick: Tick.wrap(tick),
        gives: bidGives == type(uint).max ? Tick.wrap(tick).outboundFromInbound(askGives) : bidGives
      });

      // Add dual (dead) ask
      uint dualIndex = transportDestination(OfferType.Ask, index, stepSize, pricePoints);
      distribution.asks[i] = DirectWithBidsAndAsksDistribution.DistributionOffer({
        index: dualIndex,
        tick: Tick.wrap((Tick.unwrap(baseQuoteTickIndex0) + int(_baseQuoteTickOffset) * int(dualIndex))),
        gives: 0
      });

      // Next tick
      tick -= int(_baseQuoteTickOffset);
      ++i;
    }

    // Start asks from (adjusted) firstAskIndex
    index = firstAskIndex;
    // Calculate the taker relative tick of the first ask
    tick = (Tick.unwrap(baseQuoteTickIndex0) + int(_baseQuoteTickOffset) * int(index));
    for (; index < to; ++index) {
      // Add live ask
      // Use askGives unless it should be derived from bid at the price
      distribution.asks[i] = DirectWithBidsAndAsksDistribution.DistributionOffer({
        index: index,
        tick: Tick.wrap(tick),
        gives: askGives == type(uint).max ? Tick.wrap(tick).outboundFromInbound(bidGives) : askGives
      });
      // Add dual (dead) bid
      uint dualIndex = transportDestination(OfferType.Bid, index, stepSize, pricePoints);
      distribution.bids[i] = DirectWithBidsAndAsksDistribution.DistributionOffer({
        index: dualIndex,
        tick: Tick.wrap(-(Tick.unwrap(baseQuoteTickIndex0) + int(_baseQuoteTickOffset) * int(dualIndex))),
        gives: 0
      });

      // Next tick
      tick += int(_baseQuoteTickOffset);
      ++i;
    }
  }
}
