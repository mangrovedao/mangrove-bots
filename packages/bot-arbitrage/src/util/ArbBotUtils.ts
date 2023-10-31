import Mangrove from "@mangrovedao/mangrove.js";

import { Token } from "@uniswap/sdk-core";
import { getPoolInfo } from "../uniswap/pool";
import { Market, MarketWithToken } from "../types";

export const getMarketWithUniswapPool = async (
  mgv: Mangrove,
  factoryAddress: string,
  market: Market
): Promise<MarketWithToken> => {
  const base = await mgv.token(market.base);
  const quote = await mgv.token(market.quote);

  const poolInfo = await getPoolInfo(
    factoryAddress,
    new Token(mgv.network.id!, base.address, base.decimals),
    new Token(mgv.network.id!, quote.address, quote.decimals),
    market.fee,
    mgv.provider
  );

  return {
    base: base,
    quote: quote,
    tickSpacing: market.tickSpacing,
    fee: market.fee,
    uniswapPoolAddress: poolInfo.poolContract.address,
  };
};
