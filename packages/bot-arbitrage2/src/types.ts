import { MgvToken } from "@mangrovedao/mangrove.js";

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
