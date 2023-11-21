import { logger } from "./util/logger";

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import Mangrove, { enableLogging, MgvToken } from "@mangrovedao/mangrove.js";

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";
import config from "./util/config";
import {
  getArbitragerContractAddress,
  getEveryXMinutes,
  getFactoryAddress,
  getMarketsConfig,
} from "./util/configValidator";

import { MgvArbitrage__factory } from "./types/typechain";
import { MarketWithToken } from "./types";
import { getMarketWithUniswapPool } from "./util/ArbBotUtils";
import { activatePool, activateTokens, arbitrage } from "./arbitarger";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {
  const factoryAddress = getFactoryAddress();
  const arbitragerContractAddress = getArbitragerContractAddress();
  const marketsConfig = getMarketsConfig();
  const everyXMinutes = getEveryXMinutes();

  const marketsWithToken = await Promise.all(
    marketsConfig.map<Promise<MarketWithToken>>(async (market) =>
      getMarketWithUniswapPool(mgv, factoryAddress, market)
    )
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

  const arbitragerContract = MgvArbitrage__factory.connect(
    arbitragerContractAddress,
    signer
  );

  await activateTokens(mgv, Object.values(tokenSet), arbitragerContract);

  await Promise.all(
    marketsWithToken.map((market) =>
      activatePool(market.uniswapPoolAddress, arbitragerContract)
    )
  );

  const task = new AsyncTask(
    "gas-updater bot task",
    async () => {
      await arbitrage(mgv, arbitragerContract, marketsWithToken, [
        "doArbitrageFirstMangroveThenUniswap",
        "doArbitrageFirstUniwapThenMangrove",
      ]);
    },
    (err: Error) => {
      logger.error(err);
      setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
    }
  );

  const job = new SimpleIntervalJob(
    {
      hours: everyXMinutes,
      runImmediately: true,
    },
    task
  );

  scheduler.addSimpleIntervalJob(job);
}

const main = async () => {
  await setup.startBot("update gas bot", botFunction, scheduler, true);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
