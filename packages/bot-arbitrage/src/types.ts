import { MgvToken } from "@mangrovedao/mangrove.js";
import { ArbParamsStruct } from "./types/typechain/MgvArbitrage";

export type Market = {
  base: string;
  quote: string;
  tickSpacing: string;
  uniswapPoolAddress: string;
};

export type MarketWithToken = Omit<Market, "base" | "quote"> & {
  base: MgvToken;
  quote: MgvToken;
};

export type Method =
  | "doArbitrageFirstMangroveThenUniswap"
  | "doArbitrageFirstUniwapThenMangrove";

export type ArbParams = ArbParamsStruct & {
  method: Method;
};
