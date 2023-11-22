import { Market } from "@mangrovedao/mangrove.js";
import Big from "big.js";
import { TickLib } from "@mangrovedao/mangrove.js/dist/nodejs/util/coreCalculations/TickLib";
import { BigNumber } from "ethers";

/**
 * This function calculates the minimum assets that a taker is willing to exchange, considering whether it's a bid or ask offer.
 * It starts by setting `takerWants` to the smallest amount of `outboundTkn` that an offer can send,
 * which is determined by `1 / (10**(outboundTkn.decimals))`. Then, it computes `takerGives` by multiplying
 * this value by the price (wants/gives). It checks whether the computed amount is greater than the minimum possible volume of `inboundTkn`,
 * which is `1 / (10**(inboundTkn.decimals))`. If it's not, the logic is reversed: it first tries to
 * set `takerGives` to the minimum volume of `inboundTkn`, and then it calculates `takerWants` by multiplying this value by the inverse of the price.
 * returns takerWants
 ***/
export const cleanUsingMinimalAmountOfFunds = (
  market: Market,
  ba: Market.BA,
  offer: Market.Offer
): Big => {
  if (!offer.price) {
    return new Big(0);
  }

  const inboundTkn = ba == "bids" ? market.base : market.quote;
  const outboundTkn = ba == "bids" ? market.quote : market.base;

  // const mingivesBig = outboundTkn.fromUnits(1)
  // console.log("mingivesBig", mingivesBig.toString())

  // let minGivesVolume = BigNumber.from(outboundTkn.fromUnits(1).toString());

  let minGives = BigNumber.from(1);
  let minWants = TickLib.inboundFromOutbound(offer.tick, minGives);

  if (minWants.eq(0)) {
    minGives = TickLib.outboundFromInbound(offer.tick, BigNumber.from(1));
    minWants = TickLib.inboundFromOutbound(offer.tick, minGives.add(1));
  }

  console.log("minGives", minGives.toString());
  console.log("minWants", minWants.toString());

  return new Big(minWants.toString()).div(new Big(10).pow(inboundTkn.decimals));

  // const wants = market
  //   .getBook()
  //   [ba].tickPriceHelper.inboundFromOutbound(offer.tick, offer.gives);

  // let price = wants.div(offer.gives);

  // const minPossibleWantsVolume = inboundTkn.fromUnits(1);
  // let minGivesVolume = outboundTkn.fromUnits(1);
  // let minWantsVolume = price.mul(minGivesVolume);

  // if (minWantsVolume.lt(minPossibleWantsVolume)) {
  //   minWantsVolume = minPossibleWantsVolume;
  //   minGivesVolume = new Big(1).div(price).mul(minWantsVolume);
  // }

  // return {
  //   takerWants: minGivesVolume,
  //   takerGives: minWantsVolume.plus(inboundTkn.fromUnits(1).toString()),
  // };
};
