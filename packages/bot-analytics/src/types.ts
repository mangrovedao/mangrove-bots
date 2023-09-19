import { typechain } from "@mangrovedao/mangrove.js";
import { Block, Token } from "@prisma/client";
import { Account, AccountVolumeByPair, Market, Offer } from "../.graphclient";
import { PrismaTx } from "./db/types";
import { Block as BlockHeader } from "@ethersproject/providers";
import { binance, OHLCV } from "ccxt";

export type GetParamsPagination = {
  first: number;
  skip: number;
};

export type GetParamsTimeTravelled = GetParamsPagination & {
  currentBlockNumber: number;
};

export type GetParamsVolumes = GetParamsTimeTravelled & {
  latestDate: Date;
};

export type Chain = {
  chainId: number;
  name: string;
};

export type Task = (params: GetParamsPagination) => Promise<number>;

export type PriceMocks = Record<string, OHLCV>;

export type ChainContext = Chain & {
  blockFinality: number;
  multicall2: typechain.Multicall2;
  getBlock: (number: number | string | "latest") => Promise<BlockHeader>;
  subgraphMaxFirstValue: number;
  everyXBlock: number;
  exchange: binance;
  seenTokens: Set<Token>;
  priceMocks: PriceMocks;
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

export type OpenOffer = Pick<Offer, "id" | "wants" | "gives"> & {
  maker: Pick<Account, "address">;
  market: Pick<Market, "outbound_tkn" | "inbound_tkn">;
  owner?: Pick<Account, "address">;
};

export type GetOpenOffersResult = {
  offers: OpenOffer[];
};
