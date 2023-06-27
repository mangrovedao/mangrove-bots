/**
 * A simple cleaning bot for Mangrove which monitors select markets and
 * snipes and collects the bounty of offers that fail.
 * @module
 */

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { ConfigUtils, ExitCode, Setup } from "@mangrovedao/bot-utils";
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
  scheduler: ToadScheduler
) {
  return new AsyncTask(
    "cleaning bot task",
    async () => {
      const blockNumber = mgv.reliableProvider.blockManager.getLastBlock();
      const contextInfo = `block#=${blockNumber}`;

      logger.debug("Scheduled bot task running...", { contextInfo });
      await setup.exitIfMangroveIsKilled(mgv, contextInfo, scheduler);

      const cleaningPromises = [];
      for (const marketCleaner of marketCleanerMap.values()) {
        cleaningPromises.push(marketCleaner.clean(contextInfo));
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

  const marketConfigs = botConfig.markets;
  const marketCleanerMap = new Map<MarketPair, MarketCleaner>();
  for (const marketConfig of marketConfigs) {
    const [base, quote] = marketConfig;
    const market = await mgv.market({
      base: base,
      quote: quote,
      bookOptions: { maxOffers: 200 },
    });

    marketCleanerMap.set(
      { base: market.base.name, quote: market.quote.name },
      new MarketCleaner(market, provider)
    );
  }

  // create and schedule task
  logger.info(`Running bot every ${botConfig.runEveryXMinutes} minutes.`, {
    data: { runEveryXMinutes: botConfig.runEveryXMinutes },
  });

  const task = createAsyncMarketCleaner(mgv, marketCleanerMap, scheduler);

  const job = new SimpleIntervalJob(
    {
      minutes: botConfig.runEveryXMinutes,
      runImmediately: true,
    },
    task
  );

  scheduler.addSimpleIntervalJob(job);
}

const main = async () => {
  await setup.startBot("cleaner bot", botFunction, scheduler);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
