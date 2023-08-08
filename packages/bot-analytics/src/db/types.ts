import {
  Account,
  AccountActivity,
  Block,
  PrismaClient,
  PrismaPromise,
  Token,
} from "@prisma/client";

export type BlockWithoutId = Omit<Block, "id">;

export type TokenWithoutId = Omit<Token, "id">;

export type AccountActivityWithoutId = Omit<AccountActivity, "id">;

export type getOrCreateTokenFn = (
  prisma: PrismaTx,
  address: string
) => Promise<Token>;

export type PrismaTx = Omit<
  PrismaClient,
  "$on" | "$disconnect" | "$connect" | "$transaction" | "$use" | "$extends"
>;
