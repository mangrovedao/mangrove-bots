// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {IMangrove} from "@mgv/src/IMangrove.sol";
import {CoreKandel} from "./CoreKandel.sol";
import {MAX_TICK, MIN_TICK} from "@mgv/lib/core/Constants.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {KandelLib} from "./KandelLib.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

///@title Adds a geometric price progression to a `CoreKandel` strat without storing prices for individual price points.
abstract contract GeometricKandel is CoreKandel {
  ///@notice The tick offset for absolute price used for the on-chain geometric progression deployment in `createDistribution`. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  ///@param value the tick offset.
  event SetBaseQuoteTickOffset(uint value);
  ///@notice By emitting this data, an indexer will be able to keep track of what the stepSize and tickOffset is for the Kandel instance.

  ///@notice The tick offset for absolute price used for the on-chain geometric progression deployment in `createDistribution`. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  uint public baseQuoteTickOffset;

  ///@notice Constructor
  ///@param mgv The Mangrove deployment.
  ///@param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
  ///@param reserveId identifier of this contract's reserve when using a router.
  constructor(IMangrove mgv, OLKey memory olKeyBaseQuote, address reserveId) CoreKandel(mgv, olKeyBaseQuote, reserveId) {}

  ///@notice sets the tick offset if different from existing.
  ///@param _baseQuoteTickOffset the new tick offset.
  function setBaseQuoteTickOffset(uint _baseQuoteTickOffset) public onlyAdmin {
    require(uint24(_baseQuoteTickOffset) == _baseQuoteTickOffset, "Kandel/tickOffsetTooHigh");
    if (baseQuoteTickOffset != _baseQuoteTickOffset) {
      baseQuoteTickOffset = _baseQuoteTickOffset;
      emit SetBaseQuoteTickOffset(_baseQuoteTickOffset);
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
  function createDistribution(
    uint from,
    uint to,
    Tick baseQuoteTickIndex0,
    uint _baseQuoteTickOffset,
    uint firstAskIndex,
    uint bidGives,
    uint askGives,
    uint pricePoints,
    uint stepSize
  ) public pure returns (Distribution memory distribution) {
    return KandelLib.createGeometricDistribution(
      from, to, baseQuoteTickIndex0, _baseQuoteTickOffset, firstAskIndex, bidGives, askGives, pricePoints, stepSize
    );
  }

  ///@notice publishes bids/asks according to a geometric distribution, and sets all parameters according to inputs.
  ///@param from populate offers starting from this index (inclusive).
  ///@param to populate offers until this index (exclusive).
  ///@param baseQuoteTickIndex0 the tick of base per quote for the price point at index 0. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  ///@param _baseQuoteTickOffset the tick offset used for the geometric progression deployment. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  ///@param firstAskIndex the (inclusive) index after which offer should be an ask.
  ///@param bidGives The initial amount of quote to give for all bids. If 0, only book the offer, if type(uint).max then askGives is used as base for bids, and the quote the bid gives is set to according to the price.
  ///@param askGives The initial amount of base to give for all asks. If 0, only book the offer, if type(uint).max then bidGives is used as quote for asks, and the base the ask gives is set to according to the price.
  ///@param parameters the parameters for Kandel. Only changed parameters will cause updates. Set `gasreq` and `gasprice` to 0 to keep existing values.
  ///@param baseAmount base amount to deposit
  ///@param quoteAmount quote amount to deposit
  ///@dev See `createDistribution` for further details.
  function populateFromOffset(
    uint from,
    uint to,
    Tick baseQuoteTickIndex0,
    uint _baseQuoteTickOffset,
    uint firstAskIndex,
    uint bidGives,
    uint askGives,
    Params calldata parameters,
    uint baseAmount,
    uint quoteAmount
  ) public payable onlyAdmin {
    if (msg.value > 0) {
      MGV.fund{value: msg.value}();
    }
    setParams(parameters);
    setBaseQuoteTickOffset(_baseQuoteTickOffset);

    depositFunds(baseAmount, quoteAmount);

    populateChunkFromOffset(from, to, baseQuoteTickIndex0, firstAskIndex, bidGives, askGives);
  }

  ///@notice publishes bids/asks according to a geometric distribution, and reads parameters from the Kandel instance.
  ///@param from populate offers starting from this index (inclusive).
  ///@param to populate offers until this index (exclusive).
  ///@param baseQuoteTickIndex0 the tick of base per quote for the price point at index 0. It is recommended that this is a multiple of tickSpacing for the offer lists to avoid rounding.
  ///@param firstAskIndex the (inclusive) index after which offer should be an ask.
  ///@param bidGives The initial amount of quote to give for all bids. If 0, only book the offer, if type(uint).max then askGives is used as base for bids, and the quote the bid gives is set to according to the price.
  ///@param askGives The initial amount of base to give for all asks. If 0, only book the offer, if type(uint).max then bidGives is used as quote for asks, and the base the ask gives is set to according to the price.
  ///@dev This is typically used after a call to `populateFromOffset` to populate the rest of the offers with the same parameters. See that function for further details.
  function populateChunkFromOffset(
    uint from,
    uint to,
    Tick baseQuoteTickIndex0,
    uint firstAskIndex,
    uint bidGives,
    uint askGives
  ) public payable onlyAdmin {
    Params memory parameters = params;
    Distribution memory distribution = createDistribution(
      from,
      to,
      baseQuoteTickIndex0,
      baseQuoteTickOffset,
      firstAskIndex,
      bidGives,
      askGives,
      parameters.pricePoints,
      parameters.stepSize
    );
    populateChunkInternal(distribution, parameters.gasreq, parameters.gasprice);
  }
}
