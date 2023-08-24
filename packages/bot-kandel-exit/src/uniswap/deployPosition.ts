import { CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import {
  MintOptions,
  NonfungiblePositionManager,
  Pool,
  Position,
  nearestUsableTick,
} from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";

import { MgvToken } from "@mangrovedao/mangrove.js";
import {
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  NONFUNGIBLE_POSITION_MANAGER_ABI,
} from "./constants";
import { getPoolInfo } from "./pool";
import { sendTransactionViaWallet } from "./transcation";

export interface PositionInfo {
  tickLower: number;
  tickUpper: number;
  liquidity: BigNumber;
  feeGrowthInside0LastX128: BigNumber;
  feeGrowthInside1LastX128: BigNumber;
  tokensOwed0: BigNumber;
  tokensOwed1: BigNumber;
}

export async function mintPosition(params: {
  token0: MgvToken;
  token0Amount: number;
  token1: MgvToken;
  token1Amount: number;
  poolFee: number;
  nfManagerAddress: string;
  poolFactoryAddress: string;
  provider: ethers.providers.Provider;
  signer: ethers.Signer;
}): Promise<ethers.providers.TransactionReceipt> {
  const positionToMint = await constructPosition(
    params.token0,
    params.token0.toUnits(params.token0Amount),
    params.token1,
    params.token1.toUnits(params.token1Amount),
    params.poolFactoryAddress,
    params.poolFee,
    params.provider
  );

  const mintOptions: MintOptions = {
    recipient: await params.signer.getAddress(),
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  };

  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    positionToMint,
    mintOptions
  );

  // build transaction
  const transaction = {
    data: calldata,
    to: params.nfManagerAddress,
    value: value,
    from: await params.signer.getAddress(),
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  return sendTransactionViaWallet(transaction, params.signer);
}

export async function constructPosition(
  token0: MgvToken,
  token0Amount: BigNumber,
  token1: MgvToken,
  token1Amount: BigNumber,
  poolFactoryAddress: string,
  poolFee: number,
  provider: ethers.providers.Provider
): Promise<Position> {
  // get pool info
  const poolInfo = await getPoolInfo(
    poolFactoryAddress,
    token0,
    token1,
    poolFee,
    provider
  );

  const uniToken0 = new Token(
    token0.mgv.network.id,
    token0.address,
    token0.decimals
  );
  const uniToken1 = new Token(
    token1.mgv.network.id,
    token1.address,
    token1.decimals
  );
  // construct pool instance
  const configuredPool = new Pool(
    uniToken0,
    uniToken1,
    poolInfo.fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  // create position using the maximum liquidity from input amounts
  return Position.fromAmounts({
    pool: configuredPool,
    tickLower:
      nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) -
      poolInfo.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolInfo.tick, poolInfo.tickSpacing) +
      poolInfo.tickSpacing * 2,
    amount0: CurrencyAmount.fromRawAmount(uniToken0, token0Amount.toString())
      .quotient,
    amount1: CurrencyAmount.fromRawAmount(uniToken1, token1Amount.toString())
      .quotient,
    useFullPrecision: true,
  });
}
