import { logger } from "./util/logger";
import { Market } from "@mangrovedao/mangrove.js";
import { BigNumberish } from "ethers";
import random from "random";
import Big from "big.js";
import { MakerConfig } from "./MarketConfig";
import { fetchJson } from "ethers/lib/utils";
import { clearTimeout, setTimeout } from "timers";

/**
 * An offer maker for a single Mangrove market which posts offers
 * at times following a Poisson distribution.
 *
 * The offers are posted from an EOA and so must be fully provisioned.
 */
export class OfferMaker {
  #market: Market;
  #makerAddress: string;
  #bidProbability: number;
  #lambda: Big;
  #maxQuantity: number;
  #maxTotalLiquidityPublished: number;
  #offerRate: number;
  #offerTimeRng: () => number;
  #timeout?: NodeJS.Timeout;

  /**
   * Constructs an offer maker for the given Mangrove market.
   * @param market The Mangrove market to post offers on.
   * @param makerAddress The address of the EOA used by this maker.
   * @param makerConfig The parameters to use for this market.
   */
  constructor(market: Market, makerAddress: string, makerConfig: MakerConfig) {
    this.#market = market;
    this.#makerAddress = makerAddress;
    this.#bidProbability = makerConfig.bidProbability;
    this.#lambda = Big(makerConfig.lambda);
    this.#maxQuantity = makerConfig.maxQuantity;
    this.#maxTotalLiquidityPublished = makerConfig.maxTotalLiquidityPublished;

    this.#offerRate = makerConfig.offerRate / 1_000; // Converting the rate to mean # of offers per millisecond
    this.#offerTimeRng = random.uniform(0, 1);

    logger.info("Initalized offer maker", {
      contextInfo: "maker init",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      data: { makerConfig: makerConfig },
    });
  }

  /**
   * Start creating offers.
   */
  public async start(): Promise<void> {
    const balanceBasePromise = this.#market.base.contract.balanceOf(
      this.#makerAddress
    );
    const balanceQuotePromise = this.#market.quote.contract.balanceOf(
      this.#makerAddress
    );
    const marketConfigPromise = this.#market.config();
    logger.info("Starting offer maker", {
      contextInfo: "maker start",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      data: {
        balanceBase: await balanceBasePromise,
        balanceQuote: await balanceQuotePromise,
        marketConfig: await marketConfigPromise,
      },
    });
    this.#run();
  }

  async #run(): Promise<void> {
    // Only post offers after a timeout, ie not on the first invocation
    if (this.#timeout !== undefined) {
      await this.#postNewOfferOnBidsOrAsks();
    }

    const delayInMilliseconds = this.#getNextTimeDelay();
    logger.debug(`Sleeping for ${delayInMilliseconds}ms`, {
      contextInfo: "maker",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      data: { delayInMilliseconds },
    });
    this.#timeout = setTimeout(this.#run.bind(this), delayInMilliseconds);
  }

  #getNextTimeDelay(): number {
    return -Math.log(1 - this.#offerTimeRng()) / this.#offerRate;
  }

  /**
   * Stop creating offers.
   */
  public stop(): void {
    if (this.#timeout !== undefined) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
  }

  async #postNewOfferOnBidsOrAsks(): Promise<void> {
    let ba: Market.BA;
    let offerList: Market.Offer[];
    const book = this.#market.getBook();
    if (random.float(0, 1) < this.#bidProbability) {
      ba = "bids";
      offerList = [...book.bids];
    } else {
      ba = "asks";
      offerList = [...book.asks];
    }

    const referencePrice = await this.#getReferencePrice(ba, offerList);
    if (referencePrice === undefined) {
      logger.warn(
        `Unable to determine reference price, so not posthing an offer`,
        {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
        }
      );
      return;
    }

    await this.#retractWorstOfferIfTotalLiquidityPublishedExceedsMax(
      ba,
      offerList
    );

    const price = this.#choosePrice(ba, referencePrice, this.#lambda);
    const quantity = Big(random.float(1, this.#maxQuantity));
    await this.#postOffer(ba, quantity, price, referencePrice);
  }

  async #getReferencePrice(
    ba: Market.BA,
    offerList: Market.Offer[]
  ): Promise<Big | undefined> {
    let bestOffer: Market.Offer | undefined = undefined;
    if (offerList.length > 0) {
      bestOffer = offerList[0];
      logger.debug("Best offer on book", {
        contextInfo: "maker",
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        ba: ba,
        data: { bestOffer: bestOffer },
      });

      return bestOffer.price;
    }

    const cryptoCompareUrl = `https://min-api.cryptocompare.com/data/price?fsym=${
      this.#market.base.name
    }&tsyms=${this.#market.quote.name}`;
    try {
      logger.debug("Getting external price reference", {
        contextInfo: "maker",
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        ba: ba,
        data: {
          cryptoCompareUrl,
        },
      });
      const json = await fetchJson(cryptoCompareUrl);
      if (json[this.#market.quote.name] !== undefined) {
        const referencePrice = new Big(json[this.#market.quote.name]);
        logger.info("Using external price reference as order book is empty", {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: {
            referencePrice,
            cryptoCompareUrl,
          },
        });
        return referencePrice;
      }

      logger.warn(
        `Response did not contain a ${this.#market.quote.name} field`,
        {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: { cryptoCompareUrl, responseJson: json },
        }
      );

      return;
    } catch (e) {
      logger.error(`Error encountered while fetching external price`, {
        contextInfo: "maker",
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        ba: ba,
        data: {
          reason: e,
          cryptoCompareUrl,
        },
      });
      return;
    }
  }

  async #retractWorstOfferIfTotalLiquidityPublishedExceedsMax(
    ba: Market.BA,
    offerList: Market.Offer[]
  ): Promise<void> {
    if (offerList.length === 0) return;

    const [totalLiquidityPublished, myWorstOffer] = offerList
      .filter((o) => o.maker === this.#makerAddress)
      .reduce<[Big, Market.Offer]>(
        ([t], o) => [Market.getWantsForPrice(ba, o.gives, o.price), o],
        [Big(0), offerList[0]]
      );

    if (totalLiquidityPublished.gt(this.#maxTotalLiquidityPublished)) {
      logger.debug(
        "Total liquidity published exceeds max, retracting worst offer",
        {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: {
            totalLiquidityPublished,
            maxTotalLiquidityPublished: this.#maxTotalLiquidityPublished,
            myWorstOffer,
          },
        }
      );
      // FIXME: Retract should be implemented in market.ts
      const { outbound_tkn, inbound_tkn } = this.#market.getOutboundInbound(ba);
      const olKey = {
        outbound_tkn: outbound_tkn.address,
        inbound_tkn: inbound_tkn.address,
        tickSpacing: this.#market.tickSpacing,
      };
      await this.#market.mgv.contract
        .retractOffer(olKey, myWorstOffer.id, false)
        .then((tx) => tx.wait())
        .then((txReceipt) => {
          logger.info("Succesfully retracted offer", {
            contextInfo: "maker",
            base: this.#market.base.name,
            quote: this.#market.quote.name,
            tickSpacing: this.#market.tickSpacing,
            ba: ba,
            data: {
              myWorstOffer,
            },
          });
          logger.debug("Details for retraction", {
            contextInfo: "maker",
            data: { txReceipt },
          });
        })
        .catch((e) =>
          logger.error("Error occurred while retracting offer", {
            contextInfo: "maker",
            base: this.#market.base.name,
            quote: this.#market.quote.name,
            tickSpacing: this.#market.tickSpacing,
            ba: ba,
            data: {
              reason: e,
              myWorstOffer,
            },
          })
        );
    }
  }

  #choosePrice(ba: Market.BA, referencePrice: Big, lambda: Big): Big {
    const u = random.float(0, 1) - 0.5;
    const plug = lambda.mul(u);

    const price =
      ba === "bids" ? referencePrice.minus(plug) : referencePrice.plus(plug);

    return price.gt(0) ? price : referencePrice;
  }

  async #postOffer(
    ba: Market.BA,
    quantity: Big,
    price: Big,
    referencePrice: Big,
    gasReq: BigNumberish = 100_000,
    gasPrice: BigNumberish = 1
  ): Promise<void> {
    const { outbound_tkn, inbound_tkn } = this.#market.getOutboundInbound(ba);
    const priceInUnits = inbound_tkn.toUnits(price);
    const quantityInUnits = outbound_tkn.toUnits(quantity);

    const { gives, wants } = Market.getGivesWantsForVolumeAtPrice(
      ba,
      quantity,
      price
    );
    const givesInUnits = outbound_tkn.toUnits(gives);
    const wantsInUnits = inbound_tkn.toUnits(wants);

    const baseTokenBalancePromise = this.#market.base.contract.balanceOf(
      this.#makerAddress
    );
    const quoteTokenBalancePromise = this.#market.quote.contract.balanceOf(
      this.#makerAddress
    );
    const baseTokenBalance = await baseTokenBalancePromise;
    const quoteTokenBalance = await quoteTokenBalancePromise;

    logger.debug("Posting offer", {
      contextInfo: "maker",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      ba: ba,
      data: {
        quantity,
        quantityInUnits: quantityInUnits.toString(),
        price,
        priceInUnits: priceInUnits.toString(),
        gives,
        givesInUnits: givesInUnits.toString(),
        wants,
        wantsInUnits: wantsInUnits.toString(),
        gasReq,
        gasPrice,
        baseTokenBalance: this.#market.base.fromUnits(baseTokenBalance),
        quoteTokenBalance: this.#market.quote.fromUnits(quoteTokenBalance),
      },
    });

    await this.#market.mgv.contract
      .newOfferByVolume(
        {
          outbound_tkn: outbound_tkn.address,
          inbound_tkn: inbound_tkn.address,
          tickSpacing: this.#market.tickSpacing,
        },
        wantsInUnits,
        givesInUnits,
        gasReq,
        gasPrice
      )
      .then((tx) => tx.wait())
      .then((txReceipt) => {
        // FIXME We should include the offer ID. mangrove.js Maker.ts will have a function for posting offers that returns the ID, so we should use that once available
        logger.info("Successfully posted offer", {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: {
            quantity,
            quantityInUnits: quantityInUnits.toString(),
            price,
            priceInUnits: priceInUnits.toString(),
            gives,
            givesInUnits: givesInUnits.toString(),
            wants,
            wantsInUnits: wantsInUnits.toString(),
            gasReq,
            gasPrice,
            referencePrice: referencePrice.toString(),
          },
        });
        logger.debug("Details for posted offer", {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: { txReceipt },
        });
      })
      .catch((e) => {
        logger.error("Post of offer failed", {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: {
            reason: e,
            quantity,
            quantityInUnits: quantityInUnits.toString(),
            price,
            priceInUnits: priceInUnits.toString(),
            gives,
            givesInUnits: givesInUnits.toString(),
            wants,
            wantsInUnits: wantsInUnits.toString(),
            gasReq,
            gasPrice,
          },
        });
        // ethers.js seems to get stuck when this happens, so we rethrow the exception
        // to force the app to quit and allow the runtime to restart it
        throw e;
      });
  }
}
