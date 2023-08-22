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

import {
  ERC20_ABI,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from "./constants";
import { MAX_FEE_PER_GAS, MAX_PRIORITY_FEE_PER_GAS } from "./constants";
import { getPoolInfo } from "./pool";
import { fromReadableAmount } from "./conversion";
import { TransactionState, sendTransactionViaWallet } from "./transcation";

export type TokenTrade = Trade<Token, Token, TradeType>;

// Trading Functions

export async function createTrade(
  poolFactoryAddress: string,
  inToken: Token,
  inAmount: number,
  outToken: Token,
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

  const pool = new Pool(
    inToken,
    outToken,
    fee,
    poolInfo.sqrtPriceX96.toString(),
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  const swapRoute = new Route([pool], inToken, outToken);

  const amountOut = await getOutputQuote(
    inToken,
    inAmount,
    swapRoute,
    provider
  );

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      inToken,
      fromReadableAmount(inAmount, inToken.decimals).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      outToken,
      JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  return uncheckedTrade;
}

export async function executeTrade(
  outToken: Token,
  trade: TokenTrade,
  signer: Signer,
  provider: ethers.providers.Provider
): Promise<TransactionState> {
  const walletAddress = await signer.getAddress();
  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  // Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(
    outToken,
    provider,
    signer
  );

  // Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed;
  }

  const options: SwapOptions = {
    slippageTolerance: new Percent(500, 10000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  const res = await sendTransactionViaWallet(tx, signer);

  return res;
}

// Helper Quoting and Pool Functions

async function getOutputQuote(
  inToken: Token,
  inAmount: number,
  route: Route<Currency, Currency>,
  provider: ethers.providers.Provider
) {
  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      inToken,
      fromReadableAmount(inAmount, inToken.decimals)
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  return ethers.utils.defaultAbiCoder.decode(["uint256"], quoteCallReturnData);
}

export async function getTokenTransferApproval(
  token: Token,
  provider: ethers.providers.Provider,
  signer: Signer
): Promise<TransactionState> {
  const address = await signer.getAddress();
  if (!provider || !address) {
    console.log("No Provider Found");
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );

    const transaction = await tokenContract.populateTransaction.approve(
      SWAP_ROUTER_ADDRESS,
      TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER
    );

    return sendTransactionViaWallet(transaction, signer);
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}
