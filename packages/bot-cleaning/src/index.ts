/**
 * A simple cleaning bot for Mangrove which monitors select markets and
 * snipes and collects the bounty of offers that fail.
 * @module
 */

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import {
  configUtils,
  ConfigUtils,
  ExitCode,
  LatestMarketActivity,
  Setup,
} from "@mangrovedao/bot-utils";
import Mangrove, { enableLogging } from "@mangrovedao/mangrove.js";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { MarketCleaner } from "./MarketCleaner";
import config from "./util/config";
import { logger } from "./util/logger";

type MarketPair = { base: string; quote: string };

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);
const configUtil = new ConfigUtils(config);

function createAsyncMarketCleaner(
  mgv: Mangrove,
  marketCleanerMap: Map<MarketPair, MarketCleaner>,
  scheduler: ToadScheduler,
  whitelistedCleanOnly: boolean
) {
  return new AsyncTask(
    "cleaning bot task",
    async () => {
      const block = mgv.reliableProvider.blockManager.getLastBlock();
      const contextInfo = `block#=${block.number}`;

      setup.latestActivity.latestBlock = block;
      setup.latestActivity.lastActive = new Date().toISOString();

      logger.debug("Scheduled bot task running...", { contextInfo });
      await setup.exitIfMangroveIsKilled(mgv, contextInfo, scheduler);

      const cleaningPromises = [];
      for (const marketCleaner of marketCleanerMap.values()) {
        cleaningPromises.push(
          marketCleaner.clean(whitelistedCleanOnly, contextInfo)
        );
      }
      await Promise.allSettled(cleaningPromises);
    },
    (err: Error) => {
      logger.error(err);
      setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
    }
  );
}

async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {
  const botConfig = configUtil.getAndValidateConfig();

  /* bot specific config */
  const whitelistedAddreses = config.get<string[]>(
    "addressesWithDustCleaningWhitelist"
  );
  if (!whitelistedAddreses) {
    throw new Error("No whitelistedAddreses list");
  }

  const whitelistedRunEveryXMinutes = config.get<number>(
    "whitelistedRunEveryXMinutes"
  );
  if (!whitelistedRunEveryXMinutes) {
    throw new Error("whitelistedRunEveryXMinutes is missing");
  }

  const latestMarketActivities: LatestMarketActivity[] = [];
  setup.latestActivity.markets = latestMarketActivities;

  const marketConfigs = botConfig.markets;
  const marketCleanerMap = new Map<MarketPair, MarketCleaner>();
  for (const marketConfig of marketConfigs) {
    const [base, quote, takerToImpersonate] = marketConfig;
    const market = await mgv.market({
      base: base,
      quote: quote,
      bookOptions: { maxOffers: 200 },
    });

    // Create object for tracking latest activity
    const latestMarketActivity = {
      base,
      quote,
      latestBlock: undefined,
      lastActive: undefined,
    };
    latestMarketActivities.push(latestMarketActivity);

    marketCleanerMap.set(
      { base: market.base.name, quote: market.quote.name },
      new MarketCleaner(
        market,
        provider,
        latestMarketActivity,
        new Set(whitelistedAddreses.map((addr) => addr.toLowerCase())),
        takerToImpersonate
      )
    );
  }

  // create and schedule task
  logger.info(`Running bot every ${botConfig.runEveryXMinutes} minutes.`, {
    data: { runEveryXMinutes: botConfig.runEveryXMinutes },
  });

  const task = createAsyncMarketCleaner(
    mgv,
    marketCleanerMap,
    scheduler,
    false
  );
  const whiteListedTask = createAsyncMarketCleaner(
    mgv,
    marketCleanerMap,
    scheduler,
    true
  );

  const job = new SimpleIntervalJob(
    {
      minutes: botConfig.runEveryXMinutes,
      runImmediately: true,
    },
    task
  );

  const whitelistedJob = new SimpleIntervalJob(
    {
      minutes: whitelistedRunEveryXMinutes,
      runImmediately: false,
    },
    whiteListedTask
  );

  scheduler.addSimpleIntervalJob(job);
  scheduler.addSimpleIntervalJob(whitelistedJob);
}

const main = async () => {
  await setup.startBot("cleaner bot", botFunction, scheduler);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
