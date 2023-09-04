import { Provider } from "@ethersproject/abstract-provider";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { BigNumber, Contract } from "ethers";
import { MinimalPoolInfo } from "./types";

export const generateGetOutputQuote = (
  quoterContractAddress: string,
  provider: Provider
) => {
  const quoterContract = new Contract(
    quoterContractAddress,
    Quoter.abi,
    provider
  );

  return {
    quoteExactInputSingle: async (
      poolInfo: MinimalPoolInfo,
      inAmount: string
    ): Promise<BigNumber> => {
      const amount = await quoterContract.callStatic.quoteExactInputSingle(
        poolInfo.token0,
        poolInfo.token1,
        poolInfo.fee,
        inAmount,
        0
      );

      return amount;
    },
  };
};
