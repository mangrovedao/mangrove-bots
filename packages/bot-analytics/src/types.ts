import { typechain } from "@mangrovedao/mangrove.js";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Block, Prisma, PrismaClient } from "@prisma/client";
import { Account, AccountVolumeByPair } from "../.graphclient";

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
  to: Block
) => Prisma.PrismaPromise<any>;

export type ChainContext = Chain & {
  multicall2: typechain.Multicall2;
  provider: JsonRpcProvider;
};

export type GetVolumesResult = Pick<
  AccountVolumeByPair,
  | "id"
  | "updatedDate"
  | "token0"
  | "token1"
  | "token0Sent"
  | "token0Received"
  | "token1Sent"
  | "token1Received"
> & { account: Pick<Account, "id" | "address"> };
