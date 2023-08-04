import { typechain } from "@mangrovedao/mangrove.js";
import { PrismaClient, PrismaPromise } from "@prisma/client";
import { ChainContext } from "../types";

export const generateCreateTokenIfNotExist = (context: ChainContext) => {
  const ierc20 = typechain.IERC20__factory.createInterface();
  return async (
    prisma: PrismaClient,
    address: string
  ): Promise<PrismaPromise<any> | null> => {
    const token = await prisma.token.findFirst({
      where: {
        address,
        chainId: context.chainId,
      },
    });

    if (token) {
      return null;
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

    return prisma.token.create({
      data: {
        address,
        symbol,
        decimals,
        chainId: context.chainId,
      },
    });
  };
};
