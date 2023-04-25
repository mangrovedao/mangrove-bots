import { Mangrove, Market, MgvToken, ethers } from "@mangrovedao/mangrove.js";
import UnitCalculations from "@mangrovedao/mangrove.js/dist/nodejs/util/unitCalculations";
import dotenvFlow from "dotenv-flow";
import { MgvArbitrage__factory } from "./types/typechain";
import { logger } from "./util/logger";
import { ArbConfig } from "./util/configUtils";
import { PriceUtils } from "@mangrovedao/bot-utils/build/util/priceUtils";
import config from "./util/config";
import { BigNumber, BigNumberish } from "ethers";
import Big from "big.js";
dotenvFlow.config();

export class ArbBot {
  mgv: Mangrove;
  poolContract: ethers.Contract;
  priceUtils = new PriceUtils(config);

  constructor(_mgv: Mangrove, _poolContract: ethers.Contract) {
    this.mgv = _mgv;
    this.poolContract = _poolContract;
  }

  public async run(marketConfig: [string, string], config: ArbConfig) {
    try {
      const [base, quote] = marketConfig;
      const market = await this.mgv.market({
        base: base,
        quote: quote,
        bookOptions: { maxOffers: 20 },
      });
      const APIKEY = process.env["APIKEY"];
      if (!APIKEY) {
        throw new Error("No API key for alchemy");
      }
      const gasprice = await this.priceUtils.getGasPrice(
        APIKEY,
        this.mgv.network.name
      );
      const nativeToken = this.getNativeTokenNameAndDecimals(
        this.mgv.network.id
      );
      const holdsTokenPrice = await this.priceUtils
        .getExternalPriceFromInAndOut(nativeToken.name, config.holdingToken)
        .price();

      await this.checkPrice(market, "asks", config, gasprice, holdsTokenPrice);
      await this.checkPrice(market, "bids", config, gasprice, holdsTokenPrice);
    } catch (error) {
      logger.error("Error starting bots for market", { data: marketConfig });
      logger.error(error);
      throw error;
    }
  }

  public async activateTokens(tokens: string[]) {
    const arbAddress = Mangrove.getAddress(
      "MgvArbitrage",
      (await this.mgv.provider.getNetwork()).name
    );
    const arbContract = MgvArbitrage__factory.connect(
      arbAddress,
      this.mgv.signer
    );
    await arbContract.activateTokens(tokens);
  }

  private getNativeTokenNameAndDecimals(chainId?: number) {
    // const provider = this.mgv.provider;
    // const network = await provider.getNetwork();
    // const nativeCurrency = network.;
    // const currencyInfo = ethers.utils.get(nativeCurrency.symbol);
    // TODO: get the correct native token name and decimals
    return { name: "matic", decimals: 18 };
  }

  private async checkPrice(
    market: Market,
    BA: Market.BA,
    config: ArbConfig,
    gasprice: BigNumber,
    holdsTokenPrice: Big
  ) {
    const bestId = market.getSemibook(BA).getBestInCache();
    const bestOffer = bestId ? await market.offerInfo(BA, bestId) : undefined;
    let wantsToken = BA == "asks" ? market.base : market.quote;
    let givesToken = BA == "asks" ? market.quote : market.base;

    if (bestOffer && bestId) {
      const t = await this.isProfitable(
        bestId,
        wantsToken,
        bestOffer,
        givesToken,
        config,
        gasprice,
        holdsTokenPrice
      );
      if (t.isProfitable) {
        return await this.doArbitrage(
          bestId,
          wantsToken,
          bestOffer,
          givesToken,
          t.costInHoldingToken,
          config
        );
      }
    }
  }

  private async isProfitable(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    config: ArbConfig,
    gasprice: BigNumber,
    holdsTokenPrice: Big
  ): Promise<{
    isProfitable: boolean;
    costInHoldingToken: BigNumberish;
  }> {
    const deci = this.mgv.token(config.holdingToken).decimals;
    try {
      let gasused = await this.estimateArbGas(
        bestId,
        wantsToken,
        bestOffer,
        givesToken,
        config
      );
      const costInNative = gasprice.mul(gasused);
      const costInHoldingToken = holdsTokenPrice
        .mul(costInNative.toString())
        .round();
      const t = await this.staticArbGas(
        bestId,
        wantsToken,
        bestOffer,
        givesToken,
        costInHoldingToken.toString(),
        config
      );
      return {
        isProfitable: true,
        costInHoldingToken: costInHoldingToken.toString(),
      };
    } catch (e) {
      console.log(e);
      return { isProfitable: false, costInHoldingToken: 0 };
    }
  }

  private async estimateArbGas(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    config: ArbConfig
  ) {
    const gasused = await this.doArbitrage(
      bestId,
      wantsToken,
      bestOffer,
      givesToken,
      0,
      config,
      true
    );
    return gasused as BigNumber;
  }

  private async staticArbGas(
    bestId: number,
    wantsToken: MgvToken,
    bestOffer: Market.Offer,
    givesToken: MgvToken,
    minGain: BigNumberish,
    config: ArbConfig
  ) {
    await this.doArbitrage(
      bestId,
      wantsToken,
      bestOffer,
      givesToken,
      minGain,
      config,
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
    estimateGas = false,
    staticCall = false
  ) {
    const holdsToken = config.holdingToken == givesToken.name;

    const arbAddress = Mangrove.getAddress(
      "MgvArbitrage",
      (await this.mgv.provider.getNetwork()).name
    );
    const arbContract = MgvArbitrage__factory.connect(
      arbAddress,
      this.mgv.signer
    );

    if (holdsToken) {
      return await (staticCall
        ? arbContract.callStatic
        : estimateGas
        ? arbContract.estimateGas
        : arbContract
      ).doArbitrage({
        offerId: bestId,
        takerWantsToken: wantsToken.address,
        takerWants: UnitCalculations.toUnits(
          bestOffer.gives,
          wantsToken.decimals
        ).toString(),
        takerGivesToken: givesToken.address,
        takerGives: UnitCalculations.toUnits(
          bestOffer.wants,
          givesToken.decimals
        ).toString(),
        fee: config.fee,
        minGain: minGain,
      });
    } else if (config.exchangeConfig) {
      if ("fee" in config.exchangeConfig) {
        return await (staticCall
          ? arbContract.callStatic
          : estimateGas
          ? arbContract.estimateGas
          : arbContract
        ).doArbitrageExchangeOnUniswap(
          {
            offerId: bestId,
            takerWantsToken: wantsToken.address,
            takerWants: UnitCalculations.toUnits(
              bestOffer.gives,
              wantsToken.decimals
            ).toString(),
            takerGivesToken: givesToken.address,
            takerGives: UnitCalculations.toUnits(
              bestOffer.wants,
              givesToken.decimals
            ).toString(),
            fee: config.fee,
            minGain: minGain,
          },
          givesToken.mgv.token(config.holdingToken).address,
          config.exchangeConfig.fee
        );
      } else {
        return await (staticCall
          ? arbContract.callStatic
          : estimateGas
          ? arbContract.estimateGas
          : arbContract
        ).doArbitrageExchangeOnMgv(
          {
            offerId: bestId,
            takerWantsToken: wantsToken.address,
            takerWants: UnitCalculations.toUnits(
              bestOffer.gives,
              wantsToken.decimals
            ).toString(),
            takerGivesToken: givesToken.address,
            takerGives: UnitCalculations.toUnits(
              bestOffer.wants,
              givesToken.decimals
            ).toString(),
            fee: config.fee,
            minGain: minGain,
          },
          givesToken.mgv.token(config.holdingToken).address
        );
      }
    }
  }
}
