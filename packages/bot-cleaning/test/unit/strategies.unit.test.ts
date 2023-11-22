import { Market } from "@mangrovedao/mangrove.js";
import { Bigish } from "@mangrovedao/mangrove.js/dist/nodejs/types";
import UnitCalculations from "@mangrovedao/mangrove.js/dist/nodejs/util/unitCalculations";
import Big from "big.js";
import { expect } from "chai";
import { BigNumber, ethers } from "ethers";

import { describe, it } from "mocha";
import { cleanUsingMinimalAmountOfFunds } from "../../src/strategies";
import { TickLib } from "@mangrovedao/mangrove.js/dist/nodejs/util/coreCalculations/TickLib";

class MockMgvToken {
  constructor(public name: string, public decimals: number) {}

  fromUnits(amount: string | number | ethers.BigNumber): Big {
    return UnitCalculations.fromUnits(amount, this.decimals);
  }

  toUnits(amount: Bigish): ethers.BigNumber {
    return UnitCalculations.toUnits(amount, this.decimals);
  }
}

class MockMarket {
  constructor(public base: MockMgvToken, public quote: MockMgvToken) {}
}

type Volume = {
  gives: Big;
  wants: Big;
};

const generateMockOfferWithGivesAndWants = (
  volume: Volume,
  market: Market,
  ba: Market.BA
): Market.Offer => {
  const { gives, wants } = volume;

  const inboundTkn = ba == "bids" ? market.base : market.quote;
  const outboundTkn = ba == "bids" ? market.quote : market.base;

  const tick = TickLib.tickFromVolumes(
    inboundTkn.toUnits(wants),
    outboundTkn.toUnits(gives)
  );

  return {
    id: 1,
    prev: undefined,
    gasprice: 1,
    maker: "",
    gasreq: 1,
    gives: gives,
    tick: BigNumber.from(tick.toString()),
    volume: new Big(1),
    price: new Big(0),
    next: undefined,
    offer_gasbase: 1,
  };
};

describe("Unit test suite for strategies", () => {
  const WETH = new MockMgvToken("WETH", 18);
  const USDC = new MockMgvToken("USDC", 6);
  const USDT = new MockMgvToken("USDT", 6);

  it("WETH/USDC ask: test cleanUsingMinimalAmountOfFunds token with two different decimals", async () => {
    const market = new MockMarket(WETH, USDC) as Market;
    const ask: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(1),
        wants: new Big(1600),
      },
      market,
      "asks"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market, "asks", ask);
    console.log(wants.toString());
    expect(wants.toString()).to.equal("0.000001");
  });

  it("WETH/USDC bid: test cleanUsingMinimalAmountOfFunds token with two different decimals", async () => {
    const market = new MockMarket(WETH, USDC) as Market;
    const bid: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(1600),
        wants: new Big(1),
      },
      market,
      "bids"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market, "bids", bid);
    console.log(wants.toString());
    expect(wants.toString()).to.equal("6.2495322e-10");
  });

  it("USDC/USDT ask: test cleanUsingMinimalAmountOfFunds token with same decimals", async () => {
    const market = new MockMarket(USDC, USDT) as Market;
    const ask: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(1.001),
        wants: new Big(0.999),
      },
      market,
      "asks"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market, "asks", ask);

    expect(USDC.toUnits(wants).toString()).to.equal("1");
  });

  it("USDC/USDT bid: test cleanUsingMinimalAmountOfFunds token with same decimals", async () => {
    const market = new MockMarket(USDC, USDT) as Market;
    const bid: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(0.999),
        wants: new Big(1.001),
      },
      market,
      "bids"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market, "bids", bid);

    expect(USDT.toUnits(wants).toString()).to.equal("1");
  });
});
