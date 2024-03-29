import { PriceUtils } from "@mangrovedao/bot-utils";
import Mangrove from "@mangrovedao/mangrove.js";
import { typechain } from "@mangrovedao/mangrove.js/dist/nodejs/types";
import { MaxUpdateConstraint } from "./GasUpdater";
import logger from "./util/logger";
import { ContractTransaction, ethers, Overrides } from "ethers";

class GasHelper {
  priceUtils = new PriceUtils(logger);
  /**
   * Either returns a constant gas price, if set, or queries a dedicated
   * external source for gas prices.
   * @returns {number} Promise object representing the gas price from the
   * external oracle
   */
  async getGasPriceEstimateFromOracle(params: {
    constantGasPrice: number | undefined;
    mangrove: Mangrove;
  }): Promise<number | undefined> {
    if (params.constantGasPrice !== undefined) {
      logger.debug(
        `'constantOracleGasPrice' set. Using the configured value.`,
        { data: params.constantGasPrice }
      );
      return params.constantGasPrice;
    }

    if (!params.mangrove.network.id) {
      throw new Error("No network id found for mangrove.");
    }

    const API_KEY = process.env["API_KEY"];
    if (!API_KEY) {
      throw new Error("No API key for alchemy");
    }

    const gaspriceFromOracle = this.priceUtils
      .getGasPrice(API_KEY, params.mangrove.network.id)
      .then((gaspriceEstimateInWei) => {
        const gasPriceEstimateInMwei = ethers.utils.formatUnits(
          gaspriceEstimateInWei,
          "mwei"
        );
        return Number(gasPriceEstimateInMwei);
      })
      .catch((error) => {
        logger.error("Getting gas price estimate from oracle failed", {
          mangrove: params.mangrove,
          data: error,
        });
        return undefined;
      });

    logger.debug("Gas price estimate received from oracle", {
      data: gaspriceFromOracle,
    });

    return gaspriceFromOracle;
  }

  /**
   * Compare the current Mangrove gasprice with a gas price from the external
   * oracle, and decide whether a gas price update should be sent.
   * @param currentGasPrice Current gas price from Mangrove config.
   * @param oracleGasPrice Gas price from external oracle.
   * @returns {[boolean, number]} A pair representing (1) whether the Mangrove
   * gas price should be updated, and (2) what gas price to update to.
   */
  shouldUpdateMangroveGasPrice(
    currentGasPrice: number,
    oracleGasPrice: number,
    acceptableGasGapToOracle: number
  ): [boolean, number] {
    //NOTE: Very basic implementation allowing a configurable gap between
    //      Mangrove an oracle gas price.
    const shouldUpdate =
      Math.abs(currentGasPrice - oracleGasPrice) > acceptableGasGapToOracle;

    if (shouldUpdate) {
      logger.debug(
        `shouldUpdateMangroveGasPrice: Determined update needed - to ${oracleGasPrice}`
      );
      return [true, oracleGasPrice];
    } else {
      logger.debug(
        `shouldUpdateMangroveGasPrice: Determined no update needed.`
      );
      return [false, oracleGasPrice];
    }
  }
  /**
   * Use the max update constraint to check if the newGasPrice is allowed.
   * If not allowed returns the max newGasPrice
   * @param newGasPrice The new gas price
   * @param oldGasPrice The old gas price
   * @param maxUpdateConstraint The update constraint for the new gas price
   */

  calculateNewGaspriceFromConstraints(
    newGasPrice: number,
    oldGasPrice: number,
    maxUpdateConstraint?: MaxUpdateConstraint
  ) {
    if (!maxUpdateConstraint) {
      return newGasPrice;
    }
    if (maxUpdateConstraint.constant && maxUpdateConstraint.percentage) {
      const allowConstPrice = this.getAllowedConstantGasPrice(
        maxUpdateConstraint.constant,
        oldGasPrice,
        newGasPrice
      );
      const allowPercentagePrice = this.getAllowedPercentageGasPrice(
        maxUpdateConstraint.percentage,
        oldGasPrice,
        newGasPrice
      );
      return Math.min(allowConstPrice, allowPercentagePrice);
    }
    if (maxUpdateConstraint.constant) {
      return this.getAllowedConstantGasPrice(
        maxUpdateConstraint.constant,
        oldGasPrice,
        newGasPrice
      );
    }
    if (maxUpdateConstraint.percentage) {
      return this.getAllowedPercentageGasPrice(
        maxUpdateConstraint.percentage,
        oldGasPrice,
        newGasPrice
      );
    }
    return newGasPrice;
  }

  getAllowedPercentageGasPrice(
    maxUpdatePercentage: number,
    oldGasPrice: number,
    newGasPrice: number
  ) {
    const gasDiff = newGasPrice - oldGasPrice;
    const gasDiffPercentage = Math.abs((100 * gasDiff) / oldGasPrice);
    const allowPercentagePrice =
      gasDiffPercentage > Math.abs(maxUpdatePercentage)
        ? oldGasPrice +
          (Math.sign(gasDiff) * Math.abs(maxUpdatePercentage) * oldGasPrice) /
            100
        : newGasPrice;
    return allowPercentagePrice;
  }

  getAllowedConstantGasPrice(
    maxUpdateConstant: number,
    oldGasPrice: number,
    newGasPrice: number
  ) {
    const gasDiff = newGasPrice - oldGasPrice;
    const absMaxUpdateConstant = Math.abs(maxUpdateConstant);
    const allowConstPrice =
      Math.abs(gasDiff) > absMaxUpdateConstant
        ? oldGasPrice + Math.sign(gasDiff) * absMaxUpdateConstant
        : newGasPrice;
    return allowConstPrice;
  }

  /**
   * Send a gas price update to the oracle contract, which Mangrove uses.
   * @param newGasPrice The new gas price.
   */
  async updateMangroveGasPrice(
    newGasPrice: number,
    oracleContract: typechain.MgvOracle,
    mangrove: Mangrove,
    txOverrides?: Overrides,
    contextInfo?: string
  ): Promise<void> {
    logger.debug(
      "updateMangroveGasPrice: Sending gas update to oracle contract.",
      {
        contextInfo,
      }
    );

    try {
      // Round to closest integer before converting to BigNumber
      const newGasPriceRounded = Math.round(newGasPrice);

      let ctx: Promise<ContractTransaction>;
      if (txOverrides === undefined) {
        ctx = oracleContract.setGasPrice(newGasPriceRounded);
      } else {
        ctx = oracleContract.setGasPrice(newGasPriceRounded, txOverrides);
      }

      await ctx.then((tx) => tx.wait());

      logger.info(
        `Succesfully sent Mangrove gas price update to oracle: ${newGasPriceRounded}.`,
        {
          contextInfo,
        }
      );
    } catch (e) {
      logger.error("setGasprice failed", {
        mangrove: mangrove,
        data: e,
        contextInfo,
      });
    }
  }
}

export default GasHelper;
