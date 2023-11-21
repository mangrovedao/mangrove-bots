import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { computePoolAddress } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { PoolInfo } from "./types";

export async function getPoolInfo(
  poolFactoryAddress: string,
  token0: Token,
  token1: Token,
  poolFee: number,
  provider: ethers.providers.Provider
): Promise<PoolInfo> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: poolFactoryAddress,
    tokenA: token0,
    tokenB: token1,
    fee: poolFee,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );

  const [token0_, token1_, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

  return {
    token0: token0_,
    token1: token1_,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
    poolContract: poolContract,
  };
}
