import * as log from "../logging/logger";

import Mangrove, { Token } from "@mangrovedao/mangrove.js";

import { Provider } from "@ethersproject/providers";
import { IConfig } from "config";
import { CommonLogger } from "../logging/coreLogger";

type TokenConfig = {
  name: string;
};

export class BalanceUtils {
  #config: IConfig;
  logger: CommonLogger;
  constructor(config: IConfig) {
    this.#config = config;
    this.logger = log.logger(config);
  }
  public async logTokenBalances(
    mgv: Mangrove,
    address: string,
    tokenConfigs: TokenConfig[],
    contextInfo: string
  ): Promise<void> {
    const logPromises = [];
    for (const tokenConfig of tokenConfigs) {
      const token = await mgv.token(tokenConfig.name);
      logPromises.push(
        this.logTokenBalance(mgv.provider, address, token, contextInfo)
      );
    }

    await Promise.all(logPromises);
  }

  public async logTokenBalance(
    provider: Provider,
    address: string,
    token: Token,
    contextInfo: string
  ): Promise<void> {
    const balance = await token.contract.balanceOf(address);
    this.logger.info(`Balance: ${token.fromUnits(balance)}`, {
      contextInfo: contextInfo,
      token: token.id,
      data: {
        rawBalance: balance.toString(),
      },
    });
  }
}
