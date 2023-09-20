import { Block as BlockHeader } from "@ethersproject/providers";
import { Account, PrismaClient } from "@prisma/client";
import { startDb } from "../helpers/start-db";

import {
  Chain,
  ChainContext,
  GetParamsVolumes,
  GetVolumeResults,
  GetVolumesResult,
} from "../../src/types";
import { PrismaTx, TokenWithoutId } from "../../src/db/types";
import { generateGetAndSaveVolumeTimeSerie } from "../../src/volume";
import { createBlockIfNotExist } from "../../src/db/block";
import { inititalizeChains } from "../../src/db/init";
import assert from "assert";
import { handleRange } from "../../src/analytics";
import { generateBlockHeaderToDbBlock } from "../../src/util/util";
import { Sdk } from "../../.graphclient";
import { binance } from "ccxt";
import { transformVolumeWithDecimalsToString } from "../helpers/utils";

describe("Volume tracking", () => {
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
    priceMocks: {},
  };

  const blockHeaderToDbBlock = generateBlockHeaderToDbBlock(context);

  const nowAsDate = new Date();
  const now = nowAsDate.getTime() / 1000;

  const account0 = {
    address: "account0",
    createdAt: now,
  };

  const account1 = {
    address: "account1",
    createdAt: now,
  };

  const token0 = {
    address: "token0",
    symbol: "tkn0",
    decimals: 18,
    chainId,
    createdAt: nowAsDate,
  };

  const token1: TokenWithoutId = {
    address: "token1",
    symbol: "tkn1",
    decimals: 18,
    chainId,
    createdAt: nowAsDate,
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

  const generateMockSdk = (results: Record<string, GetVolumesResult[]>) =>
    ({
      getVolumes: async (
        params: GetParamsVolumes
      ): Promise<GetVolumeResults> => {
        const _results = results[params.currentBlockNumber];
        return {
          accountVolumeByPairs: _results.slice(
            params.skip,
            params.skip === 0 ? params.first : params.first + params.skip
          ),
        };
      },
    } as Sdk);

  const getLatestActivityWithAddressAndType = async (
    address: string,
    asMaker: boolean
  ) => {
    return prisma!.accountActivity.findFirst({
      orderBy: {
        toBlockNumber: "desc",
      },
      where: {
        accountId: address,
        asMaker: asMaker,
      },
    });
  };

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

  it("test handle range function with skip", async () => {
    const volumes: GetVolumesResult[] = [
      {
        id: `${account0.address}-${token0.address}-${token1.address}-maker`,
        updatedDate: Date.now(),
        account: {
          address: account0.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "100",
        token0Received: "200",
        token1Sent: "300",
        token1Received: "400",
        asMaker: true,
      },
      {
        id: `${account0.address}-${token0.address}-${token1.address}-taker`,
        updatedDate: Date.now(),
        account: {
          address: account0.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "10",
        token0Received: "20",
        token1Sent: "30",
        token1Received: "40",
        asMaker: false,
      },
      {
        id: `${account1.address}-${token0.address}-${token1.address}-maker`,
        updatedDate: Date.now(),
        account: {
          address: account1.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "400",
        token0Received: "300",
        token1Sent: "200",
        token1Received: "100",
        asMaker: true,
      },
      {
        id: `${account1.address}-${token0.address}-${token1.address}-taker`,
        updatedDate: Date.now(),
        account: {
          address: account1.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "40",
        token0Received: "30",
        token1Sent: "20",
        token1Received: "10",
        asMaker: false,
      },
    ];

    const volumes2: GetVolumesResult[] = [
      {
        id: `${account0.address}-${token0.address}-${token1.address}-maker`,
        updatedDate: Date.now(),
        account: {
          address: account0.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "200",
        token0Received: "400",
        token1Sent: "600",
        token1Received: "800",
        asMaker: true,
      },
      {
        id: `${account0.address}-${token0.address}-${token1.address}-taker`,
        updatedDate: Date.now(),
        account: {
          address: account0.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "20",
        token0Received: "40",
        token1Sent: "60",
        token1Received: "80",
        asMaker: false,
      },
      {
        id: `${account1.address}-${token0.address}-${token1.address}-maker`,
        updatedDate: Date.now(),
        account: {
          address: account1.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "800",
        token0Received: "600",
        token1Sent: "400",
        token1Received: "200",
        asMaker: true,
      },
      {
        id: `${account1.address}-${token0.address}-${token1.address}-taker`,
        updatedDate: Date.now(),
        account: {
          address: account1.address,
          creationDate: now,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "80",
        token0Received: "60",
        token1Sent: "40",
        token1Received: "20",
        asMaker: false,
      },
    ];

    const sdk = generateMockSdk({
      "2": volumes,
      "3": volumes2,
    });

    const getAndSaveVolumeTimeSeries = generateGetAndSaveVolumeTimeSerie(
      context,
      getOrCreateTokenFn,
      sdk
    );

    await createBlockIfNotExist(prisma!, blockHeaderToDbBlock(blocks["1"]));
    await handleRange(
      context,
      prisma!,
      [getAndSaveVolumeTimeSeries],
      blockHeaderToDbBlock(blocks["3"])
    );

    const accountAcitivityAccount0Maker2 =
      await getLatestActivityWithAddressAndType(account0.address, true);

    assert.deepEqual(
      transformVolumeWithDecimalsToString(accountAcitivityAccount0Maker2),
      {
        fromBlockChainId: chainId,
        fromBlockNumber: 2,
        toBlockChainId: chainId,
        toBlockNumber: 3,
        token0ChainId: chainId,
        token0Address: token0.address,
        token1ChainId: chainId,
        token1Address: token1.address,
        sent0: "100",
        received0: "200",
        totalSent0: "200",
        totalReceived0: "400",
        sent1: "300",
        received1: "400",
        totalSent1: "600",
        totalReceived1: "800",
        chainId: 0,
        accountId: "account0",
        asMaker: true,
      }
    );
    const accountAcitivityAccount0Taker2 =
      await getLatestActivityWithAddressAndType(account0.address, false);

    assert.deepEqual(
      transformVolumeWithDecimalsToString(accountAcitivityAccount0Taker2),
      {
        fromBlockChainId: chainId,
        fromBlockNumber: 2,
        toBlockChainId: chainId,
        toBlockNumber: 3,
        token0ChainId: chainId,
        token0Address: token0.address,
        token1ChainId: chainId,
        token1Address: token1.address,
        sent0: "10",
        received0: "20",
        totalSent0: "20",
        totalReceived0: "40",
        sent1: "30",
        received1: "40",
        totalSent1: "60",
        totalReceived1: "80",
        chainId: 0,
        accountId: "account0",
        asMaker: false,
      }
    );

    const accountAcitivityAccount1Maker2 =
      await getLatestActivityWithAddressAndType(account1.address, true);

    assert.deepEqual(
      transformVolumeWithDecimalsToString(accountAcitivityAccount1Maker2),
      {
        fromBlockChainId: chainId,
        fromBlockNumber: 2,
        toBlockChainId: chainId,
        toBlockNumber: 3,
        token0ChainId: chainId,
        token0Address: token0.address,
        token1ChainId: chainId,
        token1Address: token1.address,
        sent0: "400",
        received0: "300",
        totalSent0: "800",
        totalReceived0: "600",
        sent1: "200",
        received1: "100",
        totalSent1: "400",
        totalReceived1: "200",
        chainId: 0,
        accountId: "account1",
        asMaker: true,
      }
    );

    const accountAcitivityAccount1Taker2 =
      await getLatestActivityWithAddressAndType(account1.address, false);

    assert.deepEqual(
      transformVolumeWithDecimalsToString(accountAcitivityAccount1Taker2),
      {
        fromBlockChainId: chainId,
        fromBlockNumber: 2,
        toBlockChainId: chainId,
        toBlockNumber: 3,
        token0ChainId: chainId,
        token0Address: token0.address,
        token1ChainId: chainId,
        token1Address: token1.address,
        sent0: "40",
        received0: "30",
        totalSent0: "80",
        totalReceived0: "60",
        sent1: "20",
        received1: "10",
        totalSent1: "40",
        totalReceived1: "20",
        chainId: 0,
        accountId: "account1",
        asMaker: false,
      }
    );
  });

  after(async () => {
    await stop();
  });
});
