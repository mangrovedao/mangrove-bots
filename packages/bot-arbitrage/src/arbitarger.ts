import { MarketWithToken } from "./types";
import { ArbParamsStruct, MgvArbitrage } from "./types/typechain/MgvArbitrage";
import { Mangrove, typechain, MgvToken } from "@mangrovedao/mangrove.js";

export const activateTokens = async (
  mgv: Mangrove,
  tokens: MgvToken[],
  arbitragerContract: MgvArbitrage
) => {
  const values = await Promise.all(
    tokens.map((token) => {
      return token.allowance({
        owner: arbitragerContract.address,
        spender: mgv.address,
      });
    })
  );

  const tokenToActivate = values
    .map((value, index) => ({ value, index }))
    .filter((value) => value.value.eq(0))
    .map((value) => tokens[value.index]);

  const tx = await arbitragerContract.activateTokens(
    tokenToActivate.map((token) => token.address)
  );
  return tx.wait();
};

export const activatePool = async (
  arbitragerContract: MgvArbitrage,
  uniswapPoolAddress: string
) => {
  const isPoolActivated = await arbitragerContract.pools(uniswapPoolAddress);
  if (!isPoolActivated) {
    const tx = await arbitragerContract.setPool(uniswapPoolAddress, true);

    return tx.wait();
  }
};

const getArbStructs = (
  market: MarketWithToken
): [ArbParamsStruct, ArbParamsStruct] => [
  {
    takerGivesToken: market.base.address,
    takerWantsToken: market.quote.address,
    tickSpacing: market.tickSpacing,
    pool: market.uniswapPoolAddress,
    minimumGain: 0,
  },
  {
    takerGivesToken: market.quote.address,
    takerWantsToken: market.base.address,
    tickSpacing: market.tickSpacing,
    pool: market.uniswapPoolAddress,
    minimumGain: 0,
  },
];

type CallStructWithArbStruct = typechain.Multicall2.CallStruct & {
  arbStruct: ArbParamsStruct;
};

export const checkProfitableArbitrage = async (
  mgv: Mangrove,
  arbitragerContract: MgvArbitrage,
  markets: MarketWithToken[]
) => {
  const arbitrageCalls = markets.reduce<CallStructWithArbStruct[]>(
    (acc, market) => {
      const structs = getArbStructs(market);

      structs.forEach((struct) => {
        acc.push({
          target: arbitragerContract.address,
          callData: arbitragerContract.interface.encodeFunctionData(
            "doArbitrageFirstMangroveThenUniswap",
            [struct]
          ),
          arbStruct: struct,
        });

        acc.push({
          target: arbitragerContract.address,
          callData: arbitragerContract.interface.encodeFunctionData(
            "doArbitrageFirstUniwapThenMangrove",
            [struct]
          ),
          arbStruct: struct,
        });
      });

      return acc;
    },
    [] as CallStructWithArbStruct[]
  );

  const callResults = await mgv.multicallContract.callStatic.tryAggregate(
    false,
    arbitrageCalls
  );

  const bo = await mgv.multicallContract.tryAggregate(false, arbitrageCalls);

  const res = await bo.wait();

  console.log(bo, res);

  return callResults
    .map((result, index) => ({ ...result, index }))
    .filter((result) => result.success)
    .map((result) => arbitrageCalls[result.index].arbStruct);
};
