import {
  BalanceUtils,
  ExitCode,
  LatestMarketActivity,
  Setup,
} from "@mangrovedao/bot-utils";
import Mangrove, {
  KandelInstance,
  Market,
  enableLogging,
} from "@mangrovedao/mangrove.js";
import dotenvFlow from "dotenv-flow";
import { Wallet } from "ethers";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { exitKandelIfNoBids } from "./util/ExitKandel";
import config from "./util/config";
import { ConfigUtils } from "./util/configUtils";
import { logger } from "./util/logger";

dotenvFlow.config();

enableLogging();

const setup = new Setup(config);
const scheduler = new ToadScheduler();
export type MarketPairAndFee = { base: string; quote: string; fee: number };
const configUtil = new ConfigUtils(config);

function createAsyncKandelExit(
  mgv: Mangrove,
  kandel: KandelInstance,
  market: Market,
  scheduler: ToadScheduler
) {
  return new AsyncTask(
    "kandel exit bot task",
    async () => {
      const block = mgv.reliableProvider.blockManager.getLastBlock();
      const contextInfo = `block#=${block.number}`;

      setup.latestActivity.latestBlock = block;
      setup.latestActivity.lastActive = new Date().toISOString();

      logger.trace("Scheduled bot task running...", { contextInfo });
      await setup.exitIfMangroveIsKilled(mgv, contextInfo, scheduler);
      await exitKandelIfNoBids(kandel, market, mgv);
    },
    (err: Error) => {
      logger.error(err);
      setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
    }
  );
}

export async function botFunction(mgv: Mangrove, signer?: Wallet) {
  const botConfig = configUtil.getAndValidateKandelExitConfig();

  const latestMarketActivities: LatestMarketActivity[] = [];
  setup.latestActivity.markets = latestMarketActivities;

  const market = await mgv.market({
    base: botConfig.market.base,
    quote: botConfig.market.quote,
  });

  const kandel = await KandelInstance.create({
    address: botConfig.kandelAddress,
    signer: signer,
    market: market,
  });

  // create and schedule task
  logger.info(`Running bot every ${botConfig.runEveryXMinutes} minutes.`, {
    data: { runEveryXMinutes: botConfig.runEveryXMinutes },
  });

  // Create object for tracking latest activity
  const latestMarketActivity = {
    base: market.base.name,
    quote: market.quote.name,
    latestBlock: undefined,
    lastActive: undefined,
  };
  latestMarketActivities.push(latestMarketActivity);

  const task = createAsyncKandelExit(mgv, kandel, market, scheduler);

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
  await setup.startBot("Kandel Exit", botFunction, scheduler);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
