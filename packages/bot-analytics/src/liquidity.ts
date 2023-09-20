import { Sdk } from "../.graphclient";
import { Block } from "@prisma/client";
import {
  AggregatedLiquidityWithoutIdAndValuesAsBigInt,
  GetOrCreateTokenFn,
  PrismaTx,
} from "./db/types";
import { ChainContext } from "./types";
import { queryUntilNoData } from "./analytics";
import { getOrCreateAccount } from "./db/account";

export const generateGetAndSaveLiquidityTimeSerie =
  (context: ChainContext, getOrCreateTokenFn: GetOrCreateTokenFn, sdk: Sdk) =>
  async (prisma: PrismaTx, from: Block, to: Block) => {
    const params = {
      first: context.subgraphMaxFirstValue,
      skip: 0,
      currentBlockNumber: to.number,
    };

    await queryUntilNoData(context.subgraphMaxFirstValue, params, async () => {
      const offers = await sdk.getOpenOffers(params);

      const aggregatedLiquidity: Record<
        string,
        AggregatedLiquidityWithoutIdAndValuesAsBigInt
      > = {};

      for (const offer of offers.offers) {
        const owner = offer.owner ? offer.owner : offer.maker;
        const account = await getOrCreateAccount(
          prisma,
          owner.address,
          new Date(owner.creationDate * 1000)
        );

        const token0 = await getOrCreateTokenFn(
          prisma,
          offer.market.outbound_tkn,
          to.timestamp
        );
        const token1 = await getOrCreateTokenFn(
          prisma,
          offer.market.inbound_tkn,
          to.timestamp
        );

        const key = `${token0.address}-${token1.address}-${account.address}`;
        const liquidity = aggregatedLiquidity[key];
        if (!liquidity) {
          aggregatedLiquidity[key] = {
            fromBlockChainId: context.chainId,
            fromBlockNumber: from.number,
            toBlockChainId: context.chainId,
            toBlockNumber: to.number,

            token0ChainId: context.chainId,
            token0Address: token0.address,

            token1ChainId: context.chainId,
            token1Address: token1.address,

            amountToken0: BigInt(offer.wants),
            amountToken1: BigInt(offer.gives),
            accountId: account.address,
          };
        } else {
          liquidity.amountToken0 += BigInt(offer.wants);
          liquidity.amountToken1 += BigInt(offer.gives);
        }
      }

      await prisma.aggregatedLiquidityByMarket.createMany({
        data: Object.values(aggregatedLiquidity).map((liquidity) => ({
          ...liquidity,
          amountToken0: liquidity.amountToken0.toString(),
          amountToken1: liquidity.amountToken1.toString(),
        })),
      });

      return offers.offers.length;
    });
  };
