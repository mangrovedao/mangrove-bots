import { BigNumber, Contract } from "ethers";

export type MinimalPoolInfo = {
  token0: string;
  token1: string;
  fee: number;
};

export type PoolInfo = MinimalPoolInfo & {
  tickSpacing: number;
  sqrtPriceX96: BigNumber;
  liquidity: BigNumber;
  tick: number;
  poolContract: Contract;
};
