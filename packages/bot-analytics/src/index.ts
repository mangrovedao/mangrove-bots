/**
 * A simple configurable gas price update bot for the Mangrove DEX.
 * @module
 */

import config from "./util/config";
import { logger } from "./util/logger";

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import Mangrove, {
  enableLogging,
  ethers,
  typechain,
} from "@mangrovedao/mangrove.js";

import { ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";

import { PrismaClient } from "@prisma/client";
import { inititalizeChains } from "./db/init";
import { chains, secondsInADay, subgraphMaxFirstValue } from "./constants";
import { createBlockIfNotExist } from "./db/block";
import { ChainContext } from "./types";
import { generateCreateTokenIfNotExist } from "./db/token";
import { generateGetAndSaveVolumeTimeSerie } from "./volume";
import { getBuiltGraphSDK } from "../.graphclient";
import {
  estimateBlockCount,
  generateBlockHeaderToBlockWithoutId,
} from "./util/util";
import moize from "moize";
import { handleRange } from "./analytics";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

const prisma = new PrismaClient();

async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {}

const main = async () => {
  await inititalizeChains(prisma, chains);

  const rpcHttpProviderUrl = config.get<string>("rpcHttpProvider");
  const startingBlockNumber = config.get<number>("startingBlock");
  const estimatedBlockTimeMs = config.get<number>("estimatedBlockTimeMs");
  const blockFinality = config.get<number>("blockFinality");
  const runEveryXHours = config.get<number>("runEveryXHours");

  const provider = new ethers.providers.StaticJsonRpcProvider(
    rpcHttpProviderUrl
  );
  const network = await provider.getNetwork();

  const startingBlock = await provider.getBlock(startingBlockNumber);
  const latestBlock = await provider.getBlock("latest");

  const context: ChainContext = {
    chainId: network.chainId,
    name: network.name,
    provider,
    blockFinality,
    multicall2: typechain.Multicall2__factory.connect(
      Mangrove.getAddress("Multicall2", network.name),
      provider
    ),
    subgraphMaxFirstValue,
    everyXBlock: estimateBlockCount(secondsInADay, estimatedBlockTimeMs),
  };

  const blockHeaderToBlockWithoutId =
    generateBlockHeaderToBlockWithoutId(context);

  await createBlockIfNotExist(prisma, {
    number: startingBlock.number,
    hash: startingBlock.hash,
    chainId: context.chainId,
    timestamp: new Date(startingBlock.timestamp * 1000),
  });

  const sdk = getBuiltGraphSDK({
    chainName: "matic",
  });

  const createTokenIfNotExist = moize(generateCreateTokenIfNotExist(context));

  const lastSafeBlock = await context.provider.getBlock(
    latestBlock.number - context.blockFinality
  );

  logger.info(`Starting with params`, {
    data: {
      network,
      startingBlock: blockHeaderToBlockWithoutId(startingBlock),
      estimatedBlockTimeMs,
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

  await handleRange(
    context,
    prisma,
    [getAndSaveVolumeTimeSeries],
    blockHeaderToBlockWithoutId(lastSafeBlock)
  );
};

main().catch(async (e) => {
  await prisma.$disconnect();
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
