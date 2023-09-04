/**
 * Integration tests of ArbBot.ts.
 */
import { afterEach, beforeEach, describe, it } from "mocha";

import { Mangrove, mgvTestUtil } from "@mangrovedao/mangrove.js";

import { Token } from "@uniswap/sdk-core";
import assert from "assert";
import { ArbBot } from "../../src/ArbBot";
import { getPoolInfo } from "../../src/uniswap/pool";
import { activateTokensWithMgv } from "../../src/util/ArbBotUtils";
import { logger } from "../../src/util/logger";
import { generateGetOutputQuote } from "../../src/uniswap/pricing";

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
    const usdc = await mgv.token("USDC");
    await weth.contract.mintTo(this.accounts.maker.address, weth.toUnits(100));
    await dai.contract.mintTo(this.accounts.maker.address, dai.toUnits(100000));
    await dai.contract.mintTo(arb, dai.toUnits(10000));

    logger.debug(
      `--label ${this.accounts.maker.address}:maker --label ${this.accounts.deployer.address}:deployer --label ${arb}:arbContract --label ${weth.address}:weth --label ${dai.address}:dai --label ${mgv.address}:mangrove --label ${usdc.address}:usdc`
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
        await market.base.approve(mgv.address, 1)
      );
      await mgvTestUtil.waitForTransaction(
        await market.quote.approve(mgv.address, 1)
      );
      const factoryAddress = mgv.getAddress("UniswapV3Factory");
      const poolInfo = await getPoolInfo(
        factoryAddress,
        new Token(mgv.network.id!, market.base.address, market.base.decimals),
        new Token(mgv.network.id!, market.quote.address, market.quote.decimals),
        3000,
        mgv.provider
      );
      const arbBot = new ArbBot(mgvArbitrager, poolInfo.poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate!);
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
        await market.quote.approve(mgv.address, 10000)
      );
      const factoryAddress = mgv.getAddress("UniswapV3Factory");
      const poolInfo = await getPoolInfo(
        factoryAddress,
        new Token(mgv.network.id!, market.quote.address, market.quote.decimals),
        new Token(mgv.network.id!, market.base.address, market.base.decimals),
        3000,
        mgv.provider
      );
      const arbBot = new ArbBot(mgvArbitrager, poolInfo.poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate!);
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
        await market.base.approve(mgv.address, 1)
      );
      const factoryAddress = mgv.getAddress("UniswapV3Factory");
      const poolInfo = await getPoolInfo(
        factoryAddress,
        new Token(mgv.network.id!, market.base.address, market.base.decimals),
        new Token(mgv.network.id!, market.quote.address, market.quote.decimals),
        3000,
        mgv.provider
      );
      const arbBot = new ArbBot(mgvArbitrager, poolInfo.poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate!);
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");
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
      await usdc.contract.mintTo(
        this.accounts.maker.address,
        usdc.toUnits(100000000)
      );
      await dai.contract.mintTo(
        this.accounts.maker.address,
        dai.toUnits(100000000)
      );

      const usdcDaiMarket = await mgv.market({ base: "DAI", quote: "USDC" });
      const lpDaiWeth = await mgv.liquidityProvider(usdcDaiMarket);
      const provisionAsk = await lpDaiWeth.computeAskProvision();
      const provisionBid = await lpDaiWeth.computeBidProvision();
      await lpDaiWeth.newAsk({
        wants: 200000,
        gives: 200000,
        fund: provisionAsk,
      });
      await lpDaiWeth.newBid({
        wants: 200000,
        gives: 200000,
        fund: provisionBid,
      });
      await mgvTestUtil.waitForTransaction(
        await usdc.approve(mgv.address, 200000)
      );
      await mgvTestUtil.waitForTransaction(
        await dai.approve(mgv.address, 200000)
      );

      const market = await mgv.market({ base: "WETH", quote: "USDC" });
      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeAskProvision();
      const offer = await lp.newAsk({ wants: 1, gives: 1, fund: provision });
      await mgvTestUtil.waitForTransaction(await weth.approve(mgv.address, 1));
      const factoryAddress = mgv.getAddress("UniswapV3Factory");
      const poolInfo = await getPoolInfo(
        factoryAddress,
        new Token(mgv.network.id!, market.base.address, market.base.decimals),
        new Token(mgv.network.id!, market.quote.address, market.quote.decimals),
        3000,
        mgv.provider
      );
      const arbBot = new ArbBot(mgvArbitrager, poolInfo.poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address, mgv.getAddress("DAI")],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate!);
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingDaiBeforeBalance = await dai.balanceOf(mgvArbAddress);
      const txs = await arbBot.run(market, ["WETH", "USDC", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: { exchange: "Mangrove" },
      });
      const receipt = await mgvTestUtil.waitForTransaction(txs.askTransaction);
      await mgvTestUtil.waitForBlock(mgv, receipt.blockNumber);
      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingWethfterBalance = await dai.balanceOf(mgvArbAddress);
      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseAfterBalance.minus(baseBeforeBalance).lte(1),
        true,
        `Base Should have the same amount of base as before (less then 1, because of rounding): ${baseBeforeBalance.toString()}  after:${baseAfterBalance.toString()}`
      );
      assert.deepStrictEqual(
        quoteBeforeBalance,
        quoteAfterBalance,
        "Quote Should have the same amount of base"
      );
      assert.ok(
        holdingDaiBeforeBalance < holdingWethfterBalance,
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
      const factoryAddress = mgv.getAddress("UniswapV3Factory");
      const poolInfo = await getPoolInfo(
        factoryAddress,
        new Token(mgv.network.id!, market.base.address, market.base.decimals),
        new Token(mgv.network.id!, market.quote.address, market.quote.decimals),
        3000,
        mgv.provider
      );
      const arbBot = new ArbBot(mgvArbitrager, poolInfo.poolContract, {
        base: market.base.name,
        quote: market.quote.name,
      });
      const txActivate = await activateTokensWithMgv(
        [market.base.address, market.quote.address, mgv.getAddress("DAI")],
        mgvDeployer
      );
      await mgvTestUtil.waitForTransaction(txActivate!);
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const holdingDaiBeforeBalance = await (
        await mgv.token("DAI")
      ).balanceOf(mgvArbAddress);
      const transactions = await arbBot.run(market, ["WETH", "USDC", 3000], {
        holdingTokens: ["DAI"],
        tokenForExchange: "DAI",
        exchangeConfig: { exchange: "Uniswap", fee: () => 3000 },
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
      const holdingWethfterBalance = await (
        await mgv.token("DAI")
      ).balanceOf(mgvArbAddress);
      await mgvTestUtil.waitForBlock(market.mgv, receipts.blockNumber);
      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseAfterBalance.minus(baseBeforeBalance).lte(1),
        true,
        `Base Should have the same amount of base as before (less then 1, because of rounding): ${baseBeforeBalance.toString()}  after:${baseAfterBalance.toString()}`
      );
      assert.deepStrictEqual(
        quoteBeforeBalance,
        quoteAfterBalance,
        "Quote Should have the same amount of base"
      );
      assert.ok(
        holdingDaiBeforeBalance < holdingWethfterBalance,
        "Should have gained holding token"
      );
    });

    //TODO: Test configs
  });

  it("get quote from uniswap", async () => {
    const weth = await mgv.token("WETH");
    const dai = await mgv.token("DAI");

    const uniswapV3FactoryAddress = mgv.getAddress("UniswapV3Factory");
    const uniswapV3QuoterAddress = mgv.getAddress("UniswapV3Quoter");

    const wethToken = new Token(mgv.network.id!, weth.address, weth.decimals);
    const daiToken = new Token(mgv.network.id!, dai.address, dai.decimals);

    const poolInfo = await getPoolInfo(
      uniswapV3FactoryAddress,
      wethToken,
      daiToken,
      3000,
      mgv.provider
    );

    const pricer = generateGetOutputQuote(uniswapV3QuoterAddress, mgv.provider);

    const minimalPoolInfo = {
      token0: poolInfo.token0,
      token1: poolInfo.token1,
      fee: poolInfo.fee,
    };

    const value = await pricer.quoteExactInputSingle(minimalPoolInfo, "100");

    assert.equal(value.toNumber(), 158399);

    const input = await pricer.quoteExactOutputSingle(
      minimalPoolInfo,
      value.toString()
    );

    assert.equal(input.toNumber(), 100);
  });
});
