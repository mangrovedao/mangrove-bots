export type TakerConfig = {
  sleepTimeMilliseconds: number;
  offerCountCap: number;
};

export type MarketConfig = {
  baseToken: string;
  baseTokenSymbolForPriceLookup?: string; // Allow use of another symbol when looking up a price an unlisted token (eg MATIC instead for WMATIC)
  quoteToken: string;
  quoteTokenSymbolForPriceLookup?: string; // Same as baseTokenSymbolForPriceLookup
  takerConfig: TakerConfig;
};
