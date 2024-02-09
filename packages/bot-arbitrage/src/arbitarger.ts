import { ArbParams, Market, MarketWithToken, Method } from "./types";
import { ArbParamsStruct, MgvArbitrage } from "./types/typechain/MgvArbitrage";
import { Mangrove, typechain, Token } from "@mangrovedao/mangrove.js";

export const activateTokens = async (
  mgv: Mangrove,
  tokens: Token[],
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

  const gasEstimate = await arbitragerContract.estimateGas.activateTokens(
    tokenToActivate.map((token) => token.address)
  );

  const tx = await arbitragerContract.activateTokens(
    tokenToActivate.map((token) => token.address),
    {
      gasLimit: gasEstimate.mul(2),
    }
  );

  return tx.wait();
};

export const activatePool = async (
  uniswapPoolAddress: string,
  arbitragerContract: MgvArbitrage
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
  arbStruct: ArbParams;
};

export const checkProfitableArbitrage = async (
  mgv: Mangrove,
  arbitragerContract: MgvArbitrage,
  markets: MarketWithToken[],
  methods: Method[]
) => {
  const arbitrageCalls = markets.reduce<CallStructWithArbStruct[]>(
    (acc, market) => {
      const structs = getArbStructs(market);

      structs.forEach((struct) => {
        methods.forEach((method) => {
          acc.push({
            target: arbitragerContract.address,
            callData: arbitragerContract.interface.encodeFunctionData(
              `${method}` as
                | "doArbitrageFirstUniwapThenMangrove"
                | "doArbitrageFirstUniwapThenMangrove",
              [struct]
            ),
            arbStruct: {
              ...struct,
              method: method,
            },
          });
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

  return callResults
    .map((result, index) => ({ ...result, index }))
    .filter((result) => result.success)
    .map((result) => arbitrageCalls[result.index].arbStruct);
};

export const doArbitrage = async (
  arbitragerContract: MgvArbitrage,
  arbParams: ArbParams
) => {
  const gasEstimate = await arbitragerContract.estimateGas[arbParams.method](
    arbParams
  );

  const tx = await arbitragerContract[arbParams.method](arbParams, {
    gasLimit: gasEstimate,
  });

  return tx.wait();
};

export const arbitrage = async (
  mgv: Mangrove,
  arbitragerContract: MgvArbitrage,
  markets: MarketWithToken[],
  methods: Method[]
) => {
  const profitableArbs = await checkProfitableArbitrage(
    mgv,
    arbitragerContract,
    markets,
    methods
  );

  return await Promise.all(
    profitableArbs.map((arb) => doArbitrage(arbitragerContract, arb))
  );
};
