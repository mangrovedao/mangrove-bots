import { Block, PrismaClient } from "@prisma/client";
import logger from "./util/logger";
import { createBlockIfNotExist, getLastStoredBlock } from "./db/block";
import {
  ChainContext,
  GetParamsPagination,
  GetTimeSeriesFn,
  Task,
} from "./types";

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
  getTimeSeriesFns: GetTimeSeriesFn[],
  to: Block
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
    let nextBlockNumber = lastStoredBlock.number + context.everyXBlock;

    nextBlockNumber = Math.min(nextBlockNumber, to.number);

    const nextBlock = await context.getBlock(nextBlockNumber);
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

      /* I voluntary choose to handle querying task sycnhronously to avoid race condition */
      for (const getTimeSeries of getTimeSeriesFns) {
        await getTimeSeries(tx, lastStoredBlock!, nextBlockDb);
      }
    });
    lastStoredBlock = (await getLastStoredBlock(prisma, context))!;
  }
};
