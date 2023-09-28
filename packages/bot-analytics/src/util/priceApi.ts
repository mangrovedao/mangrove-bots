import { binance, Market } from "ccxt";
import logger from "../util/logger";
import moize from "moize";

export const getPrice = moize(
  async (exchange: binance, pair: string, timeframe: string, since: Date) => {
    // Fetch historical klines (candlestick data) between the specified dates
    const klines = await exchange.fetchOHLCV(
      pair,
      timeframe,
      since.getTime(),
      1
    );
    if (!klines || klines.length === 0) {
      throw new Error(
        `Missing price ${pair} ${since} with timeframe ${timeframe}`
      );
    }

    const [timestamp, open, high, low, close, volume] = klines[0];

    return {
      open,
      high,
      low,
      close,
      volume,
    };
  }
);

const unwrapToken = (symbol: string) => {
  switch (symbol) {
    case "WETH":
      return "ETH";
    case "WMATIC":
      return "MATIC";
    case "WBTC":
      return "BTC";
  }
  return symbol;
};

export const generateGetPairTokenToUSD = async (exchange: binance) => {
  const pairs = await exchange.loadMarkets();
  const fn = (symbol: string): Market | undefined => {
    symbol = symbol.toUpperCase();
    symbol = unwrapToken(symbol);

    let pair = pairs[`${symbol}/USD`];
    if (!pair) {
      pair = pairs[`USD/${symbol}`];
    }

    if (!pair) {
      pair = pairs[`${symbol}/USDT`];
    }

    if (!pair) {
      pair = pairs[`USDT/${symbol}`];
    }

    if (!pair) {
      logger.warn(`Missing pair against USD with symbol: ${symbol}`);
    }

    return pair;
  };

  return moize.infinite(fn);
};