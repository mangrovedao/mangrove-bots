import Mangrove from "@mangrovedao/mangrove.js";
import { CommonLogger } from "./logging/coreLogger";

const FRESHNESS_BLOCK_SECONDS = 60 * 5; // TODO: should be more precise
const HOW_MANY_BLOCK_BACK = 10;

export const checkFreshness = async (logger: CommonLogger, mgv: Mangrove) => {
  const lastBlock = mgv.reliableProvider.blockManager.getLastBlock();
  try {
    // HOW_MANY_BLOCK_BACK is used to reduce chance to get unknown block on an rpc
    // FIXME: we need to call the rpc because RES does not expose timestamp
    // This should be fixe but as we are launching soon I think this fix is enough for now
    const block = await mgv.provider.getBlock(
      lastBlock.number - HOW_MANY_BLOCK_BACK
    );
    const nowInSeconds = Date.now() / 1000;
    if (block.timestamp + FRESHNESS_BLOCK_SECONDS < nowInSeconds) {
      logger.warn(`It's seems that mangrove is not syncing restart`);
      process.exit(1);
    }
  } catch (e) {
    logger.error("failed check freshness", {
      data: {
        error: e,
      },
    });
  }
};
