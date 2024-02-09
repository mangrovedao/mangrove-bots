import { Market, Bigish, TokenCalculations } from "@mangrovedao/mangrove.js";
import UnitCalculations from "@mangrovedao/mangrove.js/dist/nodejs/util/unitCalculations";
import Big, { BigSource } from "big.js";
import { expect } from "chai";
import { ethers } from "ethers";

import { describe, it } from "mocha";
import { cleanUsingMinimalAmountOfFunds } from "../../src/strategies";
import * as TickLib from "@mangrovedao/mangrove.js/dist/nodejs/util/coreCalculations/TickLib";

class MockMgvToken extends TokenCalculations {
  constructor(public symbol: string, public decimals: number) {
    super(decimals, decimals);
  }

  fromUnits(amount: string | number | ethers.BigNumber): Big {
    return UnitCalculations.fromUnits(amount, this.decimals);
  }

  toUnits(amount: Bigish): ethers.BigNumber {
    return UnitCalculations.toUnits(amount, this.decimals);
  }
}

class MockMarket {
  constructor(
    public base: MockMgvToken,
    public quote: MockMgvToken,
    public tickSpacing: number
  ) {}
}

type Volume = {
  gives: Big;
  wants: Big;
};

type MarketLike = MockMarket | Market;

const generateMockOfferWithGivesAndWants = (
  volume: Volume,
  market: MarketLike,
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
    prevAtTick: undefined,
    gasprice: 1,
    maker: "",
    gasreq: 1,
    wants: wants,
    gives: gives,
    tick: tick.toNumber(),
    volume: new Big(1),
    price: new Big(0),
    nextAtTick: undefined,
    gasbase: 1,
  };
};

describe("Unit test suite for strategies", () => {
  const WETH = new MockMgvToken("WETH", 18);
  const USDC = new MockMgvToken("USDC", 6);
  const USDT = new MockMgvToken("USDT", 6);

  it("WETH/USDC ask: test cleanUsingMinimalAmountOfFunds token with two different decimals", async () => {
    const market = new MockMarket(WETH, USDC, 1);
    const ask: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(1),
        wants: new Big(1600),
      },
      market,
      "asks"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market.base, ask);
    console.log(wants.toString());
    expect(wants.toString()).to.equal("6.25015715e-10");
  });

  it("WETH/USDC bid: test cleanUsingMinimalAmountOfFunds token with two different decimals", async () => {
    const market = new MockMarket(WETH, USDC, 1);
    const bid: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(1600),
        wants: new Big(1),
      },
      market,
      "bids"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market.quote, bid);
    console.log(wants.toString());
    expect(wants.toString()).to.equal("0.000001");
  });

  it("USDC/USDT ask: test cleanUsingMinimalAmountOfFunds token with same decimals", async () => {
    const market = new MockMarket(USDC, USDT, 1);
    const ask: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(1.001),
        wants: new Big(0.999),
      },
      market,
      "asks"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market.base, ask);

    expect(USDC.toUnits(wants).toString()).to.equal("1");
  });

  it("USDC/USDT bid: test cleanUsingMinimalAmountOfFunds token with same decimals", async () => {
    const market = new MockMarket(USDC, USDT, 1);
    const bid: Market.Offer = generateMockOfferWithGivesAndWants(
      {
        gives: new Big(0.999),
        wants: new Big(1.001),
      },
      market,
      "bids"
    );

    const wants = cleanUsingMinimalAmountOfFunds(market.quote, bid);

    expect(USDT.toUnits(wants).toString()).to.equal("1");
  });
});
