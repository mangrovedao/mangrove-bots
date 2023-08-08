import { PrismaClient } from "@prisma/client";
import { logger } from "ethers";
import { secondsInADay } from "./constants";
import { createBlockIfNotExist, getLastStoredBlock } from "./db/block";
import { BlockWithoutId } from "./db/types";
import {
  ChainContext,
  GetAndSaveVolumeTimeSeriesFn,
  GetParamsPagination,
  Task,
} from "./types";
import { estimateBlockCount } from "./util/util";

export const queryUntilNoData = async (
  subgraphMaxFirstValue: number,
  params: GetParamsPagination,
  task: Task
) => {
  let skip = 0;

  while (true) {
    params.skip = skip;

    const count = await task(params);

    if (count == 0 || count < subgraphMaxFirstValue) {
      return;
    }

    skip += subgraphMaxFirstValue;
  }
};

export const handleRange = async (
  context: ChainContext,
  prisma: PrismaClient,
  getAndSaveVolumeTimeSeries: GetAndSaveVolumeTimeSeriesFn,
  to: BlockWithoutId,
  estimatedBlockTimeMs: number
) => {
  let lastStoredBlock = (await getLastStoredBlock(prisma, context))!;
  if (!lastStoredBlock) {
    throw new Error("Missing starting block");
  }

  logger.info(`handleRange`, {
    data: {
      lastStoredBlock,
      to,
    },
  });

  while (lastStoredBlock.number < to.number) {
    let nextBlockNumber =
      lastStoredBlock.number +
      estimateBlockCount(secondsInADay, estimatedBlockTimeMs);

    nextBlockNumber = Math.min(nextBlockNumber, to.number);

    const nextBlock = await context.provider.getBlock(nextBlockNumber);
    const nextBlockMinimal = {
      chainId: context.chainId,
      number: nextBlock.number,
      hash: nextBlock.hash,
      timestamp: new Date(nextBlock.timestamp * 1000),
    };

    logger.info(
      `get block between ${lastStoredBlock.number} -> ${nextBlockNumber}. (Stopping at ${to.number})`
    );

    await prisma.$transaction(async (tx) => {
      const nextBlockDb = await createBlockIfNotExist(tx, {
        number: nextBlockMinimal.number,
        hash: nextBlockMinimal.hash,
        chainId: context.chainId,
        timestamp: nextBlockMinimal.timestamp,
      });
      await getAndSaveVolumeTimeSeries(tx, lastStoredBlock!, nextBlockDb);
    });
    lastStoredBlock = (await getLastStoredBlock(prisma, context))!;
  }
};
