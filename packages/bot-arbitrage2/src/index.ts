import { logger } from "./util/logger";

import { BaseProvider } from "@ethersproject/providers";
import Mangrove, {
  enableLogging,
  MgvToken,
  ethers,
} from "@mangrovedao/mangrove.js";

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";
import config from "./util/config";
import {
  getArbitragerContractAddress,
  getMarketsConfig,
} from "./util/configValidator";

import { MgvArbitrage__factory } from "./types/typechain";
import { MarketWithToken } from "./types";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

async function botFunction(
  mgv: Mangrove,
  signer: ethers.Wallet,
  provider: BaseProvider
) {
  const arbitragerContractAddress = getArbitragerContractAddress();
  const marketsConfig = getMarketsConfig();

  const marketsWithToken = await Promise.all(
    marketsConfig.map<Promise<MarketWithToken>>(async (market) => {
      const base = await mgv.token(market.base);
      const quote = await mgv.token(market.quote);

      return {
        ...market,
        base,
        quote,
      };
    })
  );

  const tokenSet: Record<string, MgvToken> = {};

  marketsWithToken.forEach((market) => {
    tokenSet[market.base.address] = market.base;
    tokenSet[market.quote.address] = market.quote;
  });

  await Promise.all(
    Object.values(tokenSet).map((token) =>
      token.approveIfNotInfinite(mgv.address)
    )
  );

  const mgvArbitrageContract = MgvArbitrage__factory.connect(
    arbitragerContractAddress,
    signer
  );

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
