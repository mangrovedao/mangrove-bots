import { Block, PrismaClient } from "@prisma/client";
import { ChainContext } from "../types";
import { BlockWithoutId, PrismaTx } from "./types";

export const createBlockIfNotExist = async (
  prisma: PrismaTx,
  block: BlockWithoutId
): Promise<Block> => {
  /*
   * here I was unable to use upsert as the typescript compiler want me to provide an id
   * but id are auto generated at creation time...
   * */
  let _block = await prisma.block.findFirst({
    where: block,
  });

  if (!_block) {
    _block = await prisma.block.create({
      data: block,
    });
  }

  return _block;
};

export const getLastStoredBlock = async (
  prisma: PrismaTx,
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
