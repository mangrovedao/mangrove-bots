/**
 * Integration tests of ArbBot.ts.
 */
import { afterEach, beforeEach, describe, it } from "mocha";

import {
  KandelFarm,
  KandelInstance,
  KandelStrategies,
  Mangrove,
  mgvTestUtil,
} from "@mangrovedao/mangrove.js";

import { Token } from "@uniswap/sdk-core";
import assert from "assert";
import { getPoolInfo } from "../../src/uniswap/pool";
import { logger } from "../../src/util/logger";
import { waitForTransactions } from "@mangrovedao/mangrove.js/src/util/test/mgvIntegrationTestUtil";

let mgv: Mangrove;
let mgvDeployer: Mangrove;
let mgvArbitrager: Mangrove;
let kandel: KandelInstance;

describe("Kandel exit integration tests", () => {
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

    const weth = await mgv.token("WETH");
    const dai = await mgv.token("DAI");
    const usdc = await mgv.token("USDC");
    await weth.contract.mintTo(this.accounts.maker.address, weth.toUnits(100));
    await dai.contract.mintTo(this.accounts.maker.address, dai.toUnits(100000));
    await usdc.contract.mintTo(
      this.accounts.maker.address,
      usdc.toUnits(100000)
    );

    const market = await mgv.market({ base: "WETH", quote: "USDC" });

    const kandelStrats = new KandelStrategies(mgv);

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
    it(`Should exit kandel`, async function () {
      const market = await mgv.market({ base: "WETH", quote: "USDC" });
      const kandelStrats = new KandelStrategies(mgv);
      const distribution = kandelStrats
        .generator(market)
        .calculateDistribution({
          priceParams: { minPrice: 900, ratio: 1.01, pricePoints: 6 },
          midPrice: 1000,
          initialAskGives: 1,
        });
      const receipts = await waitForTransactions(
        kandel.populate({
          distribution,
          depositBaseAmount: 10,
          depositQuoteAmount: 20000,
        })
      );
      await mgvTestUtil.waitForBlock(
        kandel.market.mgv,
        receipts[receipts.length - 1].blockNumber
      );
      const offers = await kandel.getOffers();
      console.log(offers);
    });
  });
});
