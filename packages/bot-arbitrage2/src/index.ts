import { logger } from "./util/logger";

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import Mangrove, { enableLogging } from "@mangrovedao/mangrove.js";

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";
import config from "./util/config";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {
  // const task = new AsyncTask(
  //   "gas-updater bot task",
  //   async () => {
  //   },
  //   (err: Error) => {
  //     logger.error(err);
  //     setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
  //   }
  // );
  //
  // const job = new SimpleIntervalJob(
  //   {
  //     hours: oracleConfig.runEveryXHours,
  //     runImmediately: true,
  //   },
  //   task
  // );
  //
  // scheduler.addSimpleIntervalJob(job);
}

const main = async () => {
  await setup.startBot("update gas bot", botFunction, scheduler, true);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
