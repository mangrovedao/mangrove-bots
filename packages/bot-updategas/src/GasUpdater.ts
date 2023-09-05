import { Mangrove, typechain } from "@mangrovedao/mangrove.js";
import GasHelper from "./GasHelper";
import { logger } from "./util/logger";
import { TxUtils } from "@mangrovedao/bot-utils";

/**
 * A constant gas price oracle configuration.
 * @param OracleGasPrice A constant gasprice to be returned by this bot.
 */
export type ConstantOracleConfiguration = {
  readonly _tag: "Constant";
  readonly OracleGasPrice: number;
};

/**
 * A directive to use the Alchemy SDK for the chain that the bot is running for.
 */
export type AlchemySDKConfiguration = {
  readonly _tag: "AlchemySDK";
};

/**
 * An oracle source configuration - should be either a constant gas price
 * oracle or a directive to use the Alchemy SDK (for the chain that the bot
 * is running for).
 */
export type OracleSourceConfiguration =
  | ConstantOracleConfiguration
  | AlchemySDKConfiguration;

/**
 * A Max update constraint6, controls how much a gasprice can change in one transaction
 * This can either be controlled by a procentage and/or a constant value.
 * Percentage is given as a numnber: e.g. percentage: 80 == 80%
 * Constant is given as a number
 * Example:
 * If abs(newGasPrice-oldGasPrice)>oldGasPrice*80%,
 *  then oldGasPrice*80%+oldGasPrice
 *  else newGasPrice
 *
 *  If both constant and percentage is used, the minimum gas change of the 2 is used
 */
export type MaxUpdateConstraint = {
  readonly percentage?: number;
  readonly constant?: number;
};

/**
 * A GasUpdater bot, which queries an external oracle for gas prices, and sends
 * gas price updates to Mangrove, through a dedicated oracle contract.
 */
export class GasUpdater {
  #mangrove: Mangrove;
  #acceptableGasGapToOracle: number;
  #constantOracleGasPrice: number | undefined;
  #network = "";
  oracleContract: typechain.MgvOracle;
  gasHelper = new GasHelper();
  #maxUpdateConstraint?: MaxUpdateConstraint;
  #txUtils: TxUtils;

  /**
   * Constructs a GasUpdater bot.
   * @param mangrove A mangrove.js Mangrove object.
   * @param acceptableGasGapToOracle The allowed gap between the Mangrove gas
   * price and the external oracle gas price.
   * @param oracleSourceConfiguration The oracle source configuration - see type `OracleSourceConfiguration`.
   * @param maxUpdateConstraint The max update constraint - see type `MaxUpdateConstraint`.
   */
  constructor(
    mangrove: Mangrove,
    acceptableGasGapToOracle: number,
    oracleSourceConfiguration: OracleSourceConfiguration,
    private overEstimateOracleGasPriceByXPercent: number,
    maxUpdateConstraint?: MaxUpdateConstraint
  ) {
    this.#mangrove = mangrove;
    this.#acceptableGasGapToOracle = acceptableGasGapToOracle;
    this.#maxUpdateConstraint = maxUpdateConstraint;

    if (oracleSourceConfiguration._tag === "Constant") {
      this.#constantOracleGasPrice = oracleSourceConfiguration.OracleGasPrice;
    }

    // Using the mangrove.js address functionallity, since there is no reason to recreate the significant infastructure for only one Contract.
    const oracleAddress = Mangrove.getAddress(
      "MgvOracle",
      mangrove.network.name
    );
    this.oracleContract = typechain.MgvOracle__factory.connect(
      oracleAddress,
      mangrove.signer
    );

    this.#txUtils = new TxUtils(this.#mangrove.provider, logger);
  }

  /**
   * Checks an external oracle for an updated gas price, compares with the
   * current Mangrove gas price and, if deemed necessary, sends an updated
   * gas price to use to the oracle contract, which this bot works together
   * with.
   */
  public async checkSetGasprice(contextInfo?: string): Promise<void> {
    //NOTE: Possibly suitable protection against reentrancy

    logger.info(
      `Heartbeat - Checking whether Mangrove gas price needs updating...`,
      {
        contextInfo,
      }
    );

    const globalConfig = await this.#mangrove.config();

    logger.debug("Mangrove global config retrieved", {
      data: globalConfig,
      contextInfo,
    });

    const currentMangroveGasPrice = globalConfig.gasprice;

    let oracleGasPriceEstimate =
      await this.gasHelper.getGasPriceEstimateFromOracle({
        constantGasPrice: this.#constantOracleGasPrice,
        mangrove: this.#mangrove,
      });

    if (oracleGasPriceEstimate !== undefined) {
      oracleGasPriceEstimate *= 1 + this.overEstimateOracleGasPriceByXPercent;
      const [shouldUpdateGasPrice, newGasPrice] =
        this.gasHelper.shouldUpdateMangroveGasPrice(
          currentMangroveGasPrice,
          oracleGasPriceEstimate,
          this.#acceptableGasGapToOracle
        );

      if (shouldUpdateGasPrice) {
        logger.debug("Determined gas price update needed.", {
          data: { newGasPrice },
          contextInfo,
        });
        const allowedNewGasPrice =
          this.gasHelper.calculateNewGaspriceFromConstraints(
            newGasPrice,
            currentMangroveGasPrice,
            this.#maxUpdateConstraint
          );
        logger.debug("Determined new gas price from max constraints.", {
          data: { allowedNewGasPrice },
          contextInfo,
        });
        const [isAllowed] = this.gasHelper.shouldUpdateMangroveGasPrice(
          currentMangroveGasPrice,
          allowedNewGasPrice,
          this.#acceptableGasGapToOracle
        );
        if (!isAllowed) {
          logger.error(
            "The max update constraint is lowering/increasing the gas price, so that it is within the acceptableGasGap",
            { contextInfo }
          );
          return;
        }

        // check for fee overrides via txUtils
        const fees = await this.#txUtils.getFeeOverrides();
        let txOverrides;

        if (fees !== undefined) {
          txOverrides = {
            maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
            maxFeePerGas: fees.maxFeePerGas,
          };
          logger.debug("Overriding fees with:", {
            data: {
              txOverrides,
              maxPriorityFeePerGas_in_wei: fees.maxPriorityFeePerGas.toString(),
              maxFeePerGas_in_wei: fees.maxFeePerGas.toString(),
            },
            contextInfo,
          });
        }

        await this.gasHelper.updateMangroveGasPrice(
          allowedNewGasPrice,
          this.oracleContract,
          this.#mangrove,
          txOverrides,
          contextInfo
        );
      } else {
        logger.debug("Determined gas price update not needed.", {
          contextInfo,
        });
      }
    } else {
      const network = this.#network;
      logger.error(
        "Error getting gas price from oracle endpoint, skipping update. Oracle endpoint config:",
        {
          data: { network: network },
          contextInfo,
        }
      );
    }
  }
}
