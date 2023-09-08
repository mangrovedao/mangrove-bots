import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import { BaseProvider } from "@ethersproject/providers";
import {
  BalanceUtils,
  ExitCode,
  LatestMarketActivity,
  Setup,
} from "@mangrovedao/bot-utils";
import Mangrove, { Market, enableLogging } from "@mangrovedao/mangrove.js";

import { Wallet } from "ethers";
import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ArbBot } from "./ArbBot";
import config from "./util/config";
import { ConfigUtils } from "./util/configUtils";
import { logger } from "./util/logger";
import { getPoolInfo } from "./uniswap/pool";
import { Token } from "@uniswap/sdk-core";
import { generateUniQuoter } from "./uniswap/pricing";
import { Context, TokenConfig } from "./types";

enableLogging();

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
  const mgvArbitrageAddress = mgv.getAddress("MgvArbitrage");

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

    const baseToken = mgv.tokenFromConfig(base);
    const quoteToken = mgv.tokenFromConfig(base);
    tokens.push(
      { name: base, balance: await baseToken.balanceOf(mgvArbitrageAddress) },
      { name: quote, balance: await quoteToken.balanceOf(mgvArbitrageAddress) }
    );
  }

  const holdingTokens: TokenConfig[] = await Promise.all(
    configUtil.getHoldingTokenConfig().map(async (token) => {
      const erc20 = mgv.tokenFromConfig(token);

      return {
        name: token,
        balance: await erc20.balanceOf(mgvArbitrageAddress),
      };
    })
  );

  await balanceUtils.logTokenBalances(
    mgv,
    mgvArbitrageAddress,
    tokens.concat(holdingTokens),
    "init"
  );

  const tokenForExchange = configUtil.getTokenForExchange();
  const mgvTokenTokenForExchange = mgv.tokenFromConfig(tokenForExchange);

  const balance = await mgvTokenTokenForExchange.balanceOf(mgvArbitrageAddress);

  const context: Context = {
    tokenForExchange: {
      name: tokenForExchange,
      balance,
    },
    holdingTokens: holdingTokens.reduce((acc, token) => {
      acc[token.name] = token;
      return acc;
    }, {} as Record<string, TokenConfig>),
  };

  // create and schedule task
  logger.info(`Running bot every ${botConfig.runEveryXMinutes} minutes.`, {
    data: { runEveryXMinutes: botConfig.runEveryXMinutes },
  });
  const arbBotMap: { arbBot: ArbBot; market: Market; fee: number }[] = [];
  for (const arbBotValues of arbBotMarketMap.values()) {
    const base = await mgv.token(arbBotValues.base);
    const quote = await mgv.token(arbBotValues.quote);
    const factoryAddress = mgv.getAddress("UniswapV3Factory");
    const poolInfo = await getPoolInfo(
      factoryAddress,
      new Token(mgv.network.id, base.address, base.decimals),
      new Token(mgv.network.id, quote.address, quote.decimals),
      arbBotValues.fee,
      mgv.provider
    );
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

    const pricer = generateUniQuoter(
      mgv.getAddress("UniswapV3Quoter"),
      mgv.provider
    );
    arbBotMap.push({
      arbBot: new ArbBot(mgv, poolInfo, pricer, latestMarketActivity, context),
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
