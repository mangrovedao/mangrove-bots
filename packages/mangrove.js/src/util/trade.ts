import Big from "big.js";
import { ethers } from "ethers";
import Market from "../market";
import MgvToken from "../mgvtoken";
import { Bigish } from "../types";
import logger from "./logger";
import TradeEventManagement from "./tradeEventManagement";
import UnitCalculations from "./unitCalculations";

type SnipeUnitParams = {
  ba: Market.BA;
  targets: {
    offerId: number;
    takerWants: ethers.BigNumber;
    takerGives: ethers.BigNumber;
    gasLimit?: number;
  }[];
  fillWants?: boolean;
};

class Trade {
  mangroveUtils = new UnitCalculations();
  tradeEventManagement = new TradeEventManagement();

  getParamsForBuy(
    params: Market.TradeParams,
    baseToken: MgvToken,
    quoteToken: MgvToken
  ) {
    let wants: Big, gives: Big, fillWants: boolean;
    if ("price" in params) {
      if ("volume" in params) {
        wants = Big(params.volume);
        gives = wants.mul(params.price);
        fillWants = true;
      } else {
        gives = Big(params.total);
        wants = gives.div(params.price);
        fillWants = false;
      }
    } else {
      wants = Big(params.wants);
      gives = Big(params.gives);
      fillWants = "fillWants" in params ? params.fillWants : true;
    }

    const slippage = this.validateSlippage(params.slippage);
    const givesWithSlippage = quoteToken.toUnits(
      gives.mul(100 + slippage).div(100)
    );
    return {
      wants: baseToken.toUnits(wants),
      givesSlippageAmount: givesWithSlippage.sub(quoteToken.toUnits(gives)),
      gives: givesWithSlippage,
      fillWants: fillWants,
    };
  }

  getParamsForSell(
    params: Market.TradeParams,
    baseToken: MgvToken,
    quoteToken: MgvToken
  ) {
    let wants: Big, gives: Big, fillWants: boolean;
    if ("price" in params) {
      if ("volume" in params) {
        gives = Big(params.volume);
        wants = gives.mul(params.price);
        fillWants = false;
      } else {
        wants = Big(params.total);
        gives = wants.div(params.price);
        fillWants = true;
      }
    } else {
      wants = Big(params.wants);
      gives = Big(params.gives);
      fillWants = "fillWants" in params ? params.fillWants : false;
    }

    const slippage = this.validateSlippage(params.slippage);
    const wantsWithSlippage = quoteToken.toUnits(
      wants.mul(100 - slippage).div(100)
    );

    return {
      gives: baseToken.toUnits(gives),
      wantsSlippageAmount: wantsWithSlippage.sub(quoteToken.toUnits(wants)),
      wants: wantsWithSlippage,
      fillWants: fillWants,
    };
  }

  validateSlippage = (slippage = 0) => {
    if (typeof slippage === "undefined") {
      return 0;
    } else if (slippage > 100 || slippage < 0) {
      throw new Error("slippage should be a number between 0 and 100");
    }
    return slippage;
  };

  comparePrices(
    price: Bigish,
    priceComparison: string,
    referencePrice: Bigish
  ) {
    return Big(price)[priceComparison](Big(referencePrice));
  }

  isPriceBetter(price: Bigish, referencePrice: Bigish, ba: Market.BA) {
    const priceComparison = ba === "asks" ? "lt" : "gt";
    return this.comparePrices(price, priceComparison, referencePrice);
  }

  isPriceWorse(price: Bigish, referencePrice: Bigish, ba: Market.BA) {
    const priceComparison = ba === "asks" ? "gt" : "lt";
    return this.comparePrices(price, priceComparison, referencePrice);
  }

  /**
   * Market buy/sell order. Will attempt to buy/sell base token for quote tokens.
   * Params can be of the form:
   * - `{volume,price}`: buy `volume` base tokens for a max average price of `price`.
   * - `{total,price}` : buy as many base tokens as possible using up to `total` quote tokens, with a max average price of `price`.
   * - `{wants,gives,fillWants?}`: accept implicit max average price of `gives/wants`
   *
   * In addition, `slippage` defines an allowed slippage in % of the amount of quote token, and
   * `restingOrder` or `offerId` can be supplied to create a resting order or to snipe a specific order, e.g.,
   * to account for gas.
   *
   * Will stop if
   * - book is empty, or
   * - price no longer good, or
   * - `wants` tokens have been bought.
   *
   * @example
   * ```
   * const market = await mgv.market({base:"USDC",quote:"DAI"}
   * market.buy({volume: 100, price: '1.01'}) //use strings to be exact
   * ```
   */
  order(
    bs: Market.BS,
    params: Market.TradeParams,
    market: Market,
    overrides: ethers.Overrides = {}
  ): Promise<{
    result: Promise<Market.OrderResult>;
    response: Promise<ethers.ContractTransaction>;
  }> {
    const { wants, gives, fillWants } =
      bs === "buy"
        ? this.getParamsForBuy(params, market.base, market.quote)
        : this.getParamsForSell(params, market.base, market.quote);
    const restingOrderParams =
      "restingOrder" in params ? params.restingOrder : null;
    if (
      !!params.fillOrKill ||
      !!restingOrderParams ||
      !!params.forceRoutingToMangroveOrder
    ) {
      return this.mangroveOrder(
        {
          wants: wants,
          gives: gives,
          orderType: bs,
          fillWants: fillWants,
          expiryDate: "expiryDate" in params ? params.expiryDate : 0,
          restingParams: restingOrderParams,
          market: market,
          fillOrKill: params.fillOrKill ? params.fillOrKill : false,
        },
        overrides
      );
    } else {
      if ("offerId" in params && params.offerId) {
        return this.snipes(
          {
            targets: [
              {
                offerId: params.offerId,
                takerGives: gives,
                takerWants: wants,
                gasLimit: null,
              },
            ],
            fillWants: fillWants,
            ba: this.bsToBa(bs),
          },
          market,
          overrides
        );
      } else {
        return this.marketOrder(
          {
            wants: wants,
            gives: gives,
            orderType: bs,
            fillWants: fillWants,
            market,
          },
          overrides
        );
      }
    }
  }

  /**
   * Snipe specific offers.
   * Params are:
   * `targets`: an array of
   *    `offerId`: the offer to snipe
   *    `takerWants`: the amount of base token (for asks) or quote token (for bids) the taker wants
   *    `takerGives`: the amount of quote token (for asks) or base token (for bids) the take gives
   *    `gasLimit?`: the maximum gas requirement the taker will tolerate for that offer
   * `ba`: whether to snipe `asks` or `bids`
   * `fillWants?`: specifies whether you will buy at most `takerWants` (true), or you will buy as many tokens as possible as long as you don't spend more than `takerGives` (false).
   * `requireOffersToFail`: defines whether a successful offer will cause the call to fail without sniping anything.
   */
  async snipe(
    params: Market.SnipeParams,
    market: Market,
    overrides: ethers.Overrides = {}
  ): Promise<{
    result: Promise<Market.OrderResult>;
    response: Promise<ethers.ContractTransaction>;
  }> {
    const raw = await this.getRawSnipeParams(params, market, overrides);

    return this.snipesWithRawParameters(
      raw,
      market,
      overrides,
      params.requireOffersToFail
    );
  }

  /**
   * Gets parameters to send to functions `market.mgv.cleanerContract.collect` or `market.mgv.contract.snipes`.
   * Params are:
   * `targets`: an array of
   *    `offerId`: the offer to snipe
   *    `takerWants`: the amount of base token (for asks) or quote token (for bids) the taker wants
   *    `takerGives`: the amount of quote token (for asks) or base token (for bids) the take gives
   *    `gasLimit?`: the maximum gas requirement the taker will tolerate for that offer
   * `ba`: whether to snipe `asks` or `bids`
   * `fillWants?`: specifies whether you will buy at most `takerWants` (true), or you will buy as many tokens as possible as long as you don't spend more than `takerGives` (false).
   * `requireOffersToFail`: defines whether a successful offer will cause the call to fail without sniping anything.
   */
  getRawSnipeParams(
    params: Market.SnipeParams,
    market: Market,
    overrides: ethers.Overrides = {}
  ): Promise<Market.RawSnipeParams> {
    const { outbound_tkn, inbound_tkn } = market.getOutboundInbound(params.ba);

    const _targets = params.targets.map<SnipeUnitParams["targets"][number]>(
      (t) => {
        return {
          offerId: t.offerId,
          takerWants: outbound_tkn.toUnits(t.takerWants),
          takerGives: inbound_tkn.toUnits(t.takerGives),
          gasLimit: t.gasLimit,
        };
      }
    );

    return this.getSnipesRawParamsFromUnitParams(
      { targets: _targets, ba: params.ba, fillWants: params.fillWants },
      market,
      overrides
    );
  }

  /**
   * Low level Mangrove market order.
   * If `orderType` is `"buy"`, the base/quote market will be used,
   *
   * If `orderType` is `"sell"`, the quote/base market will be used,
   *
   * `fillWants` defines whether the market order stops immediately once `wants` tokens have been purchased or whether it tries to keep going until `gives` tokens have been spent.
   *
   * In addition, `slippage` defines an allowed slippage in % of the amount of quote token.
   *
   * Returns a promise for market order result after 1 confirmation.
   * Will throw on same conditions as ethers.js `transaction.wait`.
   */
  async marketOrder(
    {
      wants,
      gives,
      orderType,
      fillWants,
      market,
    }: {
      wants: ethers.BigNumber;
      gives: ethers.BigNumber;
      orderType: Market.BS;
      fillWants: boolean;
      market: Market;
    },
    overrides: ethers.Overrides
  ): Promise<{
    result: Promise<Market.OrderResult>;
    response: Promise<ethers.ContractTransaction>;
  }> {
    const [outboundTkn, inboundTkn] =
      orderType === "buy"
        ? [market.base, market.quote]
        : [market.quote, market.base];

    // user defined gasLimit overrides estimates
    if (!overrides.gasLimit) {
      overrides.gasLimit = await market.estimateGas(orderType, wants);
    }

    logger.debug("Creating market order", {
      contextInfo: "market.marketOrder",
      data: {
        outboundTkn: outboundTkn.name,
        inboundTkn: inboundTkn.name,
        fillWants: fillWants,
        wants: wants.toString(),
        gives: gives.toString(),
        orderType: orderType,
        gasLimit: overrides.gasLimit?.toString(),
      },
    });
    const response = market.mgv.contract.marketOrder(
      outboundTkn.address,
      inboundTkn.address,
      wants,
      gives,
      fillWants,
      overrides
    );
    const result = this.responseToMarketOrderResult(
      response,
      orderType,
      fillWants,
      wants,
      gives,
      market
    );
    return { result, response };
  }

  async responseToMarketOrderResult(
    response: Promise<ethers.ContractTransaction>,
    orderType: Market.BS,
    fillWants: boolean,
    wants: ethers.BigNumber,
    gives: ethers.BigNumber,
    market: Market
  ) {
    const receipt = await (await response).wait();

    logger.debug("Market order raw receipt", {
      contextInfo: "market.marketOrder",
      data: { receipt: receipt },
    });
    const result: Market.OrderResult = this.initialResult(receipt);
    this.tradeEventManagement.processMangroveEvents(
      result,
      receipt,
      this.bsToBa(orderType),
      fillWants,
      wants,
      gives,
      market
    );
    if (!result.summary) {
      throw Error("market order went wrong");
    }
    return result;
  }

  async mangroveOrder(
    {
      wants,
      gives,
      orderType,
      fillWants,
      fillOrKill,
      expiryDate,
      restingParams,
      market,
    }: {
      wants: ethers.BigNumber;
      gives: ethers.BigNumber;
      orderType: Market.BS;
      fillWants: boolean;
      fillOrKill: boolean;
      expiryDate: number;
      restingParams: Market.RestingOrderParams;
      market: Market;
    },
    overrides: ethers.Overrides
  ): Promise<{
    result: Promise<Market.OrderResult>;
    response: Promise<ethers.ContractTransaction>;
  }> {
    const { postRestingOrder, provision } =
      this.getRestingOrderParams(restingParams);
    const overrides_ = {
      ...overrides,
      value: provision ? market.mgv.toUnits(provision, 18) : 0,
    };

    // user defined gasLimit overrides estimates
    overrides_.gasLimit = overrides_.gasLimit
      ? overrides_.gasLimit
      : await market.estimateGas(orderType, wants);

    const [outboundTkn, inboundTkn] =
      orderType === "buy"
        ? [market.base, market.quote]
        : [market.quote, market.base];

    const response = market.mgv.orderContract.take(
      {
        outbound_tkn: outboundTkn.address,
        inbound_tkn: inboundTkn.address,
        fillOrKill: fillOrKill,
        fillWants: orderType === "buy",
        takerWants: wants,
        takerGives: gives,
        restingOrder: postRestingOrder,
        pivotId: 0, // FIXME: replace this with an evaluation of the pivot at price induced by price takerWants/(takerGives - slippageAmount) or vice versa
        expiryDate: expiryDate,
      },
      overrides_
    );
    const result = this.responseToMangroveOrdeResult(
      response,
      orderType,
      fillWants,
      wants,
      gives,
      market
    );
    // if resting order was not posted, result.summary is still undefined.
    return { result, response };
  }

  async responseToMangroveOrdeResult(
    response: Promise<ethers.ContractTransaction>,
    orderType: Market.BS,
    fillWants: boolean,
    wants: ethers.BigNumber,
    gives: ethers.BigNumber,
    market: Market
  ) {
    const receipt = await (await response).wait();

    logger.debug("Mangrove order raw receipt", {
      contextInfo: "market.mangrove",
      data: { receipt: receipt },
    });

    const result: Market.OrderResult = this.initialResult(receipt);

    this.tradeEventManagement.processMangroveEvents(
      result,
      receipt,
      this.bsToBa(orderType),
      fillWants,
      wants,
      gives,
      market
    );
    this.tradeEventManagement.processMangroveOrderEvents(
      result,
      receipt,
      this.bsToBa(orderType),
      fillWants,
      wants,
      gives,
      market
    );

    if (!result.summary) {
      throw Error("mangrove order went wrong");
    }
    // if resting order was not posted, result.summary is still undefined.
    return result;
  }

  getRestingOrderParams(params: Market.RestingOrderParams): {
    provision: Bigish;
    postRestingOrder: boolean;
  } {
    if (params) {
      return {
        provision: params.provision,
        postRestingOrder: true,
      };
    } else {
      return { provision: 0, postRestingOrder: false };
    }
  }

  initialResult(receipt: ethers.ContractReceipt): Market.OrderResult {
    return {
      txReceipt: receipt,
      summary: undefined,
      successes: [],
      tradeFailures: [],
      posthookFailures: [],
      offerWrites: [],
    };
  }

  baToBs(ba: Market.BA): Market.BS {
    return ba === "asks" ? "buy" : "sell";
  }

  bsToBa(bs: Market.BS): Market.BA {
    return bs === "buy" ? "asks" : "bids";
  }

  /**
   * Gets parameters to send to functions `market.mgv.cleanerContract.collect` or `market.mgv.contract.snipes`.
   */
  async getSnipesRawParamsFromUnitParams(
    unitParams: SnipeUnitParams,
    market: Market,
    overrides: ethers.Overrides
  ): Promise<Market.RawSnipeParams> {
    const _fillWants = unitParams.fillWants ?? true;

    const [outboundTkn, inboundTkn] =
      unitParams.ba === "asks"
        ? [market.base, market.quote]
        : [market.quote, market.base];

    logger.debug("Creating snipes", {
      contextInfo: "market.snipes",
      data: {
        outboundTkn: outboundTkn.name,
        inboundTkn: inboundTkn.name,
        fillWants: _fillWants,
      },
    });

    // user defined gasLimit overrides estimates
    const _targets = await Promise.all(
      unitParams.targets.map<Promise<Market.RawSnipeParams["targets"][number]>>(
        async (t) => [
          t.offerId,
          t.takerWants,
          t.takerGives,
          t.gasLimit ??
            overrides.gasLimit ??
            (
              await market.getSemibook(unitParams.ba).offerInfo(t.offerId)
            ).gasreq,
        ]
      )
    );

    return {
      ba: unitParams.ba,
      outboundTkn: outboundTkn.address,
      inboundTkn: inboundTkn.address,
      targets: _targets,
      fillWants: _fillWants,
    };
  }

  /**
   * Low level sniping of `targets`.
   *
   * `requireOffersToFail`: if true, then a successful offer will cause the call to fail without sniping anything.
   *
   * Returns a promise for snipes result after 1 confirmation.
   * Will throw on same conditions as ethers.js `transaction.wait`.
   */
  async snipesWithRawParameters(
    raw: Market.RawSnipeParams,
    market: Market,
    overrides: ethers.Overrides,
    requireOffersToFail?: boolean
  ): Promise<{
    result: Promise<Market.OrderResult>;
    response: Promise<ethers.ContractTransaction>;
  }> {
    // Invoking the cleanerContract does not populate receipt.events, so we instead parse receipt.logs
    const snipeFunction = requireOffersToFail
      ? market.mgv.cleanerContract.collect
      : market.mgv.contract.snipes;

    const response = snipeFunction(
      raw.outboundTkn,
      raw.inboundTkn,
      raw.targets,
      raw.fillWants,
      overrides
    );

    const result = this.responseToSnipesResult(response, raw, market);
    return { result, response };
  }

  async responseToSnipesResult(
    response: Promise<ethers.ContractTransaction>,
    raw: Market.RawSnipeParams,
    market: Market
  ) {
    const receipt = await (await response).wait();

    const result: Market.OrderResult = this.initialResult(receipt);

    logger.debug("Snipes raw receipt", {
      contextInfo: "market.snipes",
      data: { receipt: receipt },
    });

    // pass 0's for gives/wants to always report a full fill
    this.tradeEventManagement.processMangroveEvents(
      result,
      receipt,
      raw.ba,
      true,
      ethers.BigNumber.from(0),
      ethers.BigNumber.from(0),
      market
    );
    if (!result.summary) {
      throw Error("snipes went wrong");
    }
    return result;
  }

  /**
   * Low level sniping of `targets`.
   *
   * Returns a promise for snipes result after 1 confirmation.
   * Will throw on same conditions as ethers.js `transaction.wait`.
   */
  async snipes(
    unitParams: SnipeUnitParams,
    market: Market,
    overrides: ethers.Overrides
  ): Promise<{
    result: Promise<Market.OrderResult>;
    response: Promise<ethers.ContractTransaction>;
  }> {
    const raw = await this.getSnipesRawParamsFromUnitParams(
      unitParams,
      market,
      overrides
    );

    return this.snipesWithRawParameters(raw, market, overrides);
  }
}

export default Trade;
