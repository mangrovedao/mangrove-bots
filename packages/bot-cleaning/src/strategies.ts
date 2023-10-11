import { Market } from "@mangrovedao/mangrove.js";
import Big from "big.js";

type SnipeParams = {
  takerWants: Big;
  takerGives: Big;
};

/**
 * This function calculates the minimum assets that a taker is willing to exchange, considering whether it's a bid or ask offer.
 * It starts by setting `takerWants` to the smallest amount of `outboundTkn` that an offer can send,
 * which is determined by `1 / (10**(outboundTkn.decimals))`. Then, it computes `takerGives` by multiplying
 * this value by the price (wants/gives). It checks whether the computed amount is greater than the minimum possible volume of `inboundTkn`,
 * which is `1 / (10**(inboundTkn.decimals))`. If it's not, the logic is reversed: it first tries to
 * set `takerGives` to the minimum volume of `inboundTkn`, and then it calculates `takerWants` by multiplying this value by the inverse of the price.
 ***/
export const cleanUsingMinimalAmountOfFunds = (
  market: Market,
  ba: Market.BA,
  offer: Market.Offer
): SnipeParams => {
  if (!offer.price) {
    return {
      takerWants: new Big(0),
      takerGives: new Big(0),
    };
  }

  const inboundTkn = ba == "bids" ? market.base : market.quote;
  const outboundTkn = ba == "bids" ? market.quote : market.base;

  let price = offer.wants.div(offer.gives);

  const minPossibleWantsVolume = inboundTkn.fromUnits(1);
  let minGivesVolume = outboundTkn.fromUnits(1);
  let minWantsVolume = price.mul(minGivesVolume);

  if (minWantsVolume.lt(minPossibleWantsVolume)) {
    minWantsVolume = minPossibleWantsVolume;
    minGivesVolume = new Big(1).div(price).mul(minWantsVolume);
  }

  return {
    takerWants: minGivesVolume,
    takerGives: minWantsVolume,
  };
};
