import { CommonLogger } from "../logging/coreLogger";
import { Market } from "@mangrovedao/mangrove.js";
import Big from "big.js";
import { fetchJson } from "ethers/lib/utils";
import random from "random";
import { Network, Alchemy } from "alchemy-sdk";

type PriceApiResponse = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  date: string;
};

/* A lot of CEX does not have pair with USDC, we can convert to usd as the ratio is almost 1:1
 * It's not critical in this application as if USDC depeg, we will over estimate the actual gas
 * cost of an arbitrage, and that's ok.
 **/
export const converter = (token: string) => {
  if (token.toUpperCase() === "USDC") {
    return "USD";
  }

  return token.toUpperCase();
};

export class PriceUtils {
  logger?: CommonLogger;
  constructor(_logger?: CommonLogger) {
    this.logger = _logger;
  }

  public choosePrice(ba: Market.BA, referencePrice: Big, lambda: Big): Big {
    const u = random.float(0, 1) - 0.5;
    const plug = lambda.mul(u);

    const price =
      ba === "bids" ? referencePrice.minus(plug) : referencePrice.plus(plug);

    return price.gt(0) ? price : referencePrice;
  }

  async priceFromJson(json: any, outToken: string) {
    if (json[outToken] !== undefined) {
      const referencePrice = new Big(json[outToken]);
      return referencePrice;
    }
  }

  public getExternalPriceFromInAndOut(
    inToken: string,
    outToken: string
  ): {
    apiUrl: string;
    getJson: () => Promise<any>;
    price: () => Promise<Big | undefined>;
  } {
    const priceApiUrl = `https://prod-price-api-32327e5e7126.herokuapp.com/prices/${converter(
      inToken
    )}/${converter(outToken)}/1m`;

    return {
      apiUrl: priceApiUrl,
      getJson: () => fetchJson(priceApiUrl),
      price: async () => {
        try {
          const price = (await fetchJson(priceApiUrl)) as PriceApiResponse;
          return new Big(price.close);
        } catch (e) {
          const cryptoCompareUrl = `https://min-api.cryptocompare.com/data/price?fsym=${inToken}&tsyms=${outToken}`;
          return this.priceFromJson(
            await fetchJson(cryptoCompareUrl),
            outToken
          );
        }
      },
    };
  }

  public async getExternalPrice(market: Market, ba: Market.BA) {
    const externalPrice = this.getExternalPriceFromInAndOut(
      market.base.name,
      market.quote.name
    );
    try {
      this.logger?.debug("Getting external price reference", {
        contextInfo: "maker",
        base: market.base.name,
        quote: market.quote.name,
        ba: ba,
        data: {
          apiUrl: externalPrice.apiUrl,
        },
      });
      const price = await externalPrice.price();
      if (price !== undefined) {
        const referencePrice = price;
        this.logger?.info(
          "Using external price reference as order book is empty",
          {
            contextInfo: "maker",
            base: market.base.name,
            quote: market.quote.name,
            ba: ba,
            data: {
              referencePrice,
              apiUrl: externalPrice.apiUrl,
            },
          }
        );
        return referencePrice;
      }

      this.logger?.warn(
        `Response did not contain a ${market.quote.name} field`,
        {
          contextInfo: "maker",
          base: market.base.name,
          quote: market.quote.name,
          ba: ba,
          data: {
            apiUrl: externalPrice.apiUrl,
            responseJson: await externalPrice.getJson(),
          },
        }
      );

      return;
    } catch (e) {
      this.logger?.error(`Error encountered while fetching external price`, {
        contextInfo: "maker",
        base: market.base.name,
        quote: market.quote.name,
        ba: ba,
        data: {
          reason: e,
          apiUrl: externalPrice.apiUrl,
        },
      });
      return;
    }
  }
  public async getReferencePrice(
    market: Market,
    ba: Market.BA,
    offerList: Market.Offer[]
  ): Promise<Big | undefined> {
    let bestOffer: Market.Offer | undefined = undefined;
    if (offerList.length > 0) {
      bestOffer = offerList[0];
      this.logger?.debug("Best offer on book", {
        contextInfo: "maker",
        base: market.base.name,
        quote: market.quote.name,
        ba: ba,
        data: { bestOffer: bestOffer },
      });

      return bestOffer.price;
    }

    await this.getExternalPrice(market, ba);
  }

  /**
   * Get the Alchemy network corresponding to the chainId.
   *
   * @param chainId the chainId of the network to query
   * @returns the Alchemy network corresponding to the chainId
   * @remarks One should think that Alchemy provided a method (or an overload of the Alchemy constructor) to do this, but I haven't been able to find it.
   */
  getAlchemyNetworkFromChainId(chainId: number): Network | undefined {
    switch (chainId) {
      case 137:
        return Network.MATIC_MAINNET;
      case 80001:
        return Network.MATIC_MUMBAI;
      case 1:
        return Network.ETH_MAINNET;
      case 5:
        return Network.ETH_GOERLI;
    }

    return undefined;
  }

  /**
   * Queries the alchemy node for the current gas price.
   * @param APIKEY An API key for alchemy node
   * @param chainId the chainId of the network to query
   * @returns the best guess of the current gas price to use in transactions
   */
  public async getGasPrice(APIKEY: string, chainId: number) {
    const alchemyNetwork = this.getAlchemyNetworkFromChainId(chainId);

    if (!alchemyNetwork) {
      throw new Error(
        `Cannot find Alchemy network corresponding to chainId: ${chainId}.`
      );
    }

    const alchemy = new Alchemy({
      apiKey: APIKEY,
      network: alchemyNetwork,
    });

    return await alchemy.core.getGasPrice();
  }
}
