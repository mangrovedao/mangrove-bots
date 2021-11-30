import { logger } from "./util/logger";
import { sleep } from "@giry/commonlib-js";
import { Market } from "@giry/mangrove-js/dist/nodejs/market";
import { Offer } from "@giry/mangrove-js/dist/nodejs/types";
import { MgvToken } from "@giry/mangrove-js/dist/nodejs/mgvtoken";
import { Provider } from "@ethersproject/providers";
import { BigNumberish } from "ethers";
import random from "random";
import Big from "big.js";
import { MakerConfig } from "./MarketConfig";
Big.DP = 20; // precision when dividing
Big.RM = Big.roundHalfUp; // round to nearest

// FIXME Move to mangrove.js
export type BA = "bids" | "asks";

/**
 * An offer maker for a single Mangrove market which posts offers
 * at times following a Poisson distribution.
 *
 * The offers are posted from an EOA and so must be fully provisioned.
 */
export class OfferMaker {
  #market: Market;
  #provider: Provider;
  #bidProbability: number;
  #lambda: Big;
  #maxQuantity: number;
  #running: boolean;
  #offerRate: number;
  #offerTimeRng: () => number;

  /**
   * Constructs an offer maker for the given Mangrove market which will use the given provider for queries and transactions.
   * @param market The Mangrove market to post offers on.
   * @param provider The provider to use for queries and transactions.
   * @param makerConfig The parameters to use for this market.
   */
  constructor(market: Market, provider: Provider, makerConfig: MakerConfig) {
    this.#market = market;
    this.#provider = provider;
    this.#bidProbability = makerConfig.bidProbability;
    this.#lambda = Big(makerConfig.lambda);
    this.#maxQuantity = makerConfig.maxQuantity;

    this.#running = false;

    this.#offerRate = makerConfig.offerRate / 1_000; // Converting the rate to mean # of offers per millisecond
    this.#offerTimeRng = random.uniform(0, 1);

    logger.info("Initalized offer maker", {
      contextInfo: "maker init",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      data: { marketConfig: makerConfig },
    });
  }

  /**
   * Start creating offers.
   */
  public async start(): Promise<void> {
    this.#running = true;
    while (this.#running === true) {
      const delayInMilliseconds = this.#getNextTimeDelay();
      logger.debug(`Sleeping for ${delayInMilliseconds}ms`, {
        contextInfo: "maker",
        base: this.#market.base.name,
        quote: this.#market.quote.name,
        data: { delayInMilliseconds },
      });
      await sleep(delayInMilliseconds);
      await this.#postNewOfferOnBidsOrAsks();
    }
  }

  #getNextTimeDelay(): number {
    return -Math.log(1 - this.#offerTimeRng()) / this.#offerRate;
  }

  /**
   * Stop creating offers.
   */
  public stop(): void {
    this.#running = false;
  }

  async #postNewOfferOnBidsOrAsks(): Promise<void> {
    let ba: BA;
    let offerList: Offer[];
    const book = this.#market.book();
    if (random.float(0, 1) < this.#bidProbability) {
      ba = "bids";
      offerList = book.bids;
    } else {
      ba = "asks";
      offerList = book.asks;
    }
    if (offerList.length === 0) {
      // FIXME this means no activity is generated if there are no offers already on the book
      logger.warn(
        "Offer list is empty so will not generate an offer as no reference price is available",
        {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
        }
      );
      return;
    }
    const price = this.#choosePriceFromExp(
      ba,
      offerList[0].price,
      this.#lambda
    );
    const quantity = Big(random.float(1, this.#maxQuantity));
    await this.#postOffer(ba, quantity, price);
  }

  #choosePriceFromExp(ba: BA, insidePrice: Big, lambda: Big): Big {
    const plug = lambda.mul(random.float(0, 1));

    const price =
      ba === "bids" ? insidePrice.minus(plug) : insidePrice.plus(plug);

    return price.gt(0) ? price : insidePrice;
  }

  async #postOffer(
    ba: BA,
    quantity: Big,
    price: Big,
    gasReq: BigNumberish = 100_000,
    gasPrice: BigNumberish = 1
  ): Promise<void> {
    const { inboundToken, outboundToken } = this.#getTokens(ba);
    const priceInUnits = inboundToken.toUnits(price);
    const quantityInUnits = outboundToken.toUnits(quantity);

    logger.debug("Posting offer", {
      contextInfo: "maker",
      base: this.#market.base.name,
      quote: this.#market.quote.name,
      ba: ba,
      data: {
        quantity,
        quantityInUnits,
        price,
        priceInUnits,
        gasReq,
        gasPrice,
      },
    });

    await this.#market.mgv.contract
      .newOffer(
        inboundToken.address,
        outboundToken.address,
        priceInUnits,
        quantityInUnits,
        gasReq,
        gasPrice,
        0
      )
      .then((tx) => tx.wait())
      .then((txReceipt) => {
        // FIXME how do we get the offer ID?
        logger.info("Successfully posted offer", {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: {
            quantity,
            quantityInUnits,
            price,
            priceInUnits,
            gasReq,
            gasPrice,
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
        logger.warn("Post of offer failed", {
          contextInfo: "maker",
          base: this.#market.base.name,
          quote: this.#market.quote.name,
          ba: ba,
          data: {
            reason: e,
            quantity,
            quantityInUnits,
            price,
            priceInUnits,
            gasReq,
            gasPrice,
          },
        });
      });
  }

  // FIXME move/integrate into Market API?
  #getTokens(ba: BA): {
    inboundToken: MgvToken;
    outboundToken: MgvToken;
  } {
    return {
      inboundToken: ba === "asks" ? this.#market.base : this.#market.quote,
      outboundToken: ba === "asks" ? this.#market.quote : this.#market.base,
    };
  }
}
