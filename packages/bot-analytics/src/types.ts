import { typechain } from "@mangrovedao/mangrove.js";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Block, Prisma, PrismaClient } from "@prisma/client";
import { BlockWithoutId } from "./db/types";

export type GetParamsPagination = {
  first: number;
  skip: number;
};

export type GetParamsTimeTravelled = {
  currentBlockNumber: number;
};

export type GetParamsVolumes = GetParamsTimeTravelled &
  GetParamsPagination & {
    latestDate: Date;
  };

export type Chain = {
  chainId: number;
  name: string;
};

export type Task = (
  prisma: PrismaClient,
  from: Block,
  to: BlockWithoutId
) => Prisma.PrismaPromise<any>;

export type ChainContext = Chain & {
  multicall2: typechain.Multicall2;
  provider: JsonRpcProvider;
};
