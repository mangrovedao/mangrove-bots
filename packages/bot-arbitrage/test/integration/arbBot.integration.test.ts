/**
 * Integration tests of ArbBot.ts.
 */
import { afterEach, beforeEach, describe, it } from "mocha";

import { Mangrove, mgvTestUtil } from "@mangrovedao/mangrove.js";

import assert from "assert";
import { logger } from "../../src/util/logger";
import { ArbBot } from "../../src/ArbBot";
import { getPoolContract } from "../../src/uniswap/libs/uniswapUtils";
import { activateTokensWithMgv } from "../../src/util/ArbBotUtils";

let mgv: Mangrove;
let mgvDeployer: Mangrove;
let mgvArbitrager: Mangrove;

describe("ArbBot integration tests", () => {
  beforeEach(async function () {
    mgv = await Mangrove.connect({
      privateKey: this.accounts.maker.key,
      provider: this.server.url,
      blockManagerOptions: {
        maxBlockCached: 5,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 5,
      },
    });
    mgvDeployer = await Mangrove.connect({
      privateKey: this.accounts.deployer.key,
      provider: mgv.provider,
      blockManagerOptions: {
        maxBlockCached: 5,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 5,
      },
    });

    mgvArbitrager = await Mangrove.connect({
      privateKey: this.accounts.arbitrager.key,
      provider: this.server.url,
      blockManagerOptions: {
        maxBlockCached: 5,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 5,
      },
    });

    const arb = mgv.getAddress("MgvArbitrage");
    const weth = await mgv.token("WETH");
    const dai = await mgv.token("DAI");
    await this.server.deal({
      token: weth.address,
      account: this.accounts.maker.address,
      amount: 100,
    });

    await this.server.deal({
      token: dai.address,
      account: this.accounts.maker.address,
      amount: 100000,
    });

    await this.server.deal({ token: dai.address, account: arb, amount: 10000 });
    logger.debug(
      `--label ${this.accounts.maker.address}:maker --label ${this.accounts.deployer.address}:deployer --label ${arb}:arbContract --label ${weth.address}:weth --label ${dai.address}:dai --label ${mgv.address}:mangrove`
    );

    mgvTestUtil.setConfig(mgv, this.accounts, mgvDeployer);
    mgvTestUtil.initPollOfTransactionTracking(mgvDeployer.provider);
  });

  afterEach(async function () {
    mgvTestUtil.stopPollOfTransactionTracking();
    mgvDeployer.disconnect();
    mgv.disconnect();
    mgvArbitrager.disconnect();
  });

  describe("test arb bot", () => {
    it(`should find arb and do arb, ask`, async function () {
      const market = await mgv.market({ base: "WETH", quote: "DAI" });
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");

      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeAskProvision();
      const offer = await lp.newAsk({ wants: 1, gives: 1, fund: provision });
      await mgvTestUtil.waitForTransaction(
        await market.base.approve(mgv.address, 1000)
      );
      await mgvTestUtil.waitForTransaction(
        await market.quote.approve(mgv.address, 1000)
      );
      const poolContract = await getPoolContract({
        in: market.base.address,
        out: market.quote.address,
        fee: 3000,
        provider: mgv.provider,
      });
      const arbBot = new ArbBot(mgvArbitrager, poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate);
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const txs = await arbBot.run(market, ["WETH", "DAI", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: {
          exchange: "Uniswap",
          fee: () => 100,
        },
      });
      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);
      const receipt = await mgvTestUtil.waitForTransaction(txs.askTransaction);
      await mgvTestUtil.waitForBlock(mgv, receipt.blockNumber);
      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseBeforeBalance,
        baseAfterBalance,
        "Should have the same amount of base"
      );
      assert.ok(
        quoteBeforeBalance < quoteAfterBalance,
        "Should have gained quote"
      );
    });

    it(`should find arb and do arb, bid`, async function () {
      const market = await mgv.market({ base: "WETH", quote: "DAI" });
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");

      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeBidProvision();
      const offer = await lp.newBid({
        wants: 1,
        gives: 10000,
        fund: provision,
      });
      await mgvTestUtil.waitForTransaction(
        await market.base.approve(mgv.address, 100000)
      );
      await mgvTestUtil.waitForTransaction(
        await market.quote.approve(mgv.address, 100000)
      );
      const poolContract = await getPoolContract({
        in: market.quote.address,
        out: market.base.address,
        fee: 3000,
        provider: mgv.provider,
      });
      const arbBot = new ArbBot(mgvArbitrager, poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate);
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const txs = await arbBot.run(market, ["WETH", "DAI", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: {
          exchange: "Uniswap",
          fee: () => 3000,
        },
      });
      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);
      const receipt = await mgvTestUtil.waitForTransaction(txs.bidTransaction);
      await mgvTestUtil.waitForBlock(mgv, receipt.blockNumber);
      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseBeforeBalance,
        baseAfterBalance,
        "Should have the same amount of base"
      );
      assert.ok(
        quoteBeforeBalance < quoteAfterBalance,
        "Should have gained quote"
      );
    });

    it(`should not be profitable, don't do arb`, async function () {
      const market = await mgv.market({ base: "WETH", quote: "DAI" });
      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeAskProvision();
      const offer = await lp.newAsk({ wants: 2000, gives: 1, fund: provision });
      await mgvTestUtil.waitForTransaction(
        await market.base.approve(mgv.address, 1000)
      );
      await mgvTestUtil.waitForTransaction(
        await market.quote.approve(mgv.address, 1000)
      );
      const poolContract = await getPoolContract({
        in: market.base.address,
        out: market.quote.address,
        fee: 3000,
        provider: mgv.provider,
      });
      const arbBot = new ArbBot(mgvArbitrager, poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate);
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const txs = await arbBot.run(market, ["WETH", "DAI", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: {
          exchange: "Uniswap",
          fee: () => 100,
        },
      });
      // try and get revert reason
      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);
      assert.strictEqual(txs.askTransaction, undefined);
      assert.strictEqual(txs.bidTransaction, undefined);
      assert.ok(await market.isLive("asks", offer.id));
      assert.deepStrictEqual(
        baseBeforeBalance,
        baseAfterBalance,
        "Should have the same amount of base"
      );
      assert.deepStrictEqual(
        quoteBeforeBalance,
        quoteAfterBalance,
        "Should have the same amount of quote"
      );
    });

    it(`should be profitable, exchange on Mangrove first`, async function () {
      const usdc = await mgv.token("USDC");
      const weth = await mgv.token("WETH");
      const dai = await mgv.token("DAI");
      await this.server.deal({
        token: usdc.address,
        account: this.accounts.maker.address,
        amount: 10000,
      });
      await this.server.deal({
        token: dai.address,
        account: this.accounts.maker.address,
        amount: 10000,
      });

      const usdcDaiMarket = await mgv.market({ base: "DAI", quote: "USDC" });
      const lpDAI = await mgv.liquidityProvider(usdcDaiMarket);
      const provisionDAI = await lpDAI.computeAskProvision();
      await lpDAI.newAsk({ wants: 10000, gives: 10000, fund: provisionDAI });
      await lpDAI.newBid({ wants: 10000, gives: 10000, fund: provisionDAI });
      await mgvTestUtil.waitForTransaction(
        await usdc.approve(mgv.address, 10000)
      );
      await mgvTestUtil.waitForTransaction(
        await dai.approve(mgv.address, 10000)
      );

      const market = await mgv.market({ base: "WETH", quote: "USDC" });
      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeAskProvision();
      const offer = await lp.newAsk({ wants: 1, gives: 1, fund: provision });
      await mgvTestUtil.waitForTransaction(
        await weth.approve(mgv.address, 10000)
      );
      const poolContract = await getPoolContract({
        in: market.base.address,
        out: market.quote.address,
        fee: 3000,
        provider: mgv.provider,
      });
      const arbBot = new ArbBot(mgvArbitrager, poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address, mgv.getAddress("DAI")],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate);
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingTokenBeforeBalance = await dai.balanceOf(mgvArbAddress);
      const txs = await arbBot.run(market, ["WETH", "USDC", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: { exchange: "Mangrove" },
      });
      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingTokenAfterBalance = await dai.balanceOf(mgvArbAddress);
      const receipt = await mgvTestUtil.waitForTransaction(txs.askTransaction);
      await mgvTestUtil.waitForBlock(mgv, receipt.blockNumber);
      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseBeforeBalance,
        baseAfterBalance,
        "Should have the same amount of base"
      );
      assert.deepStrictEqual(
        quoteBeforeBalance,
        quoteAfterBalance,
        "Should have the same amount of base"
      );
      assert.ok(
        holdingTokenBeforeBalance < holdingTokenAfterBalance,
        "Should have gained holding token"
      );
    });

    it(`should be profitable, exchange on Uniswap first`, async function () {
      const market = await mgv.market({ base: "WETH", quote: "USDC" });
      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeAskProvision();
      const offer = await lp.newAsk({ wants: 1, gives: 1, fund: provision });
      await mgvTestUtil.waitForTransaction(
        await market.base.approve(mgv.address, 1000)
      );
      await mgvTestUtil.waitForTransaction(
        await market.quote.approve(mgv.address, 1000)
      );
      const poolContract = await getPoolContract({
        in: market.base.address,
        out: market.quote.address,
        fee: 3000,
        provider: mgv.provider,
      });
      const arbBot = new ArbBot(mgvArbitrager, poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address, mgv.getAddress("DAI")],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate);
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingTokenBeforeBalance = await (
        await mgv.token("DAI")
      ).balanceOf(mgvArbAddress);
      const transactions = await arbBot.run(market, ["WETH", "USDC", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: { exchange: "Uniswap", fee: () => 100 },
      });
      let receipts;
      if (transactions.askTransaction)
        receipts = await mgvTestUtil.waitForTransaction(
          transactions.askTransaction
        );
      else
        receipts = await mgvTestUtil.waitForTransaction(
          transactions.bidTransaction
        );
      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingTokenAfterBalance = await (
        await mgv.token("DAI")
      ).balanceOf(mgvArbAddress);
      await mgvTestUtil.waitForBlock(market.mgv, receipts.blockNumber);
      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseBeforeBalance,
        baseAfterBalance,
        "Should have the same amount of base"
      );
      assert.deepStrictEqual(
        quoteBeforeBalance,
        quoteAfterBalance,
        "Should have the same amount of base"
      );
      assert.ok(
        holdingTokenBeforeBalance < holdingTokenAfterBalance,
        "Should have gained holding token"
      );
    });

    //TODO: Test configs
  });
});
