import { CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import {
  MintOptions,
  nearestUsableTick,
  NonfungiblePositionManager,
  Pool,
  Position,
} from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";

import {
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  NONFUNGIBLE_POSITION_MANAGER_ABI,
  ERC20_ABI,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from "./constants";
import { fromReadableAmount } from "./conversion";
import { TransactionState, sendTransactionViaWallet } from "./transcation";
import { getPoolInfo } from "./pool";

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
  token0: Token;
  token0Amount: number;
  token1: Token;
  token1Amount: number;
  poolFee: number;
  nfManagerAddress: string;
  poolFactoryAddress: string;
  provider: ethers.providers.Provider;
  signer: ethers.Signer;
}): Promise<TransactionState> {
  const readableToken0Amount = fromReadableAmount(
    params.token0Amount,
    params.token0.decimals
  );
  const readableToken1Amount = fromReadableAmount(
    params.token1Amount,
    params.token1.decimals
  );

  // Give approval to the contract to transfer tokens
  const tokenInApproval = await getTokenTransferApproval(
    params.token0,
    params.nfManagerAddress,
    params.provider,
    params.signer
  );
  const tokenOutApproval = await getTokenTransferApproval(
    params.token1,
    params.nfManagerAddress,
    params.provider,
    params.signer
  );

  // Fail if transfer approvals do not go through
  if (
    tokenInApproval !== TransactionState.Sent ||
    tokenOutApproval !== TransactionState.Sent
  ) {
    return TransactionState.Failed;
  }
  const token0CurrenyAmount = CurrencyAmount.fromRawAmount(
    params.token0,
    readableToken0Amount
  );

  const token1CurrenyAmount = CurrencyAmount.fromRawAmount(
    params.token1,
    readableToken1Amount
  );

  const positionToMint = await constructPosition(
    token0CurrenyAmount,
    token1CurrenyAmount,
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
  token0Amount: CurrencyAmount<Token>,
  token1Amount: CurrencyAmount<Token>,
  poolFactoryAddress: string,
  poolFee: number,
  provider: ethers.providers.Provider
): Promise<Position> {
  // get pool info
  const poolInfo = await getPoolInfo(
    poolFactoryAddress,
    token0Amount.currency,
    token1Amount.currency,
    poolFee,
    provider
  );

  // construct pool instance
  const configuredPool = new Pool(
    token0Amount.currency,
    token1Amount.currency,
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
    amount0: token0Amount.quotient,
    amount1: token1Amount.quotient,
    useFullPrecision: true,
  });
}

export async function getPositionIds(
  nfManagerAddress: string,
  provider: ethers.providers.Provider
): Promise<number[]> {
  const positionContract = new ethers.Contract(
    nfManagerAddress,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  );

  // Get number of positions
  const balance: number = await positionContract.balanceOf(nfManagerAddress);

  // Get all positions
  const tokenIds = [];
  for (let i = 0; i < balance; i++) {
    const tokenOfOwnerByIndex: number =
      await positionContract.tokenOfOwnerByIndex(nfManagerAddress, i);
    tokenIds.push(tokenOfOwnerByIndex);
  }

  return tokenIds;
}

export async function getPositionInfo(
  tokenId: number,
  nfManagerAddress: string,
  provider: ethers.providers.Provider
): Promise<PositionInfo> {
  const positionContract = new ethers.Contract(
    nfManagerAddress,
    NONFUNGIBLE_POSITION_MANAGER_ABI,
    provider
  );

  const position = await positionContract.positions(tokenId);

  return {
    tickLower: position.tickLower,
    tickUpper: position.tickUpper,
    liquidity: position.liquidity,
    feeGrowthInside0LastX128: position.feeGrowthInside0LastX128,
    feeGrowthInside1LastX128: position.feeGrowthInside1LastX128,
    tokensOwed0: position.tokensOwed0,
    tokensOwed1: position.tokensOwed1,
  };
}

export async function getTokenTransferApproval(
  token: Token,
  nfManagerAddress: string,
  provider: ethers.providers.Provider,
  signer: ethers.Signer
): Promise<TransactionState> {
  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );
    const uint256Max =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    const transaction = await tokenContract.populateTransaction.approve(
      nfManagerAddress,
      uint256Max
    );

    return sendTransactionViaWallet(transaction, signer);
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}
