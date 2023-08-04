import { PrismaClient } from "@prisma/client";
import { logger } from "ethers";
import { Chain } from "../types";

export const inititalizeChains = async (
  prisma: PrismaClient,
  chains: Chain[]
) => {
  logger.info("Initializing chain (if it's not already the case)");
  const [_chains, totalChains] = await prisma.$transaction(
    chains.map((chain) =>
      prisma.chain.upsert({
        where: {
          id: chain.chainId,
          name: chain.name,
        },
        update: {},
        create: {
          id: chain.chainId,
          name: chain.name,
        },
      })
    )
  );
};
