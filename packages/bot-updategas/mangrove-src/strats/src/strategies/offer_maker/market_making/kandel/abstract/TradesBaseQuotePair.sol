// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";

///@title a bid or an ask.
enum OfferType {
  Bid,
  Ask
}

///@title Interface contract for strats needing offer type to offer list mapping.
abstract contract IHasOfferListOfOfferType {
  ///@notice turns an offer type into an (outbound_tkn, inbound_tkn, tickSpacing) pair identifying an offer list.
  ///@param ba whether one wishes to access the offer lists where asks or bids are posted.
  ///@return olKey the olKey defining the token pair
  function offerListOfOfferType(OfferType ba) internal view virtual returns (OLKey memory olKey);

  ///@notice returns the offer type of the offer list whose outbound token is given in the argument.
  ///@param outbound_tkn the outbound token
  ///@return ba the offer type
  function offerTypeOfOutbound(IERC20 outbound_tkn) internal view virtual returns (OfferType ba);

  ///@notice returns the outbound token for the offer type
  ///@param ba the offer type
  ///@return token the outbound token
  function outboundOfOfferType(OfferType ba) internal view virtual returns (IERC20 token);
}

///@title Adds basic base/quote trading pair for bids and asks and couples it to Mangrove's gives, wants, outbound, inbound terminology.
///@dev Implements the IHasOfferListOfOfferType interface contract.
abstract contract TradesBaseQuotePair is IHasOfferListOfOfferType {
  ///@notice base of the market Kandel is making
  IERC20 public immutable BASE;
  ///@notice quote of the market Kandel is making
  IERC20 public immutable QUOTE;
  ///@notice tickSpacing of the market Kandel is making
  uint public immutable TICK_SPACING;

  ///@notice The traded offer list
  ///@param olKeyHash of the market Kandel is making
  ///@notice we only emit this, so that the events for a Kandel is self contained. If one uses the KandelSeeder to deploy, then this information is already available from NewKandel or NewAaveKandel events.
  event OfferListKey(bytes32 olKeyHash);

  ///@notice Constructor
  ///@param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
  constructor(OLKey memory olKeyBaseQuote) {
    BASE = IERC20(olKeyBaseQuote.outbound_tkn);
    QUOTE = IERC20(olKeyBaseQuote.inbound_tkn);
    TICK_SPACING = olKeyBaseQuote.tickSpacing;
    emit OfferListKey(olKeyBaseQuote.hash());
  }

  ///@inheritdoc IHasOfferListOfOfferType
  function offerListOfOfferType(OfferType ba) internal view override returns (OLKey memory olKey) {
    return ba == OfferType.Bid
      ? OLKey(address(QUOTE), address(BASE), TICK_SPACING)
      : OLKey(address(BASE), address(QUOTE), TICK_SPACING);
  }

  ///@inheritdoc IHasOfferListOfOfferType
  function offerTypeOfOutbound(IERC20 outbound_tkn) internal view override returns (OfferType) {
    return outbound_tkn == BASE ? OfferType.Ask : OfferType.Bid;
  }

  ///@inheritdoc IHasOfferListOfOfferType
  function outboundOfOfferType(OfferType ba) internal view override returns (IERC20 token) {
    token = ba == OfferType.Ask ? BASE : QUOTE;
  }

  ///@notice returns the dual offer type
  ///@param ba whether the offer is an ask or a bid
  ///@return baDual is the dual offer type (ask for bid and conversely)
  function dual(OfferType ba) internal pure returns (OfferType baDual) {
    return OfferType((uint(ba) + 1) % 2);
  }
}
