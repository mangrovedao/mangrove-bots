import dotenvFlow from "dotenv-flow";
dotenvFlow.config();
import config from "config";
import {
  MaxUpdateConstraint,
  OracleSourceConfiguration,
  AlchemySDKConfiguration,
  ConstantOracleConfiguration,
} from "../GasUpdater";
import logger from "./logger";
if (!process.env["NODE_CONFIG_DIR"]) {
  process.env["NODE_CONFIG_DIR"] = __dirname + "/../../config/";
}

export default config;
export { config };
export type OracleConfig = {
  acceptableGasGapToOracle: number;
  runEveryXHours: number;
  oracleSourceConfiguration: OracleSourceConfiguration;
  overEstimateOracleGasPriceByXPercent: number;
};

export function readAndValidateConfig(): OracleConfig {
  let acceptableGasGapToOracle = 0;
  let runEveryXHours = 0;
  let overEstimateOracleGasPriceByXPercent = 0;

  const configErrors: string[] = [];
  // - acceptable gap
  if (config.has("acceptableGasGapToOracle")) {
    acceptableGasGapToOracle = config.get<number>("acceptableGasGapToOracle");
  } else {
    configErrors.push("'acceptableGasGapToOracle' missing");
  }

  // - run every X hours
  if (config.has("runEveryXHours")) {
    runEveryXHours = config.get<number>("runEveryXHours");
  } else {
    configErrors.push("'runEveryXHours' missing");
  }

  // - oracle source config
  let constantOracleGasPrice: number | undefined;
  let maxUpdateConstraint: MaxUpdateConstraint = {};

  if (config.has("constantOracleGasPrice")) {
    constantOracleGasPrice = config.get<number>("constantOracleGasPrice");
  }

  if (config.has("maxUpdateConstraint")) {
    maxUpdateConstraint = config.get<MaxUpdateConstraint>(
      "maxUpdateConstraint"
    );
  }

  if (
    maxUpdateConstraint?.constant &&
    acceptableGasGapToOracle > maxUpdateConstraint.constant
  ) {
    configErrors.push(
      "The max update constraint is lower than the acceptableGasGap. With this config, the gas price will never be updated"
    );
  }

  let oracleSourceConfiguration: OracleSourceConfiguration;
  if (constantOracleGasPrice != null) {
    // if constant price set, use that and ignore other gas price config
    logger.info(
      `Configuration for constant oracle gas price found. Using the configured value.`,
      { data: constantOracleGasPrice }
    );

    oracleSourceConfiguration = {
      OracleGasPrice: constantOracleGasPrice,
      _tag: "Constant",
    } as ConstantOracleConfiguration;
  } else {
    oracleSourceConfiguration = {} as AlchemySDKConfiguration;
    logger.info(
      `No configuration for constant oracle gas price found. Using Alchemy as oracle for gas prices.`
    );
  }

  overEstimateOracleGasPriceByXPercent = config.get<number>(
    "overEstimateOracleGasPriceByXPercent"
  );
  if (overEstimateOracleGasPriceByXPercent === undefined) {
    configErrors.push("overEstimateOracleGasPriceByXPercent is undefined");
  }

  if (configErrors.length > 0) {
    throw new Error(
      `Found following config errors: [${configErrors.join(", ")}]`
    );
  }

  return {
    acceptableGasGapToOracle: acceptableGasGapToOracle,
    oracleSourceConfiguration: oracleSourceConfiguration,
    runEveryXHours: runEveryXHours,
    overEstimateOracleGasPriceByXPercent,
  };
}
