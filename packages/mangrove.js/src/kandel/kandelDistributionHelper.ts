import Big from "big.js";
import Market from "../market";
import KandelDistribution from "./kandelDistribution";
import { Bigish } from "../types";

/** Offers with their price, Kandel index, and gives amount.
 * @param offerType Whether the offer is a bid or an ask.
 * @param price The price of the offer.
 * @param index The index of the price point in Kandel.
 * @param gives The amount of base or quote that the offer gives.
 */
export type OffersWithGives = {
  offerType: Market.BA;
  price: Bigish;
  index: number;
  gives: Bigish;
}[];

/** @title Helper for handling Kandel offer distributions. */
class KandelDistributionHelper {
  baseDecimals: number;
  quoteDecimals: number;

  /** Constructor
   * @param baseDecimals The number of decimals for the base token.
   * @param quoteDecimals The number of decimals for the quote token.
   */
  public constructor(baseDecimals: number, quoteDecimals: number) {
    this.baseDecimals = baseDecimals;
    this.quoteDecimals = quoteDecimals;
  }

  /** Sorts an array in-place according to an index property in ascending order.
   * @param list The list to sort.
   * @returns The sorted list.
   */
  public sortByIndex(list: { index: number }[]) {
    return list.sort((a, b) => a.index - b.index);
  }

  /** Rounds a base amount according to the token's decimals.
   * @param base The base amount to round.
   * @returns The rounded base amount.
   */
  public roundBase(base: Big) {
    return base.round(this.baseDecimals, Big.roundHalfUp);
  }

  /** Rounds a quote amount according to the token's decimals.
   * @param quote The quote amount to round.
   * @returns The rounded quote amount.
   */
  public roundQuote(quote: Big) {
    return quote.round(this.quoteDecimals, Big.roundHalfUp);
  }

  /** Calculates a rounded quote amount given a base amount and a price.
   * @param base The base amount.
   * @param price The price.
   * @returns The quote amount.
   */
  public quoteFromBaseAndPrice(base: Big, price: Big) {
    return this.roundQuote(base.mul(price));
  }

  /** Calculates a rounded base amount given a quote amount and a price.
   * @param quote The quote amount.
   * @param price The price.
   * @returns The base amount.
   */
  public baseFromQuoteAndPrice(quote: Big, price: Big) {
    return this.roundBase(quote.div(price));
  }

  /** Calculates distribution of bids and asks with constant gives and a matching wants given the price distribution.
   * @param ratio The ratio used when calculating the price distribution.
   * @param prices The price distribution.
   * @param askGives The constant gives for asks.
   * @param bidGives The constant gives for bids.
   * @param firstAskIndex The index of the first ask in the distribution.
   * @returns The distribution of bids and asks and their base and quote.
   */
  public calculateDistributionConstantGives(
    ratio: Big,
    prices: Big[],
    askGives: Big,
    bidGives: Big,
    firstAskIndex: number
  ): KandelDistribution {
    const offers = prices.map((p, index) =>
      this.getBA(index, firstAskIndex) == "bids"
        ? {
            index,
            base: this.baseFromQuoteAndPrice(bidGives, p),
            quote: bidGives,
            offerType: "bids" as Market.BA,
          }
        : {
            index,
            base: askGives,
            quote: this.quoteFromBaseAndPrice(askGives, p),
            offerType: "asks" as Market.BA,
          }
    );

    return new KandelDistribution(
      ratio,
      offers.length,
      offers,
      this.baseDecimals,
      this.quoteDecimals
    );
  }

  /** Calculates distribution of bids and asks with constant base and a matching quote given the price distribution.
   * @param ratio The ratio used when calculating the price distribution.
   * @param prices The price distribution.
   * @param constantBase The constant base for the distribution.
   * @param firstAskIndex The index of the first ask in the distribution.
   * @returns The distribution of bids and asks and their base and quote.
   */
  public calculateDistributionConstantBase(
    ratio: Big,
    prices: Big[],
    constantBase: Big,
    firstAskIndex: number
  ): KandelDistribution {
    const base = this.roundBase(constantBase);
    const offers = prices.map((p, index) => ({
      index,
      base: base,
      quote: this.quoteFromBaseAndPrice(base, p),
      offerType: this.getBA(index, firstAskIndex),
    }));
    return new KandelDistribution(
      ratio,
      offers.length,
      offers,
      this.baseDecimals,
      this.quoteDecimals
    );
  }

  /** Calculates distribution of bids and asks with constant quote and a matching base given the price distribution.
   * @param ratio The ratio used when calculating the price distribution.
   * @param prices The price distribution.
   * @param constantQuote The constant quote for the distribution.
   * @param firstAskIndex The index of the first ask in the distribution.
   * @returns The distribution of bids and asks and their base and quote.
   */
  public calculateDistributionConstantQuote(
    ratio: Big,
    prices: Big[],
    constantQuote: Big,
    firstAskIndex: number
  ): KandelDistribution {
    const quote = this.roundQuote(constantQuote);
    const offers = prices.map((p, index) => ({
      index,
      base: this.baseFromQuoteAndPrice(quote, p),
      quote: quote,
      offerType: this.getBA(index, firstAskIndex),
    }));
    return new KandelDistribution(
      ratio,
      offers.length,
      offers,
      this.baseDecimals,
      this.quoteDecimals
    );
  }

  /** Calculates distribution of bids and asks and their base and quote amounts to match the price distribution.
   * @param ratio The ratio used when calculating the price distribution.
   * @param prices The price distribution.
   * @param firstAskIndex The index of the first ask in the distribution.
   * @param initialAskGives The initial amount of base to give for all asks. Should be at least minimumBasePerOfferFactor from KandelConfiguration multiplied with the minimum volume for the market. If not provided, then initialBidGives is used as quote for asks, and the base the ask gives is set to according to the price.
   * @param initialBidGives The initial amount of quote to give for all bids. Should be at least minimumQuotePerOfferFactor from KandelConfiguration multiplied with the minimum volume for the market. If not provided, then initialAskGives is used as base for bids, and the quote the bid gives is set to according to the price.
   * @returns The distribution of bids and asks and their base and quote.
   */
  public calculateDistributionFromPrices(
    ratio: Big,
    prices: Big[],
    firstAskIndex: number,
    initialAskGives?: Big,
    initialBidGives?: Big
  ) {
    if (!initialBidGives && !initialAskGives)
      throw Error(
        "Either initialAskGives or initialBidGives must be provided."
      );

    const distribution =
      initialBidGives && initialAskGives
        ? this.calculateDistributionConstantGives(
            ratio,
            prices,
            initialAskGives,
            initialBidGives,
            firstAskIndex
          )
        : initialAskGives
        ? this.calculateDistributionConstantBase(
            ratio,
            prices,
            initialAskGives,
            firstAskIndex
          )
        : this.calculateDistributionConstantQuote(
            ratio,
            prices,
            initialBidGives,
            firstAskIndex
          );
    return distribution;
  }

  /** Creates a new distribution with uniformly changed volume.
   * @param params The parameters for the change.
   * @param params.distribution The distribution to change.
   * @param params.baseDelta The change in base volume.
   * @param params.quoteDelta The change in quote volume.
   * @param params.minimumBasePerOffer The minimum base per offer. Only applies for decrease in base volume.
   * @param params.minimumQuotePerOffer The minimum quote per offer. Only applies for decrease in quote volume.
   * @returns The new distribution.
   * @remarks The decrease has to respect minimums, and thus may decrease some offers more than others.
   */
  uniformlyChangeVolume(params: {
    distribution: KandelDistribution;
    baseDelta?: Big;
    quoteDelta?: Big;
    minimumBasePerOffer: Big;
    minimumQuotePerOffer: Big;
  }) {
    const prices = params.distribution.getPricesForDistribution();

    const offerWithPrices = params.distribution.offers.map((offer, i) => ({
      offer,
      price: prices[i],
    }));
    const asks = offerWithPrices.filter((o) => o.offer.offerType == "asks");
    const bases = asks.map((o) => o.offer.base);
    const bids = offerWithPrices.filter((o) => o.offer.offerType == "bids");
    const quotes = bids.map((o) => o.offer.quote);

    const { newValues: newBases, totalChange: totalBaseChange } =
      this.changeValues(
        params.baseDelta,
        bases,
        params.minimumBasePerOffer,
        this.roundBase.bind(this)
      );

    const { newValues: newQuotes, totalChange: totalQuoteChange } =
      this.changeValues(
        params.quoteDelta,
        quotes,
        params.minimumQuotePerOffer,
        this.roundQuote.bind(this)
      );

    const distribution = new KandelDistribution(
      params.distribution.ratio,
      params.distribution.pricePoints,
      bids
        .map((o, i) => ({
          index: o.offer.index,
          base: this.baseFromQuoteAndPrice(newQuotes[i], o.price),
          quote: newQuotes[i],
          offerType: o.offer.offerType,
        }))
        .concat(
          asks.map((o, i) => ({
            index: o.offer.index,
            base: newBases[i],
            quote: this.quoteFromBaseAndPrice(newBases[i], o.price),
            offerType: o.offer.offerType,
          }))
        ),
      params.distribution.baseDecimals,
      params.distribution.quoteDecimals
    );
    return { distribution, totalBaseChange, totalQuoteChange };
  }

  /** Uniformly changes values by a total amount without decreasing below a minimum for each value. A value already below minimum will not be changed.
   * @param values The values to change.
   * @param totalDelta The total amount to change.
   * @param minimumValue The minimum value for each value.
   * @param round The function to round the values.
   * @returns The new values and the total change.
   */
  changeValues(
    delta: Big | undefined,
    values: Big[],
    minimumValue: Big,
    round: (value: Big) => Big
  ) {
    if (delta) {
      if (delta.gt(0)) {
        return this.uniformlyIncrease(values, delta, round);
      } else {
        const { newValues, totalChange } = this.uniformlyDecrease(
          values,
          delta.neg(),
          minimumValue,
          round
        );
        return { newValues, totalChange: totalChange.neg() };
      }
    }
    return { newValues: values, totalChange: Big(0) };
  }

  /** Uniformly increases values by a total amount.
   * @param values The values to increase.
   * @param totalDelta The total amount to increase.
   * @param round The function to round the values.
   * @returns The new values and the total change.
   */
  uniformlyIncrease(
    values: Big[],
    totalDelta: Big,
    round: (value: Big) => Big
  ) {
    let elementsToChange = values.length;
    let totalChange = Big(0);
    const newValues = Array(values.length);

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const actualChange = round(totalDelta.div(elementsToChange));
      newValues[i] = value.add(actualChange);
      totalChange = totalChange.add(actualChange);
      totalDelta = totalDelta.sub(actualChange);
      elementsToChange--;
    }

    return { newValues, totalChange };
  }

  /** Uniformly decreases values by a total amount without decreasing below a minimum for each value. A value already below minimum will not be changed.
   * @param values The values to decrease.
   * @param totalDelta The total amount to decrease.
   * @param minimumValue The minimum value for each value.
   * @param round The function to round each value.
   * @returns The new values and the total change.
   */
  uniformlyDecrease(
    values: Big[],
    totalDelta: Big,
    minimumValue: Big,
    round: (value: Big) => Big
  ) {
    const sortedValues = values
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value.cmp(b.value));
    let totalChange = Big(0);
    let elementsToChange = sortedValues.length;
    for (let i = 0; i < sortedValues.length; i++) {
      const value = sortedValues[i].value;
      const avgChange = round(totalDelta.div(elementsToChange));

      const maxChange = value.gt(minimumValue)
        ? value.sub(minimumValue)
        : Big(0);
      const actualChange = maxChange.lt(avgChange) ? maxChange : avgChange;
      sortedValues[i].value = value.sub(actualChange);
      totalChange = totalChange.add(actualChange);
      totalDelta = totalDelta.sub(actualChange);
      elementsToChange--;
    }

    const newValues = sortedValues
      .sort((a, b) => a.index - b.index)
      .map((v) => v.value);

    return { newValues, totalChange };
  }

  /** Calculates the minimum initial gives for each offer such that all possible gives of fully taken offers at all price points will be above the minimums provided.
   * @param prices The price distribution.
   * @param minimumBasePerOffer The minimum base to give for each offer.
   * @param minimumQuotePerOffer The minimum quote to give for each offer.
   * @returns The minimum initial gives for each offer such that all possible gives of fully taken offers at all price points will be above the minimums provided.
   */
  calculateMinimumInitialGives(
    prices: Big[],
    minimumBasePerOffer: Big,
    minimumQuotePerOffer: Big
  ) {
    if (prices.length == 0)
      return { askGives: minimumBasePerOffer, bidGives: minimumQuotePerOffer };

    let minPrice = prices[0];
    let maxPrice = prices[0];
    prices.forEach((p) => {
      if (p.lt(minPrice)) {
        minPrice = p;
      }
      if (p.gt(maxPrice)) {
        maxPrice = p;
      }
    });

    const minimumBaseFromQuote = this.baseFromQuoteAndPrice(
      minimumQuotePerOffer,
      minPrice
    );
    const minimumQuoteFromBase = this.quoteFromBaseAndPrice(
      minimumBasePerOffer,
      maxPrice
    );
    const askGives = minimumBaseFromQuote.gt(minimumBasePerOffer)
      ? minimumBaseFromQuote
      : minimumBasePerOffer;
    const bidGives = minimumQuoteFromBase.gt(minimumQuotePerOffer)
      ? minimumQuoteFromBase
      : minimumQuotePerOffer;

    return { askGives, bidGives };
  }

  /** Creates a distribution based on an explicit set of offers. Either based on an original distribution or parameters for one.
   * @param explicitOffers The explicit offers to use.
   * @param distribution The original distribution or parameters for one. If pricePoints is not provided, then the number of offers is used.
   * @returns The new distribution.
   */
  public createDistributionWithOffers(
    explicitOffers: OffersWithGives,
    distribution:
      | {
          ratio: Big;
          pricePoints?: number;
        }
      | KandelDistribution
  ) {
    const offers = explicitOffers.map(({ index, offerType, price, gives }) => ({
      index,
      offerType,
      base:
        offerType == "asks"
          ? Big(gives)
          : this.baseFromQuoteAndPrice(Big(gives), Big(price)),
      quote:
        offerType == "bids"
          ? Big(gives)
          : this.quoteFromBaseAndPrice(Big(gives), Big(price)),
    }));

    return new KandelDistribution(
      distribution.ratio,
      distribution.pricePoints ?? offers.length,
      offers,
      this.baseDecimals,
      this.quoteDecimals
    );
  }

  /** Gets whether an index is a bid or an ask based on the first ask index.
   * @param index The index to get the offer type for.
   * @param firstAskIndex The index of the first ask in the distribution.
   * @returns The offer type for the index.
   */
  public getBA(index: number, firstAskIndex: number): Market.BA {
    return index >= firstAskIndex ? "asks" : "bids";
  }

  /** Gets the dual index for an offer in the same manner as the solidity implementation.
   * @param offerType The offer type to get the dual index for.
   * @param index The index of the offer.
   * @param pricePoints The number of price points in the distribution.
   * @param step The step size to use.
   * @returns The dual index.
   */
  public getDualIndex(
    offerType: Market.BA,
    index: number,
    pricePoints: number,
    step: number
  ) {
    // From solidity: GeometricKandel.transportDestination
    let better = 0;
    if (offerType == "asks") {
      better = index + step;
      if (better >= pricePoints) {
        better = pricePoints - 1;
      }
    } else {
      if (index >= step) {
        better = index - step;
      }
      // else better is 0
    }
    return better;
  }

  /** Splits a range of indices into chunks according to the maximum number of offers in a single chunk.
   * @param from The start of the range.
   * @param to The end of the range.
   * @param maxOffersInChunk The maximum number of offers in a single chunk.
   * @returns The chunks.
   */
  public chunkIndices(from: number, to: number, maxOffersInChunk: number) {
    const chunks: { from: number; to: number }[] = [];
    for (let i = from; i < to; i += maxOffersInChunk) {
      chunks.push({
        from: i,
        to: Math.min(i + maxOffersInChunk, to),
      });
    }
    return chunks;
  }

  /** Determines the required provision for the offers in the distribution.
   * @param params The parameters used to calculate the provision.
   * @param params.market The market to get provisions for bids and asks from.
   * @param params.gasreq The gas required to execute a trade.
   * @param params.gasprice The gas price to calculate provision for.
   * @param params.offerCount The number of offers to calculate provision for.
   * @returns The provision required for the number of offers.
   * @remarks This takes into account that each price point can become both an ask and a bid which both require provision.
   */
  public async getRequiredProvision(params: {
    market: Market;
    gasreq: number;
    gasprice: number;
    offerCount: number;
  }) {
    const provisionBid = await params.market.getOfferProvision(
      "bids",
      params.gasreq,
      params.gasprice
    );
    const provisionAsk = await params.market.getOfferProvision(
      "asks",
      params.gasreq,
      params.gasprice
    );
    return provisionBid.add(provisionAsk).mul(params.offerCount);
  }
}

export default KandelDistributionHelper;
