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

describe("Volume tracking", () => {
  let prisma: PrismaClient | undefined;
  let stop: () => Promise<void> | undefined;

  const chainId = 0;

  const chain: Chain = {
    name: "test",
    chainId,
  };

  const context: ChainContext = {
    ...chain,
    blockFinality: 0,
    provider: {} as any,
    multicall2: {} as any,
  };

  const account0: Account = {
    address: "token0",
  };

  const account1: Account = {
    address: "token0",
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

  const generateMockSdk = (results: GetVolumesResult[]) => ({
    getVolumes: async (params: GetParamsVolumes): Promise<GetVolumeResults> => {
      return {
        accountVolumeByPairs: results.slice(params.skip, params.first),
      };
    },
  });

  before(async () => {
    const result = await startDb();

    prisma = result.prisma;
    stop = result.stop;

    await inititalizeChains(prisma, [chain]);
  });

  it("get volumes series without needed to skip", async () => {
    const volumes: GetVolumesResult[] = [
      {
        id: `${account0.address}-${token0.address}-${token1.address}`,
        updatedDate: Date.now(),
        account: {
          id: account0.address,
          address: account0.address,
        },
        token0: token0.address,
        token1: token1.address,
        token0Sent: "100",
        token0Received: "200",
        token1Sent: "300",
        token1Received: "400",
        asMaker: true,
      },
    ];
    const sdk = generateMockSdk(volumes);

    const getAndSaveVolumeTimeSeries = generateGetAndSaveVolumeTimeSerie(
      context,
      getOrCreateTokenFn,
      sdk
    );

    await prisma!.$transaction(async (tx) => {
      const from = await createBlockIfNotExist(tx, {
        number: 1,
        hash: "0x1",
        timestamp: new Date(),
        chainId,
      });

      const to = await createBlockIfNotExist(tx, {
        number: 2,
        hash: "0x2",
        timestamp: new Date(from.timestamp.getTime() + 1000),
        chainId,
      });
      await getAndSaveVolumeTimeSeries(tx, from, to);
    });

    const accountAcitivity = await prisma!.accountActivity.findFirst();

    assert.deepEqual(accountAcitivity, {
      id: 1,
      fromBlockId: 1,
      toBlockId: 2,
      token0Id: 1,
      token1Id: 2,
      sent0: "100",
      received0: "200",
      totalSent0: "100",
      totalReceived0: "200",
      sent1: "300",
      received1: "400",
      totalSent1: "300",
      totalReceived1: "400",
      chainId: 0,
      accountId: "token0",
      asMaker: true,
    });
  });

  after(async () => {
    await stop();
  });
});
