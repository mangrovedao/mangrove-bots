import { Market, TokenCalculations } from "@mangrovedao/mangrove.js";
import Big from "big.js";
import * as TickLib from "@mangrovedao/mangrove.js/dist/nodejs/util/coreCalculations/TickLib";
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
  outbound_tkn: TokenCalculations,
  offer: Market.Offer
): Big => {
  if (!offer.price) {
    return new Big(0);
  }

  const tick = BigNumber.from(offer.tick);

  const takerGives = TickLib.inboundFromOutbound(tick, BigNumber.from(1));
  if (takerGives.eq(0)) {
    const takerWants = TickLib.outboundFromInbound(tick, BigNumber.from(1));

    return outbound_tkn.fromUnits(takerWants);
  }

  return outbound_tkn.fromUnits(1);
};
