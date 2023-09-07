import { Mangrove, Market, MgvToken, ethers } from "@mangrovedao/mangrove.js";
import UnitCalculations from "@mangrovedao/mangrove.js/dist/nodejs/util/unitCalculations";
import dotenvFlow from "dotenv-flow";
import { MgvArbitrage__factory } from "./types/typechain";
import { logger } from "./util/logger";
import { ArbConfig } from "./util/configUtils";
import {
  LatestMarketActivity,
  PriceUtils,
  TxUtils,
} from "@mangrovedao/bot-utils";
import { BigNumber, BigNumberish } from "ethers";
import Big from "big.js";
import { Pricer } from "./uniswap/pricing";
import { Context } from "./types";
import { PoolInfo } from "./uniswap/types";
dotenvFlow.config();

const whitelist = [
  "MgvArbitrage/notProfitable",
  "MgvArbitrage/notMinGain",
  "Too little received",
];

export class ArbBot {
  mgv: Mangrove;
  priceUtils = new PriceUtils(logger);
  #latestMarketActivity: LatestMarketActivity;
  #txUtils: TxUtils;

  constructor(
    _mgv: Mangrove,
    private poolInfo: PoolInfo,
    private pricer: Pricer,
    latestMarketActivity: LatestMarketActivity,
    private context: Context
  ) {
    this.mgv = _mgv;
    this.#latestMarketActivity = latestMarketActivity;
    this.#txUtils = new TxUtils(_mgv.provider, logger);
  }

  public async run(
    market: Market,
    marketConfig: [string, string, number],
    config: ArbConfig,
    contextInfo?: string
  ): Promise<{
    askTransaction: ethers.ContractTransaction;
    bidTransaction: ethers.ContractTransaction;
  }> {
    logger.info(
      "Heartbeat - Checking whether Mangrove market can be arb'ed...",
      {
        base: market.base.name,
        quote: market.quote.name,
        contextInfo,
      }
    );
    this.#latestMarketActivity.latestBlock =
      this.mgv.reliableProvider.blockManager.getLastBlock();
    this.#latestMarketActivity.lastActive = new Date().toISOString();

    try {
      const [, , fee] = marketConfig;

      if (!this.mgv.network.id) {
        throw new Error("No network id found for mangrove.");
      }

      const API_KEY = process.env["API_KEY"];
      let gasprice: BigNumber;
      if (!API_KEY) {
        const gaspriceFallback = process.env["GAS_PRICE_FALLBACK"];
        if (gaspriceFallback) {
          gasprice = BigNumber.from(gaspriceFallback);
        } else {
          throw new Error("No API_KEY for alchemy");
        }
      } else {
        gasprice = await this.priceUtils.getGasPrice(
          API_KEY,
          this.mgv.network.id!
        );
      }
      const nativeToken = this.getNativeTokenNameAndDecimals(
        this.mgv.network.id
      );
      const holdsTokenPrice = await this.priceUtils
        .getExternalPriceFromInAndOut(nativeToken.name, config.tokenForExchange)
        .price();

      return {
        askTransaction: await this.doArbIfProfitable(
          market,
          "asks",
          config,
          fee,
          gasprice,
          holdsTokenPrice,
          contextInfo
        ),
        bidTransaction: await this.doArbIfProfitable(
          market,
          "bids",
          config,
          fee,
          gasprice,
          holdsTokenPrice,
          contextInfo
        ),
      };
    } catch (error) {
      logger.error("Error starting bots for market", {
        data: { marketConfig, error },
        contextInfo,
      });
      throw error;
    }
  }

  private getNativeTokenNameAndDecimals(chainId?: number) {
    // const provider = this.mgv.provider;
    // const network = await provider.getNetwork();
    // const nativeCurrency = network.;
    // const currencyInfo = ethers.utils.get(nativeCurrency.symbol);
    // TODO: get the correct native token name and decimals
    return { name: "matic", decimals: 18 };
  }

  private async doArbIfProfitable(
    market: Market,
    BA: Market.BA,
    config: ArbConfig,
    fee: number,
    gasprice: BigNumber,
    holdsTokenPrice: Big,
    contextInfo?: string
  ): Promise<ethers.ContractTransaction> {
    const { inbound_tkn: givesToken, outbound_tkn: wantsToken } =
      market.getOutboundInbound(BA);
    const bestId = (
      await market.mgv.contract.best(wantsToken.address, givesToken.address)
    )?.toNumber();
    const bestOffer = bestId ? await market.offerInfo(BA, bestId) : undefined;

    if (bestOffer && bestId) {
      const result = await this.isProfitable(
        bestId,
        wantsToken,
        bestOffer,
        givesToken,
        config,
        fee,
        gasprice,
        holdsTokenPrice,
        contextInfo
      );
      if (result.isProfitable) {
        logger.info(`Arbitrage is profitable`, {
          data: {
            offer: bestId,
            BA,
            wants: bestOffer.wants,
            gives: bestOffer.gives,
          },
          base: market.base.name,
          quote: market.quote.name,
          contextInfo,
        });
        return (await this.doArbitrage(
          bestId,
          wantsToken,
          bestOffer,
          givesToken,
          result.costInHoldingToken,
          config,
          fee
        )) as ethers.ContractTransaction;
      } else {
        logger.info(`Arbitrage is not profitable`, {
          data: {
            offer: bestId,
            BA,
            wants: bestOffer.wants,
            gives: bestOffer.gives,
          },
          base: market.base.name,
          quote: market.quote.name,
          contextInfo,
        });
      }
    } else {
      logger.info(`No best offer found`, {
        base: market.base.name,
        quote: market.quote.name,
        contextInfo,
        data: {
          BA,
        },
      });
    }
  }

  private async isProfitable(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    config: ArbConfig,
    fee: number,
    gasprice: BigNumber,
    holdsTokenPrice: Big,
    contextInfo?: string
  ): Promise<{
    isProfitable: boolean;
    costInHoldingToken: BigNumberish;
  }> {
    try {
      const gasused = await this.estimateArbGas(
        bestId,
        wantsToken,
        bestOffer,
        givesToken,
        config,
        fee
      );
      const costInNative = gasprice.mul(gasused);
      const holdingToken = await wantsToken.mgv.token(config.tokenForExchange);
      const costInNativeReadable = wantsToken.mgv.fromUnits(
        costInNative.toString(),
        18
      );
      const costInHoldingToken = holdsTokenPrice.mul(
        costInNativeReadable.toString()
      );
      const costInHoldingTokenInUnits = holdingToken.toUnits(
        costInHoldingToken.toString()
      );

      await this.staticArb(
        bestId,
        wantsToken,
        bestOffer,
        givesToken,
        costInHoldingTokenInUnits.toString(),
        config,
        fee
      );
      return {
        isProfitable: true,
        costInHoldingToken: costInHoldingTokenInUnits.toString(),
      };
    } catch (e) {
      if (e["reason"]) {
        const reason: string = e["reason"].toString();
        const isWhiteListed = whitelist
          .map((wl) => reason.includes(wl))
          .includes(true);
        if (!isWhiteListed) {
          logger.error(e, { contextInfo });
        }
      }
      logger.debug(e, { contextInfo });
      return { isProfitable: false, costInHoldingToken: 0 };
    }
  }

  private async estimateArbGas(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    config: ArbConfig,
    fee: number
  ) {
    const gasused = await this.doArbitrage(
      bestId,
      wantsToken,
      bestOffer,
      givesToken,
      0,
      config,
      fee,
      true
    );
    return gasused as BigNumber;
  }

  private async staticArb(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    minGain: BigNumberish,
    config: ArbConfig,
    fee: number
  ) {
    await this.doArbitrage(
      bestId,
      wantsToken,
      bestOffer,
      givesToken,
      minGain,
      config,
      fee,
      false,
      true
    );
  }

  private async doArbitrage(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    minGain: BigNumberish,
    config: ArbConfig,
    fee: number,
    estimateGas = false,
    staticCall = false
  ) {
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

    const holdsToken = config.holdingTokens.includes(givesToken.name);
    const mgv = givesToken.mgv;
    const arbAddress = mgv.getAddress("MgvArbitrage");
    const arbContract = MgvArbitrage__factory.connect(
      arbAddress,
      this.mgv.signer
    );
    const correctCall = staticCall
      ? arbContract.callStatic
      : estimateGas
      ? arbContract.estimateGas
      : arbContract;

    let takerWants = UnitCalculations.toUnits(
      bestOffer.gives,
      wantsToken.decimals
    ).toString();

    let takerGivesAsBig = bestOffer.wants;
    let takerGives = UnitCalculations.toUnits(
      bestOffer.wants,
      givesToken.decimals
    ).toString();

    if (holdsToken) {
      const _givesToken = this.context.holdingTokens[givesToken.name];
      if (_givesToken) {
        if (_givesToken.balance.lt(takerGivesAsBig)) {
          takerGivesAsBig = _givesToken.balance;
          takerGives = givesToken.toUnits(takerGivesAsBig).toString();
          const newTakerWants = bestOffer.price.mul(takerGivesAsBig);
          takerWants = wantsToken.toUnits(newTakerWants).toString();
        }
      }
      return await correctCall.doArbitrage(
        {
          offerId: bestId,
          takerWantsToken: wantsToken.address,
          takerWants: takerWants,
          takerGivesToken: givesToken.address,
          takerGives: takerGives,
          fee: fee,
          minGain: minGain,
        },
        txOverrides
      );
    } else if (config.exchangeConfig) {
      /* only uniswap exchange as fee */
      if ("fee" in config.exchangeConfig) {
        // if exchange is uniswap
        const poolInfo = {
          token0: this.poolInfo.token0,
          token1: this.poolInfo.token1,
          fee: this.poolInfo.fee,
        };
        const maxTakerGives = await this.pricer.quoteExactInputSingle(
          poolInfo,
          this.context.tokenForExchange.balance.toFixed()
        );
        const maxTakerGivesAsBig = givesToken.fromUnits(maxTakerGives);

        if (maxTakerGivesAsBig.lt(takerGivesAsBig)) {
          //then we needs to partial fill
          takerGives = givesToken.toUnits(maxTakerGivesAsBig).toString();
          const newTakerWants = bestOffer.price.mul(maxTakerGivesAsBig);
          takerWants = wantsToken.toUnits(newTakerWants).toString();
        }

        return await correctCall.doArbitrageExchangeOnUniswap(
          {
            offerId: bestId,
            takerWantsToken: wantsToken.address,
            takerWants: takerWants,
            takerGivesToken: givesToken.address,
            takerGives: takerGives,
            fee: fee,
            minGain: minGain,
          },
          mgv.getAddress(config.tokenForExchange),
          config.exchangeConfig.fee(givesToken.name),
          txOverrides
        );
      } else {
        return await correctCall.doArbitrageExchangeOnMgv(
          {
            offerId: bestId,
            takerWantsToken: wantsToken.address,
            takerWants: takerWants,
            takerGivesToken: givesToken.address,
            takerGives: takerGives,
            fee: fee,
            minGain: minGain,
          },
          mgv.getAddress(config.tokenForExchange),
          txOverrides
        );
      }
    }
  }
}
