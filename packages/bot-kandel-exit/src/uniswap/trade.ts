import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import {
  FeeAmount,
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import { Signer, ethers } from "ethers";
import JSBI from "jsbi";

import { MgvToken } from "@mangrovedao/mangrove.js";
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from "./constants";
import { getPoolInfo } from "./pool";
import { sendTransactionViaWallet } from "./transcation";

export type TokenTrade = Trade<Token, Token, TradeType>;

// Trading Functions

export async function createTrade(
  poolFactoryAddress: string,
  quoterAddress: string,
  inToken: MgvToken,
  inAmount: number,
  outToken: MgvToken,
  fee: FeeAmount,
  provider: ethers.providers.Provider
): Promise<TokenTrade> {
  const poolInfo = await getPoolInfo(
    poolFactoryAddress,
    inToken,
    outToken,
    fee,
    provider
  );

  const uniInToken = new Token(
    inToken.mgv.network.id,
    inToken.address,
    inToken.decimals
  );
  const uniOutToken = new Token(
    outToken.mgv.network.id,
    outToken.address,
    outToken.decimals
  );
  const pool = new Pool(
    uniInToken,
    uniOutToken,
    fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  const swapRoute = new Route([pool], uniInToken, uniOutToken);

  const amountOut = await getOutputQuote(
    swapRoute,
    provider,
    inToken,
    inAmount,
    quoterAddress
  );

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      uniInToken,
      inToken.toUnits(inAmount).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      uniOutToken,
      JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  return uncheckedTrade;
}

export async function executeTrade(
  inToken: MgvToken,
  trade: TokenTrade,
  swapRouterAddress: string,
  signer: Signer,
  provider: ethers.providers.Provider
): Promise<ethers.providers.TransactionReceipt> {
  const walletAddress = await signer.getAddress();
  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  // Give approval to the router to spend the token
  const approveTx = await inToken.approve(swapRouterAddress);
  await approveTx.wait();

  const options: SwapOptions = {
    slippageTolerance: new Percent(500, 10000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: swapRouterAddress,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  const res = await sendTransactionViaWallet(tx, signer);

  return res;
}

async function getOutputQuote(
  route: Route<Currency, Currency>,
  provider: ethers.providers.Provider,
  inToken: MgvToken,
  inAmount: number,
  quoterAddress: string
) {
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      new Token(inToken.mgv.network.id, inToken.address, inToken.decimals),
      inToken.toUnits(inAmount).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: quoterAddress,
    data: calldata,
  });

  return ethers.utils.defaultAbiCoder.decode(["uint256"], quoteCallReturnData);
}
