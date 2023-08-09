import { Sdk } from "../.graphclient";
import { Block } from "@prisma/client";
import {
  AggregatedLiquidityWithoutIdAndValuesAsBigInt,
  GetOrCreateTokenFn,
  PrismaTx,
} from "./db/types";
import { ChainContext } from "./types";
import { queryUntilNoData } from "./analytics";

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
        const token0 = await getOrCreateTokenFn(
          prisma,
          offer.market.outbound_tkn
        );
        const token1 = await getOrCreateTokenFn(
          prisma,
          offer.market.inbound_tkn
        );

        const key = `${token0.address}-${token1.address}`;
        const liquidity = aggregatedLiquidity[key];
        if (!liquidity) {
          aggregatedLiquidity[key] = {
            fromBlockId: from.id,
            toBlockId: to.id,

            token0Id: token0.id,
            token1Id: token1.id,

            amountToken0: BigInt(offer.wants),
            amountToken1: BigInt(offer.gives),
          };
        } else {
          liquidity.amountToken0 += BigInt(offer.wants);
          liquidity.amountToken1 += BigInt(offer.gives);
        }
      }

      await prisma.aggregatedLiquidityByMarket.createMany({
        data: Object.values(aggregatedLiquidity).map((liquidity) => ({
          fromBlockId: liquidity.fromBlockId,
          toBlockId: liquidity.toBlockId,
          token0Id: liquidity.token0Id,
          token1Id: liquidity.token1Id,
          amountToken0: liquidity.amountToken0.toString(),
          amountToken1: liquidity.amountToken1.toString(),
        })),
      });

      return offers.offers.length;
    });
  };
