import { BaseProvider } from "@ethersproject/providers";
import {
  BalanceUtils,
  ExitCode,
  LatestMarketActivity,
  Setup,
} from "@mangrovedao/bot-utils";
import { Mangrove, Market } from "@mangrovedao/mangrove.js";
import dotenvFlow from "dotenv-flow";
import { Wallet } from "ethers";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ArbBot } from "./ArbBot";
import { getPoolContract } from "./uniswap/libs/uniswapUtils";
import config from "./util/config";
import { ConfigUtils } from "./util/configUtils";
import { logger } from "./util/logger";

dotenvFlow.config();

type TokenConfig = {
  name: string;
};

const balanceUtils = new BalanceUtils(config);
const setup = new Setup(config);
const scheduler = new ToadScheduler();
export type MarketPairAndFee = { base: string; quote: string; fee: number };
const configUtil = new ConfigUtils(config);

function createAsyncArbTaker(
  mgv: Mangrove,
  arbBotMap: { arbBot: ArbBot; market: Market; fee: number }[],
  scheduler: ToadScheduler
) {
  return new AsyncTask(
    "arb bot task",
    async () => {
      const block = mgv.reliableProvider.blockManager.getLastBlock();
      const contextInfo = `block#=${block.number}`;

      setup.latestActivity.latestBlock = block;
      setup.latestActivity.lastActive = new Date().toISOString();

      logger.trace("Scheduled bot task running...", { contextInfo });
      await setup.exitIfMangroveIsKilled(mgv, contextInfo, scheduler);

      const arbPromises = [];
      for (const arbBotValues of arbBotMap.values()) {
        arbPromises.push(
          arbBotValues.arbBot.run(
            arbBotValues.market,
            [
              arbBotValues.market.base.name,
              arbBotValues.market.quote.name,
              arbBotValues.fee,
            ],
            configUtil.buildArbConfig(
              arbBotValues.market.base.name,
              arbBotValues.market.quote.name
            ),
            contextInfo
          )
        );
      }
      await Promise.allSettled(arbPromises);
    },
    (err: Error) => {
      logger.error(err);
      setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
    }
  );
}

export async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {
  const botConfig = configUtil.getAndValidateArbConfig();

  const latestMarketActivities: LatestMarketActivity[] = [];
  setup.latestActivity.markets = latestMarketActivities;

  const marketConfigs = botConfig.markets;
  const arbBotMarketMap = new Set<MarketPairAndFee>();
  const tokens: TokenConfig[] = [];
  for (const marketConfig of marketConfigs) {
    const [base, quote] = marketConfig;
    arbBotMarketMap.add({
      base,
      quote,
      fee: marketConfig[2],
    });
    tokens.push({ name: base }, { name: quote });
  }
  const holdingTokens: TokenConfig[] = configUtil
    .getHoldingTokenConfig()
    .map((token) => ({ name: token }));
  await balanceUtils.logTokenBalances(
    mgv,
    await mgv.signer.getAddress(),
    tokens.concat(holdingTokens),
    "init"
  );

  // create and schedule task
  logger.info(`Running bot every ${botConfig.runEveryXMinutes} minutes.`, {
    data: { runEveryXMinutes: botConfig.runEveryXMinutes },
  });
  const arbBotMap: { arbBot: ArbBot; market: Market; fee: number }[] = [];
  for (const arbBotValues of arbBotMarketMap.values()) {
    const poolContract = await getPoolContract({
      in: mgv.getAddress(arbBotValues.base),
      out: mgv.getAddress(arbBotValues.quote),
      fee: arbBotValues.fee,
      provider: mgv.provider,
    });
    const market = await mgv.market({
      base: arbBotValues.base,
      quote: arbBotValues.quote,
    });

    // Create object for tracking latest activity
    const latestMarketActivity = {
      base: market.base.name,
      quote: market.quote.name,
      latestBlock: undefined,
      lastActive: undefined,
    };
    latestMarketActivities.push(latestMarketActivity);

    logger.info(`Starting bot for ${arbBotValues.base}/${arbBotValues.quote}`);
    arbBotMap.push({
      arbBot: new ArbBot(mgv, poolContract, latestMarketActivity),
      market: market,
      fee: arbBotValues.fee,
    });
  }

  const task = createAsyncArbTaker(mgv, arbBotMap, scheduler);

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
  await setup.startBot("ARB bot", botFunction, scheduler);
};

main().catch((e) => {
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
