/**
 * Integration tests of GasUpdater.ts.
 */
import { afterEach, before, beforeEach, describe, it } from "mocha";
import * as chai from "chai";
const { expect } = chai;
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { Mangrove, typechain } from "@mangrovedao/mangrove.js";
import {
  GasUpdater,
  MaxUpdateConstraint,
  OracleSourceConfiguration,
} from "../../src/GasUpdater";
import { config } from "../../src/util/config";
import { Signer, ethers } from "ethers";

describe("GasUpdater integration tests", () => {
  let gasUpdaterSigner: ethers.Wallet;
  let mgv: Mangrove;
  let mgvAdmin: Mangrove;

  beforeEach(async function () {
    gasUpdaterSigner = new ethers.Wallet(this.accounts.tester.key);
    // gasUpdaterSigner = await hre.ethers.getNamedSigner("gasUpdater");
    mgv = await Mangrove.connect({
      //provider: this.test?.parent?.parent?.ctx.provider,
      signer: gasUpdaterSigner,
      provider: this.server.url,
    });

    mgvAdmin = await Mangrove.connect({
      //provider: this.test?.parent?.parent?.ctx.provider,
      privateKey: this.accounts.deployer.key,
      provider: mgv.provider,
    });

    // Using the mangrove.js address functionallity, since there is no reason to recreate the significant infastructure for only one Contract.
    const oracleAddress = Mangrove.getAddress("MgvOracle", mgv.network.name);

    await mgvAdmin.contract.setMonitor(oracleAddress);
    await mgvAdmin.contract.setUseOracle(true);
    await mgvAdmin.contract.setNotify(true);

    const oracleContract = typechain.MgvOracle__factory.connect(
      oracleAddress,
      mgvAdmin.signer
    );
    await oracleContract.setGasPrice(0);
    await oracleContract.setMutator(gasUpdaterSigner.address);
  });

  afterEach(() => {
    mgv.disconnect();
  });

  it("should set the gas price in Mangrove, when GasUpdater is run", async function () {
    // read in configured test config - skipping gas oracle URL, as we use constant here
    const acceptableGasGapToOracle = config.get<number>(
      "acceptableGasGapToOracle"
    );

    const constantGasPrice = config.get<number>("constantOracleGasPrice");
    const maxUpdateConstraint = config.get<MaxUpdateConstraint>(
      "maxUpdateConstraint"
    );

    const overestimateOracleGasPriceByXPercent = 0;

    const oracleSourceConfiguration: OracleSourceConfiguration = {
      OracleGasPrice: constantGasPrice,
      _tag: "Constant",
    };

    // setup gasUpdater
    const gasUpdater = new GasUpdater(
      mgv,
      acceptableGasGapToOracle,
      oracleSourceConfiguration,
      overestimateOracleGasPriceByXPercent,
      maxUpdateConstraint
    );

    // Test
    await gasUpdater.checkSetGasprice();

    // Assert
    const globalConfig = await mgv.config();
    return Promise.all([
      expect(globalConfig.gasprice).to.equal(constantGasPrice),
    ]);
  });

  it("should not set the gas price in Mangrove, when the max update constraint constant is lower than the acceptableGasGap", async function () {
    // read in configured test config - skipping gas oracle URL, as we use constant here
    const acceptableGasGapToOracle = config.get<number>(
      "acceptableGasGapToOracle"
    );

    const constantGasPrice = config.get<number>("constantOracleGasPrice");

    const oracleSourceConfiguration: OracleSourceConfiguration = {
      OracleGasPrice: constantGasPrice,
      _tag: "Constant",
    };

    const overestimateOracleGasPriceByXPercent = 0;

    const maxUpdateConstraint: MaxUpdateConstraint = {
      constant: 0.4,
    };

    // setup gasUpdater
    const gasUpdater = new GasUpdater(
      mgv,
      acceptableGasGapToOracle,
      oracleSourceConfiguration,
      overestimateOracleGasPriceByXPercent,
      maxUpdateConstraint
    );

    // Test
    await gasUpdater.checkSetGasprice();

    // Assert
    const globalConfig = await mgv.config();
    return Promise.all([expect(globalConfig.gasprice).to.equal(0)]);
  });

  it("should not set the gas price in Mangrove, when the max update constraint percentage is lower than the acceptableGasGap", async function () {
    // read in configured test config - skipping gas oracle URL, as we use constant here
    const acceptableGasGapToOracle = config.get<number>(
      "acceptableGasGapToOracle"
    );

    const constantGasPrice = 0;

    const oracleSourceConfiguration: OracleSourceConfiguration = {
      OracleGasPrice: constantGasPrice,
      _tag: "Constant",
    };

    const maxUpdateConstraint: MaxUpdateConstraint = {
      percentage: 5,
    };

    const overestimateOracleGasPriceByXPercent = 0;

    // setup gasUpdater
    const gasUpdater = new GasUpdater(
      mgv,
      acceptableGasGapToOracle,
      oracleSourceConfiguration,
      overestimateOracleGasPriceByXPercent,
      maxUpdateConstraint
    );

    // Test
    await gasUpdater.checkSetGasprice();

    // Assert
    const globalConfig = await mgv.config();
    return Promise.all([expect(globalConfig.gasprice).to.equal(0)]);
  });

  it("should set the gas price with overestimate of 15% in Mangrove, when GasUpdater is run", async function () {
    // read in configured test config - skipping gas oracle URL, as we use constant here
    const acceptableGasGapToOracle = config.get<number>(
      "acceptableGasGapToOracle"
    );

    const constantGasPrice = config.get<number>("constantOracleGasPrice");
    const maxUpdateConstraint = config.get<MaxUpdateConstraint>(
      "maxUpdateConstraint"
    );

    const overestimateOracleGasPriceByXPercent = 0.15;

    const oracleSourceConfiguration: OracleSourceConfiguration = {
      OracleGasPrice: constantGasPrice,
      _tag: "Constant",
    };

    // setup gasUpdater
    const gasUpdater = new GasUpdater(
      mgv,
      acceptableGasGapToOracle,
      oracleSourceConfiguration,
      overestimateOracleGasPriceByXPercent,
      maxUpdateConstraint
    );

    // Test
    await gasUpdater.checkSetGasprice();

    // Assert
    const globalConfig = await mgv.config();
    return Promise.all([
      expect(globalConfig.gasprice).to.equal(
        Math.round(
          constantGasPrice * (1 + overestimateOracleGasPriceByXPercent)
        )
      ),
    ]);
  });
});
