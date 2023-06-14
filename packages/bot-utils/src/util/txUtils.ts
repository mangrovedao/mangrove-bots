import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { CommonLogger } from "../logging/coreLogger";
import axios from "axios";
import { ethers } from "ethers";

export interface Fees {
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
}

export class TxUtils {
  private logger: CommonLogger;
  private provider: ethers.providers.Provider;

  constructor(provider: ethers.providers.Provider, logger: CommonLogger) {
    this.logger = logger;
    this.provider = provider;
  }

  public async getFeeOverrides(): Promise<Fees | void> {
    let maxFeePerGas;
    let maxPriorityFeePerGas;

    const chainId = (await this.provider.getNetwork()).chainId;

    // special case Polygon Mainnet, as required fees are underestimated by ethers.js - see https://github.com/ethers-io/ethers.js/issues/2828
    if (chainId === 137) {
      // default values for fees - these are used if the gasstation is not reachable
      const MaxFeePerGasDefault = BigNumber.from(34000000000);
      const MaxPriorityFeePerGasDefault = BigNumber.from(40000000000);

      try {
        const { data } = await axios({
          method: "get",
          url: "https://gasstation-mainnet.matic.network/v2",
        });

        maxFeePerGas = ethers.utils.parseUnits(
          Math.ceil(data.fast.maxFee).toString(),
          "gwei"
        );

        maxPriorityFeePerGas = ethers.utils.parseUnits(
          Math.ceil(data.fast.maxPriorityFee).toString(),
          "gwei"
        );

        this.logger.debug("Fees via Polygon Gasstation", {
          data: { maxFeePerGas, maxPriorityFeePerGas },
        });

        return {
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas,
        };
      } catch {
        // fall back to defaults
        maxFeePerGas = MaxFeePerGasDefault;
        maxPriorityFeePerGas = MaxPriorityFeePerGasDefault;
        this.logger.debug(
          "Error in contacting Polygon gasstation - falling back to default fees",
          { data: { maxFeePerGas, maxPriorityFeePerGas } }
        );
      }
    } else {
      this.logger.debug("No overrides of fees registered needed.");
    }
  }
}
