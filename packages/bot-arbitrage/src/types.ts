import { MgvToken } from "@mangrovedao/mangrove.js";
import { ArbParamsStruct } from "./types/typechain/MgvArbitrage";

export type Market = {
  base: string;
  quote: string;
  tickSpacing: number;
  fee: number;
};

export type MarketWithToken = Omit<Market, "base" | "quote"> & {
  base: MgvToken;
  quote: MgvToken;
  uniswapPoolAddress: string;
};

export type Method =
  | "doArbitrageFirstMangroveThenUniswap"
  | "doArbitrageFirstUniwapThenMangrove";

export type ArbParams = ArbParamsStruct & {
  method: Method;
};
