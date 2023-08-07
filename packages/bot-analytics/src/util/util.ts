import { Block } from "@ethersproject/providers";
import { BlockWithoutId } from "../db/types";
import { ChainContext } from "../types";
/**
 * estimateBlockCount estimate the amount of block that a chain should produce
 * in timeSeconds. If block time is ~ blockTimeMs.
 */
export const estimateBlockCount = (
  timeSeconds: number,
  blockTimeMs: number
): number => timeSeconds / (blockTimeMs / 1000);

export const generateBlockHeaderToBlockWithoutId =
  (context: ChainContext) =>
  (block: Block): BlockWithoutId => ({
    number: block.number,
    hash: block.hash,
    timestamp: new Date(block.timestamp * 1000),
    chainId: context.chainId,
  });
