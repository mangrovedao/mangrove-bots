import { logger } from "./util/logger";
import { Market, Semibook } from "@mangrovedao/mangrove.js";
import { Provider } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { LatestMarketActivity, TxUtils } from "@mangrovedao/bot-utils";
import { maxGasReq } from "./constants";
import Big from "big.js";
import { cleanUsingMinimalAmountOfFunds } from "./strategies";

type OfferCleaningEstimates = {
  bounty: BigNumber; // wei
  gas: BigNumber;
  gasPrice: BigNumber; // wei (for EIP-1559 this is base fee + priority fee per gas)
  totalCost: BigNumber; // wei
  netResult: BigNumber; // wei
};

/**
 * A cleaner class for a single Mangrove market which snipes offers that fail and collects the bounty.
 *
 * The following strategy is used:
 * - Offers are simulated using `callStatic`.
 * - Snipes with `takerGives = 0` are used for simplicity. Thus, offers that only fail for non-zero trades will not be cleaned. A more sophisticated implementation might use flashloans or similar to clean such offers.
 * - Profitability of cleaning is currently not taken into account, i.e. any failing offer will be cleaned even though the gas costs may outweigh the bounty. Some code for estimating profitability, however, is present and is expected to be completed at a later stage.
 */
export class MarketCleaner {
  #market: Market;
  #provider: Provider;
  #isCleaning: boolean;
  #txUtils: TxUtils;
  #latestMarketActivity: LatestMarketActivity;
  #allowedLostPercentage: number;
  #whitelistedDustCleaningMaker?: Set<string>;
  #takerToImpersonate?: string;

  /**
   * Constructs a cleaner for the given Mangrove market which will use the given provider for queries and transactions.
   * @param market The Mangrove market to clean.
   * @param provider The provider to use for queries and transactions.
   * @param latestMarketActivity An object to write the latest activity to. {@link Setup} makes this available through a JSON endpoint for easy monitoring.
   */
  constructor(
    market: Market,
    provider: Provider,
    latestMarketActivity: LatestMarketActivity,
    allowedLostPercentage: number,
    whitelistedDustCleaningMaker?: Set<string>,
    takerToImpersonate?: string
  ) {
    this.#market = market;
    this.#provider = provider;
    this.#latestMarketActivity = latestMarketActivity;
    this.#allowedLostPercentage = allowedLostPercentage;
    this.#whitelistedDustCleaningMaker = whitelistedDustCleaningMaker;
    this.#takerToImpersonate = takerToImpersonate;

    this.#isCleaning = false;
    this.#txUtils = new TxUtils(provider, logger);

    logger.info("Initialized market cleaner", {
      base: this.#market.base.id,
      quote: this.#market.quote.id,
      takerToImpersonate: takerToImpersonate
        ? takerToImpersonate
        : "no impersonation, the bot account will be used for cleaning",
      contextInfo: "init",
    });
  }

  /**
   * Clean the offer lists of the market.
   * @param contextInfo Context information that is included in logs.
   * @returns A promise that fulfills when all offers have been evaluated and all cleaning transactions have been mined.
   */
  public async clean(
    shouldOnlyCleanWhitelisted = false,
    contextInfo?: string
  ): Promise<void> {
    // TODO non-thread safe reentrancy lock - is this is an issue in JS?
    if (this.#isCleaning) {
      logger.debug("Already cleaning so ignoring request to clean", {
        base: this.#market.base.id,
        quote: this.#market.quote.id,
        contextInfo,
      });

      return;
    }

    // Wrap in a try-finally to ensure #isCleaning is reset to false
    try {
      this.#isCleaning = true;

      logger.info("Heartbeat - Cleaning market", {
        base: this.#market.base.id,
        quote: this.#market.quote.id,
        contextInfo,
      });
      this.#latestMarketActivity.latestBlock =
        this.#market.mgv.reliableProvider.blockManager.getLastBlock();
      this.#latestMarketActivity.lastActive = new Date().toISOString();

      if (!(await this.#market.isActive())) {
        logger.warn(`Market is closed so ignoring request to clean`, {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          contextInfo,
        });
        return;
      }

      // TODO I think this is not quite EIP-1559 terminology - should fix
      const gasPrice = await this.#estimateGasPrice(this.#provider);

      const { asks, bids } = this.#market.getBook();
      logger.info("Order book retrieved", {
        base: this.#market.base.id,
        quote: this.#market.quote.id,
        contextInfo,
        data: {
          asksCount: asks.size(),
          bidsCount: bids.size(),
        },
      });

      const asksCleaningPromise = this.#cleanSemibook(
        asks,
        "asks",
        gasPrice,
        shouldOnlyCleanWhitelisted,
        contextInfo
      );
      const bidsCleaningPromise = this.#cleanSemibook(
        bids,
        "bids",
        gasPrice,
        shouldOnlyCleanWhitelisted,
        contextInfo
      );
      await Promise.allSettled([asksCleaningPromise, bidsCleaningPromise]);
    } finally {
      this.#isCleaning = false;
    }
  }

  async #cleanSemibook(
    semibook: Semibook,
    ba: Market.BA,
    gasPrice: BigNumber,
    shouldOnlyCleanWhitelisted: boolean,
    contextInfo?: string
  ): Promise<PromiseSettledResult<void>[]> {
    const cleaningPromises: Promise<void>[] = [];
    for (const offer of semibook) {
      if (
        this.#whitelistedDustCleaningMaker &&
        this.#whitelistedDustCleaningMaker.has(offer.maker.toLowerCase())
      ) {
        const takerWants = cleanUsingMinimalAmountOfFunds(
          semibook.market.getOutboundInbound(ba).outbound_tkn,
          offer
        );

        cleaningPromises.push(
          this.#cleanOffer(offer, ba, gasPrice, takerWants, contextInfo) // takerWants: outboundTkn, takerGives: inboundTkn
        );
      } else {
        if (shouldOnlyCleanWhitelisted) {
          continue;
        }
        cleaningPromises.push(
          this.#cleanOffer(offer, ba, gasPrice, new Big(0), contextInfo)
        );
      }
    }
    return Promise.allSettled(cleaningPromises);
  }

  async #cleanOffer(
    offer: Market.Offer,
    ba: Market.BA,
    gasPrice: BigNumber,
    takerWants: Big,
    contextInfo?: string
  ): Promise<void> {
    const { willOfferFail, bounty } = await this.#willOfferFail(
      offer,
      ba,
      takerWants,
      contextInfo
    );

    if (!willOfferFail || bounty === undefined || bounty.eq(0)) {
      return;
    }

    const estimates = await this.#estimateCostsAndGains(
      offer,
      ba,
      bounty,
      gasPrice,
      takerWants
    );

    if (estimates.netResult.gt(0)) {
      logger.info("Identified offer that is profitable to clean", {
        base: this.#market.base.id,
        quote: this.#market.quote.id,
        takerToImpersonate: this.#takerToImpersonate,
        ba: ba,
        offer: offer,
        data: { estimates },
      });
      // TODO Do we have the liquidity to do the snipe?
      await this.#collectOffer(offer, ba, takerWants, contextInfo);
    } else {
      logger.debug("Offer is not profitable to clean", {
        base: this.#market.base.id,
        quote: this.#market.quote.id,
        takerToImpersonate: this.#takerToImpersonate,
        ba: ba,
        offer: offer,
        contextInfo,
        data: { estimates },
      });
    }
  }

  async #willOfferFail(
    offer: Market.Offer,
    ba: Market.BA,
    takerWants: Big,
    contextInfo?: string
  ): Promise<{ willOfferFail: boolean; bounty: BigNumber }> {
    const raw = await this.#market.getRawCleanParams({
      ba: ba,
      targets: this.#createCollectParams(offer, takerWants),
      taker: this.#takerToImpersonate,
    });

    return this.#market.mgv.contract.callStatic
      .cleanByImpersonation(raw.olKey, raw.targets, raw.taker)
      .then(async ({ successes, bounty }) => {
        logger.debug("Static collect of offer succeeded", {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          ba: ba,
          offer: offer,
          contextInfo,
          data: { successes, bounty },
        });
        return { willOfferFail: successes.gt(0), bounty };
      })
      .catch((e) => {
        logger.debug("Static collect of offer failed", {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          ba: ba,
          offer: offer,
          contextInfo,
          data: e,
        });
        return { willOfferFail: false, bounty: BigNumber.from(0) };
      });
  }

  async #collectOffer(
    offer: Market.Offer,
    ba: Market.BA,
    takerWants: Big,
    contextInfo?: string
  ): Promise<void> {
    logger.debug("Cleaning offer", {
      base: this.#market.base.id,
      quote: this.#market.quote.id,
      ba: ba,
      offer: offer,
      contextInfo,
    });
    const fees = await this.#txUtils.getFeeOverrides();
    let txOverrides = {};

    if (fees !== undefined) {
      txOverrides = {
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
        maxFeePerGas: fees.maxFeePerGas,
      };
      logger.debug(`Overriding fees with: `, {
        data: {
          txOverrides,
          maxPriorityFeePerGas_in_wei: fees.maxPriorityFeePerGas.toString(),
          maxFeePerGas_in_wei: fees.maxFeePerGas.toString(),
        },
      });
    }

    const raw = await this.#market.getRawCleanParams({
      ba: ba,
      targets: this.#createCollectParams(offer, takerWants),
      taker: this.#takerToImpersonate,
    });

    const gasEstimate =
      await this.#market.mgv.contract.estimateGas.cleanByImpersonation(
        raw.olKey,
        raw.targets,
        raw.taker
      );

    const gasEstimateWithBuffer = gasEstimate.mul(10);
    txOverrides = {
      ...txOverrides,
      gasLimit: gasEstimateWithBuffer,
    };

    return this.#market
      .clean(
        {
          ba: ba,
          targets: this.#createCollectParams(offer, takerWants),
          taker: this.#takerToImpersonate,
        },
        txOverrides
      )
      .then((result) => {
        logger.info("Successfully cleaned offer", {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          ba: ba,
          offerId: offer.id,
          contextInfo,
        });
        logger.debug("Details for cleaned offer", {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          ba: ba,
          offer: offer,
          contextInfo,
          data: { result },
        });
      })
      .catch((e) => {
        logger.warn("Cleaning of offer failed", {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          ba: ba,
          offerId: offer.id,
          contextInfo,
        });
        logger.debug("Details for failed cleaning", {
          base: this.#market.base.id,
          quote: this.#market.quote.id,
          ba: ba,
          offer: offer,
          contextInfo,
          data: e,
        });
      });
  }

  #createCollectParams(
    offer: Market.Offer,
    takerWants: Big
  ): Market.CleanParams["targets"] {
    return [
      {
        offerId: offer.id,
        takerWants: takerWants,
        tick: offer.tick,
        gasreq: maxGasReq,
      },
    ];
    // FIXME 2021-12-01: The below result may have been affected by wrong order of inbound/outbound tokens
    // FIXME The following are the result of different strategies per 2021-10-26:
    // WORKS:
    //   inbound_tkn.address,
    //   outbound_tkn.address,
    //   [[offer.id, 0, 0, maxGasReq]], // (offer id, taker wants, taker gives, gas requirement)
    //   false,
    //
    // WORKS:
    //   inbound_tkn.address,
    //   outbound_tkn.address,
    //   [[offer.id, 0, 0, maxGasReq]], // (offer id, taker wants, taker gives, gas requirement)
    //   true,
    //
    // WORKS: This works, though I think Adrien said the last argument should be `false` ?
    //   inbound_tkn.address,
    //   outbound_tkn.address,
    //   [[offer.id, 0, maxWantsOrGives, maxGasReq]], // (offer id, taker wants, taker gives, gas requirement)
    //   true,
    //
    // FAILS: This worked in week 41, but no longer - how come? This is the strategy Adrien recommended
    //   inbound_tkn.address,
    //   outbound_tkn.address,
    //   [[offer.id, 0, maxWantsOrGives, maxGasReq]], // (offer id, taker wants, taker gives, gas requirement)
    //   false,
    //
    // WEIRD: The following succeeds in the call to MgvCleaner, but does not remove the offer nor yield any bounty - why is that?
    //   inbound_tkn.address,
    //   outbound_tkn.address,
    //   [[offer.id, maxWantsOrGives, 0, maxGasReq]], // (offer id, taker wants, taker gives, gas requirement)
    //   false,
    //
    // WEIRD: The following succeeds in the call to MgvCleaner, but does not remove the offer nor yield any bounty - why is that?
    //   inbound_tkn.address,
    //   outbound_tkn.address,
    //   [[offer.id, maxWantsOrGives, 0, maxGasReq]], // (offer id, taker wants, taker gives, gas requirement)
    //   true,
  }

  async #estimateCostsAndGains(
    offer: Market.Offer,
    ba: Market.BA,
    bounty: BigNumber,
    gasPrice: BigNumber,
    takerWants: Big
  ): Promise<OfferCleaningEstimates> {
    const gas = await this.#estimateGas(offer, ba, takerWants);
    const totalCost = gas.mul(gasPrice).mul(1 - this.#allowedLostPercentage);
    const netResult = bounty.sub(totalCost);
    return {
      bounty,
      gas,
      gasPrice,
      totalCost,
      netResult,
    };
  }

  async #estimateGasPrice(provider: Provider): Promise<BigNumber> {
    // We use the simple pre EIP-1559 model of gas prices for estimation
    const gasPrice = await provider.getGasPrice();
    return gasPrice;
  }

  async #estimateGas(
    offer: Market.Offer,
    ba: Market.BA,
    takerWants: Big
  ): Promise<BigNumber> {
    const raw = await this.#market.getRawCleanParams({
      ba: ba,
      targets: this.#createCollectParams(offer, takerWants),
      taker: this.#takerToImpersonate,
    });
    const gasEstimate =
      await this.#market.mgv.contract.estimateGas.cleanByImpersonation(
        raw.olKey,
        raw.targets,
        raw.taker
      );
    return gasEstimate;
  }
}
