import { typechain } from "@mangrovedao/mangrove.js";
import { Block } from "@prisma/client";
import { Account, AccountVolumeByPair } from "../.graphclient";
import { PrismaTx } from "./db/types";
import { Block as BlockHeader } from "@ethersproject/providers";

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

export type Task = (params: GetParamsPagination) => Promise<number>;

export type ChainContext = Chain & {
  blockFinality: number;
  multicall2: typechain.Multicall2;
  getBlock: (number: number | string | "latest") => Promise<BlockHeader>;
  subgraphMaxFirstValue: number;
  everyXBlock: number;
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
  | "asMaker"
> & { account: Pick<Account, "id" | "address"> };

export type GetVolumeResults = {
  accountVolumeByPairs: GetVolumesResult[];
};

export type GetTimeSeriesFn = (
  prisma: PrismaTx,
  from: Block,
  to: Block
) => Promise<void>;
