import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { CommonLogger } from "../logging/coreLogger";
import axios from "axios";
import { ethers } from "ethers";

export interface Fees {
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
}

const PolygonOverrides = {
  gasstation: "https://gasstation.polygon.technology/v2",
  maxFeePerGas: BigNumber.from(34000000000),
  maxPriorityFeePerGas: BigNumber.from(40000000000),
};

export class TxUtils {
  private logger?: CommonLogger;
  private provider?: ethers.providers.Provider;

  constructor(provider?: ethers.providers.Provider, logger?: CommonLogger) {
    this.logger = logger;
    this.provider = provider;
  }

  public async getFeeOverrides(
    chainId?: number,
    contextInfo?: string
  ): Promise<Fees | undefined> {
    let maxFeePerGas;
    let maxPriorityFeePerGas;

    if (!chainId && !this.provider) {
      this.logger?.error(
        "No `chainId` given and no provider available to get chainId.",
        { contextInfo }
      );
      return undefined;
    }
    const chainIdToQuery =
      chainId || (await this.provider!.getNetwork()).chainId;

    // special case Polygon Mainnet, as required fees are underestimated by ethers.js - see https://github.com/ethers-io/ethers.js/issues/2828
    if (chainIdToQuery === 137) {
      // default values for fees - these are used if the gasstation is not reachable

      try {
        const { data } = await axios({
          method: "get",
          url: PolygonOverrides.gasstation,
        });

        maxFeePerGas = ethers.utils.parseUnits(
          Math.ceil(data.fast.maxFee).toString(),
          "gwei"
        );

        maxPriorityFeePerGas = ethers.utils.parseUnits(
          Math.ceil(data.fast.maxPriorityFee).toString(),
          "gwei"
        );

        this.logger?.debug("Fees via Polygon Gasstation", {
          data: { maxFeePerGas, maxPriorityFeePerGas },
          contextInfo,
        });

        return {
          maxFeePerGas: maxFeePerGas,
          maxPriorityFeePerGas: maxPriorityFeePerGas,
        };
      } catch {
        // fall back to defaults
        maxFeePerGas = PolygonOverrides.maxFeePerGas;
        maxPriorityFeePerGas = PolygonOverrides.maxPriorityFeePerGas;
        this.logger?.debug(
          "Error in contacting Polygon gasstation - falling back to default fees",
          { data: { maxFeePerGas, maxPriorityFeePerGas }, contextInfo }
        );
      }
    } else {
      this.logger?.debug("No overrides of fees registered needed.", {
        contextInfo,
      });
    }
    return undefined;
  }
}
