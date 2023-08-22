import { ErrorWithData } from "@mangrovedao/bot-utils";
import { IConfig } from "config";
import { configUtils as botConfigUtils } from "@mangrovedao/bot-utils";
import { MarketConfig } from "./Configs";

type KandelExitConfig = {
  kandelAddress: string;
  runEveryXMinutes: number;
  market: MarketConfig;
};

export class ConfigUtils extends botConfigUtils.ConfigUtils {
  #config: IConfig;
  constructor(config: IConfig) {
    super(config);
    this.#config = config;
  }

  public getKandelAddress(): string {
    if (!this.#config.has("kandelAddress")) {
      throw new Error("No kandel address have been configured");
    }
    return this.#config.get<string>("kandelAddress");
  }

  public getMarketConfigOrThrow<MarketConfig>(): MarketConfig {
    if (!this.#config.has("market")) {
      throw new Error("No market have been configured");
    }
    const marketConfig = this.#config.get<MarketConfig>("market");
    return marketConfig;
  }

  public getAndValidateKandelExitConfig(): KandelExitConfig {
    let runEveryXMinutes = -1;
    const configErrors: string[] = [];

    let kandelAddress = this.getKandelAddress();

    if (this.#config.has("runEveryXMinutes")) {
      runEveryXMinutes = this.#config.get<number>("runEveryXMinutes");
      if (typeof runEveryXMinutes !== "number") {
        configErrors.push(
          `'runEveryXMinutes' must be a number - given type: ${typeof runEveryXMinutes}`
        );
      }
    } else {
      configErrors.push("'runEveryXMinutes' missing");
    }

    const market = this.getMarketConfigOrThrow<MarketConfig>();

    if (configErrors.length > 0) {
      throw new Error(
        `Found the following config errors: [${configErrors.join(", ")}]`
      );
    }

    return { kandelAddress, market, runEveryXMinutes };
  }
}
