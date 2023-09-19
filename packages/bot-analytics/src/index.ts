/**
 * A simple configurable gas price update bot for the Mangrove DEX.
 * @module
 */
import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import config from "./util/config";
import { logger } from "./util/logger";

import Mangrove, { enableLogging, typechain } from "@mangrovedao/mangrove.js";

import { ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";

import { PrismaClient } from "@prisma/client";
import { inititalizeChains } from "./db/init";
import { subgraphMaxFirstValue } from "./constants";
import { createBlockIfNotExist } from "./db/block";
import { Chain, ChainContext } from "./types";
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

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

const prisma = new PrismaClient();

const botFunction = async (mgv: Mangrove) => {
  const startingBlockNumber = config.get<number>("startingBlock");
  const blockFinality = config.get<number>("blockFinality");
  const runEveryXHours = config.get<number>("runEveryXHours");
  const everyXBlock = config.get<number>("everyXBlock");

  const chains = JSON.parse(config.get<string>("chains")) as Chain[];

  await inititalizeChains(prisma, chains);

  const provider = mgv.provider;
  const network = await provider.getNetwork();

  const startingBlock = await provider.getBlock(startingBlockNumber);
  const latestBlock = await provider.getBlock("latest");

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
  };

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

  const lastSafeBlock = await context.getBlock(
    latestBlock.number - context.blockFinality
  );

  logger.info(`Starting with params`, {
    data: {
      network,
      startingBlock: blockHeaderToBlockWithoutId(startingBlock),
      everyXBlock,
      latestBlock: blockHeaderToBlockWithoutId(latestBlock),
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

  await handleRange(
    context,
    prisma,
    [getAndSaveLiquidity, getAndSaveVolumeTimeSeries, getTokensPrice],
    blockHeaderToBlockWithoutId(lastSafeBlock)
  );
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
