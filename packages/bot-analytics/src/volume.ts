import { ChainContext, GetVolumesResult } from "./types";
import { Sdk } from "../.graphclient/index";
import { Block } from "@prisma/client";
import {
  AccountActivityWithoutId,
  getOrCreateTokenFn,
  PrismaTx,
} from "./db/types";
import { getOrCreateAccount } from "./db/account";

export const generateGetAndSaveVolumeTimeSerie =
  (context: ChainContext, getOrCreateTokenFn: getOrCreateTokenFn, sdk: Sdk) =>
  async (prisma: PrismaTx, from: Block, to: Block) => {
    let skip = 0;

    while (true) {
      const params = {
        first: context.subgraphMaxFirstValue,
        skip,
        currentBlockNumber: to.number,
        latestDate: from.timestamp,
      };

      const volumes = (
        await sdk.getVolumes(params)
      ).accountVolumeByPairs.reduce((acc, vol) => {
        acc[vol.id] = vol;
        return acc;
      }, {} as Record<string, GetVolumesResult>);

      if (Object.values(volumes).length === 0) {
        return;
      }

      const accountsActivities: AccountActivityWithoutId[] = [];

      for (const vol of Object.values(volumes)) {
        const account = await getOrCreateAccount(prisma, vol.account.address);

        const token0 = await getOrCreateTokenFn(prisma, vol.token0);
        const token1 = await getOrCreateTokenFn(prisma, vol.token1);

        const previousActivity = await prisma.accountActivity.findFirst({
          where: {
            accountId: account.address,
            toBlockId: {
              lt: to.id,
            },
            token0Id: token0.id,
            token1Id: token1.id,
            asMaker: vol.asMaker,
            chainId: context.chainId,
          },
          orderBy: {
            fromBlockId: "desc",
          },
        });

        accountsActivities.push({
          fromBlockId: from.id,
          toBlockId: to.id,

          token0Id: token0.id,
          token1Id: token1.id,

          sent0: previousActivity
            ? (
                BigInt(vol.token0Sent) - BigInt(previousActivity.sent0)
              ).toString()
            : vol.token0Sent,
          received0: previousActivity
            ? (
                BigInt(vol.token0Received) - BigInt(previousActivity.received0)
              ).toString()
            : vol.token0Received,

          totalSent0: vol.token0Sent,
          totalReceived0: vol.token0Received,

          sent1: previousActivity
            ? (
                BigInt(vol.token1Sent) - BigInt(previousActivity.sent1)
              ).toString()
            : vol.token1Sent,
          received1: previousActivity
            ? (
                BigInt(vol.token1Received) - BigInt(previousActivity.received1)
              ).toString()
            : vol.token1Received,

          totalSent1: vol.token1Sent,
          totalReceived1: vol.token1Received,

          chainId: context.chainId,
          accountId: vol.account.address,
          asMaker: vol.asMaker,
        });
      }

      await prisma.accountActivity.createMany({
        data: accountsActivities,
      });

      if (Object.keys(volumes).length < context.subgraphMaxFirstValue) {
        return;
      }

      skip += context.subgraphMaxFirstValue;
    }
  };
