import { logger } from "./util/logger";
import { Market } from "@mangrovedao/mangrove.js";
import { MarketConfig, TakerConfig } from "./MarketConfig";
import { fetchJson } from "ethers/lib/utils";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";
import Big from "big.js";

// FIXME Move to mangrove.js
export type BA = "bids" | "asks";

/**
 * An offer taker for a single Mangrove market which takes offers
 * whenever their price is better than an external price signal.
 */
export class OfferTaker {
  #market: Market;
  #takerAddress: string;
  #takerConfig: TakerConfig;
  #cryptoCompareUrl: string;
  #scheduler: ToadScheduler;
  #job?: SimpleIntervalJob;

  /**
   * Constructs an offer taker for the given Mangrove market.
   * @param market The Mangrove market to take offers from.
   * @param takerAddress The address of the EOA used by this taker.
   * @param takerConfig The parameters to use for this market.
   */
  constructor(
    market: Market,
    marketConfig: MarketConfig,
    takerAddress: string,
    takerConfig: TakerConfig,
    scheduler: ToadScheduler
  ) {
    this.#market = market;
    this.#takerAddress = takerAddress;
    this.#takerConfig = takerConfig;
    this.#cryptoCompareUrl = `https://min-api.cryptocompare.com/data/price?fsym=${
      marketConfig.baseTokenSymbolForPriceLookup ?? this.#market.base.name
    }&tsyms=${
      marketConfig.quoteTokenSymbolForPriceLookup ?? this.#market.quote.name
    }`;
    this.#scheduler = scheduler;

    logger.info("Initalized offer taker", {
      contextInfo: "taker init",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      data: { takerConfig: takerConfig },
    });
  }

  /**
   * Start creating offers.
   */
  public start(): void {
    logger.info("Starting offer taker", {
      contextInfo: "taker start",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
    });
    if (this.#job) {
      this.#job.start();
      return;
    }

    const task = new AsyncTask(
      `offer taker task ${this.#market.base.name}-${this.#market.quote.name}`,
      async () => {
        await this.#tradeIfPricesAreBetterThanExternalSignal();
      },
      (err: Error) => {
        logger.error("encountered error during task", {
          contextInfo: "taker task",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          data: {
            reason: err,
          },
        });
        throw err;
      }
    );
    this.#job = new SimpleIntervalJob(
      {
        milliseconds: this.#takerConfig.sleepTimeMilliseconds,
        runImmediately: true,
      },
      task
    );
    this.#scheduler.addSimpleIntervalJob(this.#job);
  }

  /**
   * Stop creating offers.
   */
  public stop(): void {
    this.#job?.stop();
  }

  async #tradeIfPricesAreBetterThanExternalSignal(): Promise<void> {
    const block = this.#market.mgv.reliableProvider.blockManager.getLastBlock();
    const contextInfo = `block#=${block.number}`;

    // const baseTokenBalancePromise = this.#market.base.contract.balanceOf(
    //   this.#takerAddress
    // );
    // const quoteTokenBalancePromise = this.#market.quote.contract.balanceOf(
    //   this.#takerAddress
    // );
    const externalPrice = await this.#getExternalPrice(contextInfo);

    if (externalPrice === undefined) {
      logger.info(
        "Heartbeat - No external price found, so not buying anything at this time",
        {
          contextInfo,
          base: this.#market.base.name,
          quote: this.#market.quote.name,
        }
      );
      return;
    }

    // const baseTokenBalance = await baseTokenBalancePromise;
    // const quoteTokenBalance = await quoteTokenBalancePromise;

    // logger.debug("Token balances", {
    //   contextInfo: "taker",
    //   base: this.#market.base.name,
    //   quote: this.#market.quote.name,
    //   data: {
    //     baseTokenBalance: this.#market.base.fromUnits(baseTokenBalance),
    //     quoteTokenBalance: this.#market.quote.fromUnits(quoteTokenBalance),
    //   },
    // });

    const asksTradePromise =
      this.#tradeOnSemibookIfPricesAreBetterThanExternalSignal(
        "asks",
        externalPrice,
        contextInfo
      );
    const bidsTradePromise =
      this.#tradeOnSemibookIfPricesAreBetterThanExternalSignal(
        "bids",
        externalPrice,
        contextInfo
      );
    await asksTradePromise;
    await bidsTradePromise;
  }

  async #getExternalPrice(contextInfo: string): Promise<Big | undefined> {
    try {
      logger.debug("Fetching external price", {
        contextInfo,
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        data: {
          cryptoCompareUrl: this.#cryptoCompareUrl,
        },
      });

      const json = await fetchJson(this.#cryptoCompareUrl);
      if (json[this.#market.quote.name] !== undefined) {
        const externalPrice = new Big(json[this.#market.quote.name]);
        logger.debug("Received external price", {
          contextInfo,
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          data: {
            externalPrice: externalPrice,
            cryptoCompareUrl: this.#cryptoCompareUrl,
          },
        });
        return externalPrice;
      }

      logger.warn(
        `Response did not contain a ${this.#market.quote.name} field`,
        {
          contextInfo,
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          data: {
            cryptoCompareUrl: this.#cryptoCompareUrl,
            responseJson: json,
          },
        }
      );

      return;
    } catch (e) {
      logger.error(`Error encountered while fetching external price`, {
        contextInfo,
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        data: {
          reason: e,
          cryptoCompareUrl: this.#cryptoCompareUrl,
        },
      });
      // ethers.js seems to get stuck when this happens, so we rethrow the exception
      // to force the app to quit and allow the runtime to restart it
      throw e;
    }
  }

  async #tradeOnSemibookIfPricesAreBetterThanExternalSignal(
    ba: BA,
    externalPrice: Big,
    contextInfo: string
  ): Promise<void> {
    const semibook = this.#market.getSemibook(ba);

    // If there is no immediately better offer, then we do not have to query the list
    // TODO: check if there is a way to know all offers with a better price on the book without querying
    const offers = await semibook.requestOfferListPrefix({
      desiredPrice: externalPrice,
    });

    const [quoteSideOfOffers, buyOrSell]: ["wants" | "gives", "buy" | "sell"] =
      ba === "asks" ? ["wants", "buy"] : ["gives", "sell"];

    const offersWithBetterThanExternalPrice = offers.filter((o) =>
      this.#market.trade.isPriceBetter(o.price, externalPrice, ba)
    );
    if (offersWithBetterThanExternalPrice.length <= 0) {
      const block =
        this.#market.mgv.reliableProvider.blockManager.getLastBlock();
      logger.info("Heartbeat - No offer better than external price", {
        contextInfo,
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        ba,
        data: {
          bestFetchedPrice: offers[0]?.price,
          externalPrice: externalPrice,
          blockNumber: block.number,
          blockHash: block.hash,
        },
      });
      return;
    }

    const total = offersWithBetterThanExternalPrice
      .slice(0, this.#takerConfig.offerCountCap - 1)
      .reduce(
        (v, o) =>
          v.add(
            quoteSideOfOffers === "gives"
              ? o.gives
              : Market.getWantsForPrice(ba, o.gives, o.price)
          ),
        Big(0)
      );

    logger.info(`Heartbeat - Posting ${buyOrSell} market order`, {
      contextInfo,
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      ba,
      data: {
        total: total.toString(),
        price: externalPrice.toString(),
        numberOfAsksWithBetterPrice: offersWithBetterThanExternalPrice.length,
        offerCountCap: this.#takerConfig.offerCountCap,
      },
    });
    try {
      const tradeParams = { total: total, price: externalPrice };
      const gasLowerBound = await this.#market.trade.estimateGas(
        buyOrSell,
        tradeParams,
        this.#market
      );
      const buyOrSellPromise = await this.#market[buyOrSell](
        { ...tradeParams, gasLowerBound },
        {}
      );
      const result = await buyOrSellPromise.result;
      logger.info(`Successfully completed ${buyOrSell} order`, {
        contextInfo,
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        ba,
        data: {
          total: total.toString(),
          price: externalPrice.toString(),
          numberOfAsksWithBetterPrice: offersWithBetterThanExternalPrice.length,
          buyResult:
            "fillWants" in result.summary
              ? {
                  gave: result.summary.totalGave?.toString(),
                  got: result.summary.totalGot?.toString(),
                  partialFill: result.summary.partialFill,
                  penalty: result.summary.bounty?.toString(),
                }
              : {
                  bounty: result.summary.bounty?.toString(),
                  isClean: true,
                },
        },
      });
    } catch (e) {
      logger.error(`Error occurred while ${buyOrSell}ing`, {
        contextInfo,
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        ba,
        data: {
          reason: e,
        },
      });
      // ethers.js seems to get stuck when this happens, so we rethrow the exception
      // to force the app to quit and allow the runtime to restart it
      throw e;
    }
  }
}
