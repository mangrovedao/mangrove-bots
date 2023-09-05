/**
 * A simple configurable gas price update bot for the Mangrove DEX.
 * @module
 */

import { GasUpdater } from "./GasUpdater";
import config, { OracleConfig, readAndValidateConfig } from "./util/config";
import { logger } from "./util/logger";

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import Mangrove, { enableLogging } from "@mangrovedao/mangrove.js";

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {
  const oracleConfig: OracleConfig = readAndValidateConfig();

  const gasUpdater = new GasUpdater(
    mgv,
    oracleConfig.acceptableGasGapToOracle,
    oracleConfig.oracleSourceConfiguration,
    oracleConfig.overEstimateOracleGasPriceByXPercent
  );

  // create and schedule task
  logger.info(`Running bot every ${oracleConfig.runEveryXHours} hours.`);

  const task = new AsyncTask(
    "gas-updater bot task",
    async () => {
      const block = mgv.reliableProvider.blockManager.getLastBlock();
      const contextInfo = `block#=${block.number}`;

      setup.latestActivity.latestBlock = block;
      setup.latestActivity.lastActive = new Date().toISOString();

      logger.debug("Scheduled bot task running...", { contextInfo });
      await setup.exitIfMangroveIsKilled(mgv, contextInfo, scheduler);
      await gasUpdater.checkSetGasprice(contextInfo);
    },
    (err: Error) => {
      logger.error(err);
      setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
    }
  );

  const job = new SimpleIntervalJob(
    {
      hours: oracleConfig.runEveryXHours,
      runImmediately: true,
    },
    task
  );

  scheduler.addSimpleIntervalJob(job);
}

const main = async () => {
  await setup.startBot("update gas bot", botFunction, scheduler);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
