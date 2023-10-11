import { Market } from "@mangrovedao/mangrove.js";
import { Bigish } from "@mangrovedao/mangrove.js/dist/nodejs/types";
import UnitCalculations from "@mangrovedao/mangrove.js/dist/nodejs/util/unitCalculations";
import Big from "big.js";
import { expect } from "chai";
import { ethers } from "ethers";

import { describe, it } from "mocha";
import { cleanUsingMinimalAmountOfFunds } from "../../src/strategies";

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

const generateMockOfferWithGivesAndWants = (
  gives: Big,
  wants: Big,
  price: Big
) => ({
  id: 1,
  prev: undefined,
  gasprice: 1,
  maker: "",
  gasreq: 1,
  wants: wants,
  gives: gives,
  volume: new Big(1),
  price,
  next: undefined,
  offer_gasbase: 1,
});

describe("Unit test suite for strategies", () => {
  const WETH = new MockMgvToken("WETH", 18);
  const USDC = new MockMgvToken("USDC", 6);
  const USDT = new MockMgvToken("USDT", 6);

  it("WETH/USDC ask: test cleanUsingMinimalAmountOfFunds token with two different decimals", async () => {
    const market = new MockMarket(WETH, USDC) as Market;
    const ask: Market.Offer = generateMockOfferWithGivesAndWants(
      new Big(1),
      new Big(1600),
      new Big(1600)
    );

    const results = cleanUsingMinimalAmountOfFunds(market, "asks", ask);

    expect(results.takerGives.toString()).to.equal(
      new Big(1).div(new Big(10).pow(USDC.decimals)).toString()
    );
    expect(results.takerWants.toString()).to.equal("6.25e-10");
  });

  it("WETH/USDC bid: test cleanUsingMinimalAmountOfFunds token with two different decimals", async () => {
    const market = new MockMarket(WETH, USDC) as Market;
    const bid: Market.Offer = generateMockOfferWithGivesAndWants(
      new Big(1600),
      new Big(1),
      new Big(1600)
    );

    const results = cleanUsingMinimalAmountOfFunds(market, "bids", bid);

    expect(results.takerGives.toString()).to.equal("6.25e-10");
    expect(results.takerWants.toString()).to.equal(
      new Big(1).div(new Big(10).pow(USDC.decimals)).toString()
    );
  });

  it("USDC/USDT ask: test cleanUsingMinimalAmountOfFunds token with same decimals", async () => {
    const market = new MockMarket(USDC, USDT) as Market;
    const ask: Market.Offer = generateMockOfferWithGivesAndWants(
      new Big(1.001),
      new Big(0.999),
      new Big(1.001).div(new Big(0.999))
    );

    const results = cleanUsingMinimalAmountOfFunds(market, "asks", ask);

    expect(
      USDT.fromUnits(USDT.toUnits(results.takerGives)).toString()
    ).to.equal("0.000001");
    expect(results.takerWants.toString()).to.equal(
      new Big(1).div(new Big(10).pow(USDC.decimals)).toString()
    );
  });

  it("USDC/USDT bid: test cleanUsingMinimalAmountOfFunds token with same decimals", async () => {
    const market = new MockMarket(USDC, USDT) as Market;
    const bid: Market.Offer = generateMockOfferWithGivesAndWants(
      new Big(0.999),
      new Big(1.001),
      new Big(1.001).div(new Big(0.999))
    );

    const results = cleanUsingMinimalAmountOfFunds(market, "bids", bid);

    expect(
      USDC.fromUnits(USDC.toUnits(results.takerWants)).toString()
    ).to.equal("0.000001");
    expect(results.takerGives.toString()).to.equal(
      new Big(1).div(new Big(10).pow(USDT.decimals)).toString()
    );
  });
});
