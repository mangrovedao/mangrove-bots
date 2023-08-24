/**
 * Integration tests of ArbBot.ts.
 */
import { afterEach, beforeEach, describe, it } from "mocha";

import {
  KandelInstance,
  KandelStrategies,
  Mangrove,
  mgvTestUtil,
} from "@mangrovedao/mangrove.js";

import assert from "assert";
import { logger } from "../../src/util/logger";
import { exitKandelIfNoBids } from "../../src/util/ExitKandel";

let mgvKandel: Mangrove;
let mgvTaker: Mangrove;
let kandel: KandelInstance;

describe("Kandel exit integration tests", () => {
  beforeEach(async function () {
    mgvKandel = await Mangrove.connect({
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

    mgvTaker = await Mangrove.connect({
      privateKey: this.accounts.cleaner.key,
      provider: mgvKandel.provider,
      blockManagerOptions: {
        maxBlockCached: 5,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 5,
      },
    });

    const weth = await mgvKandel.token("WETH");
    const usdc = await mgvKandel.token("USDC");
    await weth.contract.mintTo(this.accounts.maker.address, weth.toUnits(10));
    await usdc.contract.mintTo(
      this.accounts.maker.address,
      usdc.toUnits(20000)
    );
    await weth.contract.mintTo(
      this.accounts.cleaner.address,
      weth.toUnits(100)
    );
    await usdc.contract.mintTo(
      this.accounts.cleaner.address,
      usdc.toUnits(100000)
    );

    const market = await mgvKandel.market({ base: "WETH", quote: "USDC" });

    const kandelStrats = new KandelStrategies(mgvKandel);

    const { kandelPromise } = await kandelStrats.seeder.sow({
      market,
      liquiditySharing: false,
      onAave: false,
      gasprice: undefined,
      gaspriceFactor: 2,
    });
    kandel = await kandelPromise;
    market.close();

    logger.debug(
      `--label ${this.accounts.maker.address}:maker --label ${this.accounts.deployer.address}:deployer --label ${weth.address}:weth --label ${mgvKandel.address}:mangrove --label ${usdc.address}:usdc`
    );

    mgvTestUtil.setConfig(mgvKandel, this.accounts, mgvTaker);
    mgvTestUtil.initPollOfTransactionTracking(mgvTaker.provider);
  });

  afterEach(async function () {
    mgvTestUtil.stopPollOfTransactionTracking();
    mgvTaker.disconnect();
    mgvKandel.disconnect();
  });

  describe("test exit kandel", () => {
    it(`Should exit kandel`, async function () {
      const makerMarket = await mgvKandel.market({
        base: "WETH",
        quote: "USDC",
      });
      const kandelStrats = new KandelStrategies(mgvKandel);
      const distribution = kandelStrats
        .generator(makerMarket)
        .calculateDistribution({
          priceParams: { minPrice: 1500, ratio: 1.04, pricePoints: 6 },
          midPrice: 1634,
          initialAskGives: 1,
        });
      const approvalTxs = await kandel.approveIfHigher(10, 20000);
      await approvalTxs[0]?.wait();
      await approvalTxs[1]?.wait();
      const txs = await kandel.populate({
        distribution,
        depositBaseAmount: 10,
        depositQuoteAmount: 20000,
      });
      const receipt = await txs[0].wait();
      await mgvTestUtil.waitForBlock(mgvKandel, receipt.blockNumber);
      const kandelOffersBids = (await kandel.getOffers()).filter(
        (o) => o.offerType == "bids"
      );
      assert.strictEqual(kandelOffersBids.length, 3);
      const takerMarket = await mgvTaker.market({
        base: "WETH",
        quote: "USDC",
      });
      let approveTx = await takerMarket.base.approveMangrove();
      await approveTx.wait();
      approveTx = await takerMarket.quote.approveMangrove();
      await approveTx.wait();
      const tx = await takerMarket.sell({
        wants: 10,
        gives: 23000,
        fillWants: false,
      });
      const buyReceipt = await (await tx.response).wait();
      await mgvTestUtil.waitForBlock(mgvKandel, buyReceipt.blockNumber);
      const allKandelOffers = await kandel.getOffers();
      const kandelOffersBidsAfterBuy = allKandelOffers.filter(
        (o) => o.offerType == "bids" && makerMarket.isLiveOffer(o.offer)
      );
      const kandelOffersAsksAfterBuy = allKandelOffers.filter(
        (o) => o.offerType == "asks" && makerMarket.isLiveOffer(o.offer)
      );
      assert.strictEqual(allKandelOffers.length, 9);
      assert.strictEqual(kandelOffersAsksAfterBuy.length, 6);
      assert.strictEqual(kandelOffersBidsAfterBuy.length, 0);

      const quoteBalanceBeforeExit = await makerMarket.quote.balanceOf(
        kandel.address
      );
      const baseBalanceBeforeExit = await makerMarket.base.balanceOf(
        kandel.address
      );
      const exit = await exitKandelIfNoBids(kandel, makerMarket, mgvKandel);
      const exitBlockNumber = exit.reduce(
        (acc, tx) => (acc > tx.blockNumber ? acc : tx.blockNumber),
        0
      );
      await mgvTestUtil.waitForBlock(mgvKandel, exitBlockNumber);

      const allKandelOffersAfterExit = await kandel.getOffers();
      const liveKandelOffersAfterExit = allKandelOffersAfterExit.filter((o) =>
        makerMarket.isLiveOffer(o.offer)
      );
      assert.strictEqual(liveKandelOffersAfterExit.length, 0);
      const quoteBalanceAfterExit = (
        await makerMarket.quote.balanceOf(this.accounts.maker.address)
      ).toNumber();
      const baseBalanceAfterExit = (
        await makerMarket.base.balanceOf(this.accounts.maker.address)
      ).toNumber();
      const uniPrice =
        (quoteBalanceAfterExit - quoteBalanceBeforeExit.toNumber()) /
        baseBalanceBeforeExit.toNumber();
      assert.strictEqual(uniPrice - (uniPrice % 1), 1634);
      assert.strictEqual(baseBalanceAfterExit, 0);
    });

    it(`Should not exit kandel`, async function () {
      const makerMarket = await mgvKandel.market({
        base: "WETH",
        quote: "USDC",
      });
      const kandelStrats = new KandelStrategies(mgvKandel);
      const distribution = kandelStrats
        .generator(makerMarket)
        .calculateDistribution({
          priceParams: { minPrice: 1500, ratio: 1.04, pricePoints: 6 },
          midPrice: 1634,
          initialAskGives: 1,
        });
      const approvalTxs = await kandel.approveIfHigher(10, 20000);
      await approvalTxs[0]?.wait();
      await approvalTxs[1]?.wait();
      const txs = await kandel.populate({
        distribution,
        depositBaseAmount: 10,
        depositQuoteAmount: 20000,
      });
      const receipt = await txs[0].wait();
      await mgvTestUtil.waitForBlock(mgvKandel, receipt.blockNumber);
      const kandelOffers = await kandel.getOffers();
      const kandelOffersBids = kandelOffers.filter(
        (o) => o.offerType == "bids" && makerMarket.isLiveOffer(o.offer)
      );
      assert.strictEqual(kandelOffersBids.length, 3);

      const exit = await exitKandelIfNoBids(kandel, makerMarket, mgvKandel);
      assert.strictEqual(exit, undefined);
      const allKandelOffersAfterExit = await kandel.getOffers();
      const liveKandelOffersAfterExit = allKandelOffersAfterExit.filter((o) =>
        makerMarket.isLiveOffer(o.offer)
      );
      assert.strictEqual(liveKandelOffersAfterExit.length, 6);
      const quoteBalanceAfterExit = (
        await makerMarket.quote.balanceOf(kandel.address)
      ).toNumber();
      const baseBalanceAfterExit = (
        await makerMarket.base.balanceOf(kandel.address)
      ).toNumber();
      assert.strictEqual(quoteBalanceAfterExit, 20000);
      assert.strictEqual(baseBalanceAfterExit, 10);
    });
  });
});
