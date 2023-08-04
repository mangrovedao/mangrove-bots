import { Block, PrismaClient } from "@prisma/client";
import { ChainContext } from "../types";
import { BlockWithoutId } from "./types";

export const createBlockIfNotExist = async (
  prisma: PrismaClient,
  block: BlockWithoutId
) => {
  /*
   * here I was unable to use upsert as the typescript compiler want me to provide an id
   * but id are auto generated at creation time...
   * */
  const _block = await prisma.block.findFirst({
    where: block,
  });

  if (!_block) {
    await prisma.block.create({
      data: block,
    });
  }
};

export const getLastStoredBlock = async (
  prisma: PrismaClient,
  context: ChainContext
): Promise<Block | null> => {
  const block = await prisma.block.findFirst({
    orderBy: {
      number: "desc",
    },
    where: {
      chainId: context.chainId,
    },
  });

  return block;
};
