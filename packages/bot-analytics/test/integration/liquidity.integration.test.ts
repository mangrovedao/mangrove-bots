import { Account, Block, PrismaClient } from "@prisma/client";
import { Block as BlockHeader } from "@ethersproject/providers";
import {
  Chain,
  ChainContext,
  GetOpenOffersResult,
  GetParamsTimeTravelled,
  OpenOffer,
} from "../../src/types";
import { generateGetAndSaveLiquidityTimeSerie } from "../../src/liquidity";
import { PrismaTx, TokenWithoutId } from "../../src/db/types";
import { startDb } from "../helpers/start-db";
import { inititalizeChains } from "../../src/db/init";
import { generateBlockHeaderToDbBlock } from "../../src/util/util";
import { Sdk } from "../../.graphclient";
import { createBlockIfNotExist } from "../../src/db/block";
import { handleRange } from "../../src/analytics";
import assert from "assert";
import { binance } from "ccxt";

describe("Available Liquidity tracking", () => {
  let prisma: PrismaClient | undefined;
  let stop: () => Promise<void> | undefined;
  let resetDb: () => Promise<void> | undefined;

  const chainId = 0;

  const chain: Chain = {
    name: "test",
    chainId,
  };

  const blocks: Record<string, BlockHeader> = {
    "1": {
      number: 1,
      hash: "0x1",
      timestamp: Date.now() / 1000,
    } as BlockHeader,
    "2": {
      number: 2,
      hash: "0x2",
      timestamp: Date.now() / 1000 + 2000,
    } as BlockHeader,
    "3": {
      number: 3,
      hash: "0x3",
      timestamp: Date.now() / 1000 + 2000 * 2,
    } as BlockHeader,
  };

  const context: ChainContext = {
    ...chain,
    blockFinality: 0,
    getBlock: async (number: string | number) => {
      return blocks[number];
    },
    multicall2: {} as any,
    subgraphMaxFirstValue: 100,
    everyXBlock: 1,
    exchange: new binance(),
    seenTokens: new Set(),
  };

  const account0: Account = {
    address: "account0",
  };

  const account1: Account = {
    address: "account1",
  };

  const account3: Account = {
    address: "account3",
  };

  const token0: TokenWithoutId = {
    address: "token0",
    symbol: "tkn0",
    decimals: 18,
    chainId,
  };

  const token1: TokenWithoutId = {
    address: "token1",
    symbol: "tkn1",
    decimals: 18,
    chainId,
  };

  const tokens = {
    [token0.address]: token0,
    [token1.address]: token1,
  };

  const getOrCreateTokenFn = async (prisma: PrismaTx, address: string) => {
    let token = await prisma.token.findFirst({
      where: {
        address,
        chainId: chainId,
      },
    });

    if (!token) {
      token = await prisma.token.create({
        data: tokens[address],
      });
    }
    return token;
  };

  const generateMockSdk = (offers: Record<string, OpenOffer[]>): Sdk =>
    ({
      getOpenOffers: async (
        params: GetParamsTimeTravelled
      ): Promise<GetOpenOffersResult> => {
        const results = offers[params.currentBlockNumber];
        return {
          offers: results.slice(
            params.skip,
            params.skip === 0 ? params.first : params.first + params.skip
          ),
        };
      },
    } as Sdk);

  const getLatestLiquidityWithPairAtBlock = async (
    blockNumber: number,
    token0address: string,
    token1address: string,
    maker: string
  ) => {
    const token0 = await getOrCreateTokenFn(prisma!, token0address);
    const token1 = await getOrCreateTokenFn(prisma!, token1address);

    const block = await prisma!.block.findFirst({
      where: {
        number: blockNumber,
        chainId,
      },
    });

    return prisma!.aggregatedLiquidityByMarket.findFirst({
      orderBy: {
        toBlockNumber: "desc",
      },
      where: {
        token0ChainId: chainId,
        token0Address: token0.address,

        token1ChainId: chainId,
        token1Address: token1.address,

        toBlockNumber: block!.number,
        accountId: maker,
      },
    });
  };

  const blockHeaderToDbBlock = generateBlockHeaderToDbBlock(context);

  before(async () => {
    const result = await startDb();

    prisma = result.prisma;
    stop = result.stop;
    resetDb = result.resetDb;
  });

  beforeEach(async () => {
    await resetDb();
    await inititalizeChains(prisma!, [chain]);
  });

  it("get liquidity time series", async () => {
    const openOffers1: OpenOffer[] = [
      {
        id: "id1",
        wants: "100",
        gives: "200",
        maker: {
          address: account0.address,
        },

        market: {
          outbound_tkn: token0.address,
          inbound_tkn: token1.address,
        },
      },
      {
        id: "id2",
        wants: "200",
        gives: "400",
        maker: {
          address: account1.address,
        },

        market: {
          outbound_tkn: token0.address,
          inbound_tkn: token1.address,
        },
      },
      {
        id: "id3",
        wants: "300",
        gives: "400",
        maker: {
          address: account0.address,
        },

        market: {
          outbound_tkn: token1.address,
          inbound_tkn: token0.address,
        },
      },
      {
        id: "id4",
        wants: "400",
        gives: "600",
        maker: {
          address: account1.address,
        },

        market: {
          outbound_tkn: token1.address,
          inbound_tkn: token0.address,
        },
      },
    ];

    const openOffers2: OpenOffer[] = [
      {
        id: "id1",
        wants: "1000",
        gives: "2000",
        maker: {
          address: account0.address,
        },

        market: {
          outbound_tkn: token0.address,
          inbound_tkn: token1.address,
        },
      },
      {
        id: "id2",
        wants: "2000",
        gives: "4000",
        maker: {
          address: account1.address,
        },

        market: {
          outbound_tkn: token0.address,
          inbound_tkn: token1.address,
        },
      },
    ];

    const offers = {
      "2": openOffers1,
      "3": openOffers2,
    };

    const sdk = generateMockSdk(offers);

    const getAndSaveLiquidityTimeSeries = generateGetAndSaveLiquidityTimeSerie(
      context,
      getOrCreateTokenFn,
      sdk
    );

    await createBlockIfNotExist(prisma!, blockHeaderToDbBlock(blocks["1"]));

    await handleRange(
      context,
      prisma!,
      [getAndSaveLiquidityTimeSeries],
      blockHeaderToDbBlock(blocks["3"])
    );

    const liquidity1Account0Token0Token1 =
      await getLatestLiquidityWithPairAtBlock(
        2,
        token0.address,
        token1.address,
        account0.address
      );

    assert.deepEqual(liquidity1Account0Token0Token1, {
      fromBlockChainId: chainId,
      fromBlockNumber: 1,
      toBlockChainId: chainId,
      toBlockNumber: 2,
      token0ChainId: chainId,
      token0Address: token0.address,
      token1ChainId: chainId,
      token1Address: token1.address,
      amountToken0: "100",
      amountToken1: "200",
      accountId: account0.address,
    });

    const liquidity1Account0Token1Token0 =
      await getLatestLiquidityWithPairAtBlock(
        2,
        token1.address,
        token0.address,
        account0.address
      );

    assert.deepEqual(liquidity1Account0Token1Token0, {
      fromBlockChainId: chainId,
      fromBlockNumber: 1,
      toBlockChainId: chainId,
      toBlockNumber: 2,
      token0ChainId: chainId,
      token0Address: token1.address,
      token1ChainId: chainId,
      token1Address: token0.address,
      amountToken0: "300",
      amountToken1: "400",
      accountId: account0.address,
    });

    const liquidity1Account1Token0Token1 =
      await getLatestLiquidityWithPairAtBlock(
        2,
        token0.address,
        token1.address,
        account1.address
      );

    assert.deepEqual(liquidity1Account1Token0Token1, {
      fromBlockChainId: chainId,
      fromBlockNumber: 1,
      toBlockChainId: chainId,
      toBlockNumber: 2,
      token0ChainId: chainId,
      token0Address: token0.address,
      token1ChainId: chainId,
      token1Address: token1.address,
      amountToken0: "200",
      amountToken1: "400",
      accountId: account1.address,
    });

    const liquidity1Account1Token1Token0 =
      await getLatestLiquidityWithPairAtBlock(
        2,
        token1.address,
        token0.address,
        account1.address
      );

    assert.deepEqual(liquidity1Account1Token1Token0, {
      fromBlockChainId: chainId,
      fromBlockNumber: 1,
      toBlockChainId: chainId,
      toBlockNumber: 2,

      token0ChainId: chainId,
      token0Address: token1.address,

      token1ChainId: chainId,
      token1Address: token0.address,
      amountToken0: "400",
      amountToken1: "600",
      accountId: account1.address,
    });

    const liquidity1Account0Token0Token1_2 =
      await getLatestLiquidityWithPairAtBlock(
        3,
        token0.address,
        token1.address,
        account0.address
      );

    assert.deepEqual(liquidity1Account0Token0Token1_2, {
      fromBlockChainId: chainId,
      fromBlockNumber: 2,
      toBlockChainId: chainId,
      toBlockNumber: 3,
      token0ChainId: chainId,
      token0Address: token0.address,
      token1ChainId: chainId,
      token1Address: token1.address,
      amountToken0: "1000",
      amountToken1: "2000",
      accountId: account0.address,
    });

    const liquidity1Account1Token0Token1_2 =
      await getLatestLiquidityWithPairAtBlock(
        3,
        token0.address,
        token1.address,
        account1.address
      );

    assert.deepEqual(liquidity1Account1Token0Token1_2, {
      fromBlockChainId: chainId,
      fromBlockNumber: 2,
      toBlockChainId: chainId,
      toBlockNumber: 3,
      token0ChainId: chainId,
      token0Address: token0.address,
      token1ChainId: chainId,
      token1Address: token1.address,
      amountToken0: "2000",
      amountToken1: "4000",
      accountId: account1.address,
    });
  });

  after(async () => {
    await stop();
  });
});
