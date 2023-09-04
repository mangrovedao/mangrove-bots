import Big from "big.js";

export type TokenConfig = {
  name: string;
  balance: Big;
};

export type Context = {
  tokenForExchange: TokenConfig;
  holdingTokens: Record<string, TokenConfig>;
};
