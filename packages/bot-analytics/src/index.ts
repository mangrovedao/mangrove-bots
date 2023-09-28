/**
 * A simple configurable gas price update bot for the Mangrove DEX.
 * @module
 */
import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import config from "./util/config";
import { logger } from "./util/logger";

import Mangrove, { enableLogging, typechain } from "@mangrovedao/mangrove.js";

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";

import { PrismaClient } from "@prisma/client";
import { inititalizeChains } from "./db/init";
import { subgraphMaxFirstValue } from "./constants";
import { createBlockIfNotExist, getLastStoredBlock } from "./db/block";
import { Chain, ChainContext, PriceMocks } from "./types";
import {
  generateCreateTokenIfNotExist,
  generateGetTokensPrices,
  loadTokens,
} from "./db/token";
import { generateGetAndSaveVolumeTimeSerie } from "./volume";
import { getBuiltGraphSDK } from "../.graphclient";
import { generateBlockHeaderToDbBlock } from "./util/util";
import { handleRange } from "./analytics";
import { generateGetAndSaveLiquidityTimeSerie } from "./liquidity";
import { binance } from "ccxt";
import { Wallet } from "ethers";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

const prisma = new PrismaClient();

const botTask = async (mgv: Mangrove) => {
  const startingBlockNumber = config.get<number>("startingBlock");
  const blockFinality = config.get<number>("blockFinality");
  const runEveryXHours = config.get<number>("runEveryXHours");
  const everyXBlock = config.get<number>("everyXBlock");
  const priceMocks = config.get<PriceMocks>("priceMocks");

  const chains = config.get<Chain[]>("chains");

  await inititalizeChains(prisma, chains);

  const provider = mgv.provider;
  const network = await provider.getNetwork();

  const exchange = new binance();

  const context: ChainContext = {
    chainId: network.chainId,
    name: network.name,
    getBlock: async (number: string | number) => {
      return provider.getBlock(number);
    },
    blockFinality,
    multicall2: typechain.Multicall2__factory.connect(
      Mangrove.getAddress("Multicall2", network.name),
      provider
    ),
    subgraphMaxFirstValue,
    everyXBlock: everyXBlock,
    exchange,
    seenTokens: new Set(),
    priceMocks,
  };

  const lastBlock = (await getLastStoredBlock(prisma, context))!;

  const startingBlock =
    lastBlock === null
      ? await provider.getBlock(startingBlockNumber)
      : await provider.getBlock(lastBlock.number);

  const latestBlock = await provider.getBlock("latest");

  const lastSafeBlock = await provider.getBlock(
    latestBlock.number - blockFinality
  );

  const blockDifference = lastSafeBlock.number - startingBlock.number;

  if (blockDifference < everyXBlock) {
    logger.info(
      `Do not run as blockDifference (${blockDifference}) < everyXBlock (${everyXBlock})`
    );
    return;
  }

  const maxAllowedRange = Math.floor(blockDifference / everyXBlock);
  const shoundRunUntilBlockNumber =
    startingBlock.number + maxAllowedRange * everyXBlock;

  const shouldRunUntilBlock = await provider.getBlock(
    shoundRunUntilBlockNumber
  );

  await loadTokens(context, prisma);

  const blockHeaderToBlockWithoutId = generateBlockHeaderToDbBlock(context);

  await createBlockIfNotExist(prisma, {
    number: startingBlock.number,
    hash: startingBlock.hash,
    chainId: context.chainId,
    timestamp: new Date(startingBlock.timestamp * 1000),
  });

  const sdk = getBuiltGraphSDK({
    chainName: network.name,
  });

  const createTokenIfNotExist = generateCreateTokenIfNotExist(context);

  logger.info(`Starting with params`, {
    data: {
      network,
      startingBlock: blockHeaderToBlockWithoutId(startingBlock),
      everyXBlock,
      latestBlock: blockHeaderToBlockWithoutId(latestBlock),
      shouldRunUntilBlock: blockHeaderToBlockWithoutId(shouldRunUntilBlock),
      blockFinality,
      runEveryXHours,
    },
  });

  const getAndSaveVolumeTimeSeries = generateGetAndSaveVolumeTimeSerie(
    context,
    createTokenIfNotExist,
    sdk
  );

  const getAndSaveLiquidity = generateGetAndSaveLiquidityTimeSerie(
    context,
    createTokenIfNotExist,
    sdk
  );

  const getTokensPrice = await generateGetTokensPrices(context);

  try {
    await handleRange(
      context,
      prisma,
      [getAndSaveLiquidity, getAndSaveVolumeTimeSeries, getTokensPrice],
      blockHeaderToBlockWithoutId(shouldRunUntilBlock)
    );
    logger.info("handleRange succesfully finnished");
  } catch (e) {
    logger.error(`handleRange failed`, {
      data: e,
    });
  }
};

export const botFunction = async (mgv: Mangrove, signer?: Wallet) => {
  const runEveryXHours = config.get<number>("runEveryXHours");

  const task = new AsyncTask(
    "bot-analytics task",
    async () => {
      await botTask(mgv);
    },
    (err: Error) => {
      logger.error(err);
      setup.stopAndExit(ExitCode.ErrorInAsyncTask, scheduler);
    }
  );

  const job = new SimpleIntervalJob(
    {
      hours: runEveryXHours,
      runImmediately: true,
    },
    task
  );

  scheduler.addSimpleIntervalJob(job);
};

const main = async () => {
  await setup.startBot(
    "analytics bot",
    botFunction,
    scheduler,
    true,
    false,
    true
  );
};

main().catch(async (e) => {
  await prisma.$disconnect();
  logger.error("erro:", {
    data: {
      e,
      stack: e.stack,
    },
  });
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});