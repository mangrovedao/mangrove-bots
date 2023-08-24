/**
 * Unit tests of Kandel Exit.
 */
import { describe, it } from "mocha";

import assert from "assert";
import { encodePriceSqrt } from "../../src/uniswap/initializePool";

describe("Kandel exit integration tests", () => {
  it("price test, decimals0 < decimals1", async () => {
    const reserve0 = 1;
    const reserve0Decimals = 6;
    const reserve0Name = "usdc";
    const reserve1 = 1888;
    const reserve1Decimals = 18;
    const reserve1Name = "weth";
    const pinfo = encodePriceSqrt(
      reserve0,
      reserve0Decimals,
      reserve0Name,
      reserve1,
      reserve1Decimals,
      reserve1Name
    );
    assert.strictEqual(
      pinfo.priceInverse.price.toNumber(),
      1888,
      "inverse price is not correct"
    );
    assert.strictEqual(
      pinfo.price.price.decimalPlaces(8).toNumber(),
      0.00052966,
      "price is not correct"
    );
  }),
    it("price test, decimals0 > decimals1", async () => {
      const reserve0 = 1888;
      const reserve0Decimals = 18;
      const reserve0Name = "weth";
      const reserve1 = 1;
      const reserve1Decimals = 6;
      const reserve1Name = "usdc";
      const pinfo = encodePriceSqrt(
        reserve0,
        reserve0Decimals,
        reserve0Name,
        reserve1,
        reserve1Decimals,
        reserve1Name
      );
      assert.strictEqual(
        pinfo.price.price.toNumber(),
        1888,
        "price is not correct"
      );
      assert.strictEqual(
        pinfo.priceInverse.price.decimalPlaces(8).toNumber(),
        0.00052966,
        "inverse price is not correct"
      );
    });

  it("price test, decimals0 == decimals1", async () => {
    const reserve0 = 1888;
    const reserve0Decimals = 18;
    const reserve0Name = "weth";
    const reserve1 = 1;
    const reserve1Decimals = 18;
    const reserve1Name = "dai";
    const pinfo = encodePriceSqrt(
      reserve0,
      reserve0Decimals,
      reserve0Name,
      reserve1,
      reserve1Decimals,
      reserve1Name
    );

    assert.strictEqual(
      pinfo.price.price.toNumber(),
      1888,
      "price is not correct"
    );
    assert.strictEqual(
      pinfo.priceInverse.price.decimalPlaces(8).toNumber(),
      0.00052966,
      "inverse price is not correct"
    );
  });
});
