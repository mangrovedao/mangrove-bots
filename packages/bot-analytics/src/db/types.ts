import {
  Account,
  AccountActivity,
  AggregatedLiquidityByMarket,
  Block,
  PrismaClient,
  PrismaPromise,
  Token,
} from "@prisma/client";

export type BlockWithoutId = Omit<Block, "id">;

export type TokenWithoutId = Omit<Token, "id">;

export type AccountActivityWithoutId = Omit<AccountActivity, "id">;

export type AggregatedLiquidityWithoutId = Omit<
  AggregatedLiquidityByMarket,
  "id"
>;

export type AggregatedLiquidityWithoutIdAndValuesAsBigInt = Omit<
  AggregatedLiquidityWithoutId,
  "amountToken0" | "amountToken1"
> & {
  amountToken0: bigint;
  amountToken1: bigint;
};

export type GetOrCreateTokenFn = (
  prisma: PrismaTx,
  address: string
) => Promise<Token>;

export type PrismaTx = Omit<
  PrismaClient,
  "$on" | "$disconnect" | "$connect" | "$transaction" | "$use" | "$extends"
>;
