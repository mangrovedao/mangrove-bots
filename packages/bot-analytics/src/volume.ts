import { ChainContext, GetParamsVolumes, GetVolumesResult } from "./types";
import { Sdk } from "../.graphclient/index";
import { Block } from "@prisma/client";
import {
  AccountActivityWithoutId,
  getOrCreateTokenFn,
  PrismaTx,
} from "./db/types";
import { subgraphMaxFirstValue } from "./constants";
import { getOrCreateAccount } from "./db/account";

export const getVolumes = async (sdk: Sdk, params: GetParamsVolumes) => {
  const result = await sdk.getVolumes({
    first: params.first,
    skip: params.skip,
    latestDate: Math.round(params.latestDate.getTime() / 1000),
    currentBlockNumber: params.currentBlockNumber,
  });

  return result;
};

export const generateGetAndSaveVolumeTimeSerie =
  (context: ChainContext, getOrCreateTokenFn: getOrCreateTokenFn, sdk: Sdk) =>
  async (prisma: PrismaTx, from: Block, to: Block) => {
    let skip = 0;

    while (true) {
      const params = {
        first: subgraphMaxFirstValue,
        skip,
        currentBlockNumber: to.number,
        latestDate: from.timestamp,
      };

      const volumes = (
        await getVolumes(sdk, params)
      ).accountVolumeByPairs.reduce((acc, vol) => {
        acc[vol.id] = vol;
        return acc;
      }, {} as Record<string, GetVolumesResult>);

      const prepareAccountActivities = await Promise.all(
        Object.values(volumes).map(async (vol) => {
          const account = await getOrCreateAccount(prisma, vol.account.address);

          const token0 = await getOrCreateTokenFn(prisma, vol.token0);
          const token1 = await getOrCreateTokenFn(prisma, vol.token1);

          const [previousToken0Activity, previousToken1Activity] =
            await Promise.all([
              prisma.accountActivity.findFirst({
                where: {
                  accountId: account.address,
                  toBlockId: {
                    lt: to.id,
                  },
                  tokenId: token0.id,
                  chainId: context.chainId,
                },
                orderBy: {
                  fromBlockId: "desc",
                },
              }),
              prisma.accountActivity.findFirst({
                where: {
                  accountId: account.address,
                  toBlockId: {
                    lt: to.id,
                  },
                  tokenId: token1.id,
                  chainId: context.chainId,
                },
                orderBy: {
                  fromBlockId: "desc",
                },
              }),
            ]);

          return {
            ...vol,
            account,
            token0,
            token1,
            previousToken0Activity,
            previousToken1Activity,
          };
        })
      );

      const accountsActivities = prepareAccountActivities.reduce((acc, vol) => {
        acc.push({
          fromBlockId: from.id,
          toBlockId: to.id,

          tokenId: vol.token0.id,

          sent: vol.previousToken0Activity
            ? (
                BigInt(vol.token0Sent) - BigInt(vol.previousToken0Activity.sent)
              ).toString()
            : vol.token0Sent,
          received: vol.previousToken0Activity
            ? (
                BigInt(vol.token0Received) -
                BigInt(vol.previousToken0Activity.received)
              ).toString()
            : vol.token0Received,

          totalSent: vol.token0Sent,
          totalReceived: vol.token0Received,

          chainId: context.chainId,

          accountId: vol.account.address,
        });

        acc.push({
          fromBlockId: from.id,
          toBlockId: to.id,

          tokenId: vol.token1.id,

          sent: vol.previousToken1Activity
            ? (
                BigInt(vol.token1Sent) - BigInt(vol.previousToken1Activity.sent)
              ).toString()
            : vol.token1Sent,
          received: vol.previousToken1Activity
            ? (
                BigInt(vol.token1Received) -
                BigInt(vol.previousToken1Activity.received)
              ).toString()
            : vol.token1Received,

          totalSent: vol.token1Sent,
          totalReceived: vol.token1Received,

          chainId: context.chainId,

          accountId: vol.account.address,
        });

        return acc;
      }, [] as AccountActivityWithoutId[]);

      await prisma.accountActivity.createMany({
        data: accountsActivities,
      });

      if (Object.keys(volumes).length < subgraphMaxFirstValue) {
        return;
      }

      skip = subgraphMaxFirstValue;
    }
  };
