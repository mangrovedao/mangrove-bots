import { GetParamsVolumes } from "./types";
import { Sdk } from "../.graphclient/index";
import { Block, PrismaClient } from "@prisma/client";
import { BlockWithoutId } from "./db/types";

export const getVolumes = async (sdk: Sdk, params: GetParamsVolumes) => {
  const result = await sdk.getVolumes({
    first: params.first,
    skip: params.skip,
    latestDate: Math.round(params.latestDate.getTime() / 1000),
    currentBlockNumber: params.currentBlockNumber,
  });

  return result;
};

export const getAndSaveVolumeTimeSerie = async (
  prisma: PrismaClient,
  from: Block,
  to: BlockWithoutId
) => {
  const volumes = getVolumes({
    skip: 0,
  });
};
