import { typechain } from "@mangrovedao/mangrove.js";
import { Block, Token } from "@prisma/client";
import { getPrice, generateGetPairTokenToUSD } from "../util/priceApi";
import { ChainContext } from "../types";
import { PrismaTx } from "./types";
import { logger } from "ethers";

export const generateCreateTokenIfNotExist = (context: ChainContext) => {
  const ierc20 = typechain.IERC20__factory.createInterface();
  return async (prisma: PrismaTx, address: string): Promise<Token> => {
    let token = await prisma.token.findFirst({
      where: {
        address,
        chainId: context.chainId,
      },
    });

    if (token) {
      return token;
    }

    const calls: typechain.Multicall2.CallStruct[] = [
      {
        target: address,
        callData: ierc20.encodeFunctionData("symbol"),
      },
      {
        target: address,
        callData: ierc20.encodeFunctionData("decimals"),
      },
    ];

    const result = await context.multicall2.callStatic.aggregate(calls);

    const symbol = ierc20.decodeFunctionResult(
      "symbol",
      result.returnData[0]
    )[0];
    const decimals = ierc20.decodeFunctionResult(
      "decimals",
      result.returnData[1]
    )[0];

    token = await prisma.token.create({
      data: {
        address,
        symbol,
        decimals,
        chainId: context.chainId,
      },
    });

    context.seenTokens.add(token);

    return token;
  };
};

export const generateGetTokensPrices = async (context: ChainContext) => {
  const getPairTokenToUSD = await generateGetPairTokenToUSD(context.exchange);

  return async (prisma: PrismaTx, from: Block, to: Block): Promise<void> => {
    const result = await Promise.all(
      Array.from(context.seenTokens.values()).map(async (token) => {
        const pair = getPairTokenToUSD(token.symbol);
        if (!pair) {
          return {
            token,
            price: {
              open: 0,
              high: 0,
              low: 0,
              close: 0,
              volume: 0,
            },
          };
        }
        const price = await getPrice(
          context.exchange,
          pair.id,
          "1d",
          from.timestamp
        );

        return {
          token,
          price,
        };
      })
    );

    const tokensPriceCreationParams = result.map((tokenInfo) => ({
      tokenAddress: tokenInfo.token.address,
      chainId: tokenInfo.token.chainId,
      price: tokenInfo.price.high,
      since: from.timestamp,
      until: to.timestamp,
    }));
    await prisma.tokenPrice.createMany({
      data: tokensPriceCreationParams,
    });
  };
};
