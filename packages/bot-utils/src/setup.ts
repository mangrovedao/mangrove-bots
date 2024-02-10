import { CommonLogger } from "./logging/coreLogger";

import Mangrove from "@mangrovedao/mangrove.js";
import { BlockManager } from "@mangrovedao/reliable-event-subscriber";
import { IConfig } from "config";
import http from "http";
import { ToadScheduler } from "toad-scheduler";
import * as log from "./logging/logger";
import {
  StaticJsonRpcProvider,
  WebSocketProvider,
} from "@ethersproject/providers";
import { getDefaultProvider } from "ethers";
import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import { NonceManager } from "@ethersproject/experimental";
import { ConfigUtils } from "./util/configUtils";

import express, { Express, Request, Response } from "express";

import { readdirSync, readFileSync } from "fs";
import path, { join } from "path";
import { checkFreshness } from "./checks";

const CHECK_FRESHNESS_INTERVAL_MS = 1000 * 60;

export enum ExitCode {
  Normal = 0,
  UncaughtException = 1,
  UnhandledRejection = 2,
  ExceptionInMain = 3,
  MangroveIsKilled = 4,
  ErrorInAsyncTask = 5,
}

export type BotConfig = {
  markets: [string, string, number, string][];
  runEveryXMinutes: number;
};

export type TokenConfig = {
  name: string;
  targetAllowance: number;
};

// ISO 8601
export type timestamp = string;

export type LatestMarketActivity = {
  base: string;
  quote: string;
  latestBlock?: BlockManager.Block;
  lastActive?: timestamp;
};

// The type of data that the /latestActivity endpoint will serve
export type LatestActivity = {
  latestBlock?: BlockManager.Block;
  lastActive?: timestamp;
  markets?: LatestMarketActivity[];
};

// Get name and version of all installed packages
// 1. Get a list of all directories in the `node_modules` folder
const nodeModulesDir = "../../node_modules";
const packageOrScopeNames = readdirSync(nodeModulesDir).filter(
  (name) => !name.startsWith(".")
); // Exclude hidden directories

// 2. Function to read the package.json file and extract name and version
function getPackageInfo(packagePath: string): {
  name: string;
  version: string;
} {
  const packageFile = readFileSync(packagePath, "utf8");
  const { name, version } = JSON.parse(packageFile);
  return { name, version };
}

// Loop through each package or scope and extract the package info
const packageInfos = packageOrScopeNames.flatMap((packageOrScopeName) => {
  if (packageOrScopeName.startsWith("@")) {
    // Scoped package
    const scopeDir = join(nodeModulesDir, packageOrScopeName);
    const scopedPackageNames = readdirSync(scopeDir).filter(
      (name) => !name.startsWith(".")
    ); // Exclude hidden directories

    return scopedPackageNames.map((scopedPackageName) => {
      const packageDir = join(scopeDir, scopedPackageName);
      const packagePath = join(packageDir, "package.json");
      return getPackageInfo(packagePath);
    });
  } else {
    // Unscoped package
    const packageDir = join(nodeModulesDir, packageOrScopeName);
    const packagePath = join(packageDir, "package.json");
    return getPackageInfo(packagePath);
  }
});

export class Setup {
  #config: IConfig;
  logger: CommonLogger;
  configUtils: ConfigUtils;
  server?: http.Server;
  latestActivity: LatestActivity;

  constructor(config: IConfig) {
    this.#config = config;
    this.logger = log.logger(config);
    this.configUtils = new ConfigUtils(config);
    this.latestActivity = {
      latestBlock: undefined,
      lastActive: undefined,
    };
  }

  public async exitIfMangroveIsKilled(
    mgv: Mangrove,
    contextInfo: string,
    scheduler?: ToadScheduler
  ): Promise<void> {
    const globalConfig = await mgv.readerContract.globalUnpacked();
    // FIXME maybe this should be a property/method on Mangrove.
    if (globalConfig.dead) {
      this.logger.warn("Mangrove is dead, stopping the bot", { contextInfo });
      this.stopAndExit(ExitCode.MangroveIsKilled, scheduler);
    }
  }

  public stopAndExit(exitStatusCode: number, scheduler?: ToadScheduler) {
    // Stop gracefully
    this.logger.info("Stopping and exiting", {
      data: { exitCode: exitStatusCode },
    });
    process.exitCode = exitStatusCode;
    scheduler?.stop();
    this.server?.close();
  }

  public async startBot(
    name: string,
    botFunction: (
      mgv: Mangrove,
      signer: Wallet,
      provider: BaseProvider
    ) => Promise<void>,
    scheduler?: ToadScheduler,
    shouldNotListenToNewEvents = false
  ) {
    this.logger.info(`Starting ${name}...`, { contextInfo: "init" });

    // Exiting on unhandled rejections and exceptions allows the app platform to restart the bot
    process.on("unhandledRejection", (reason) => {
      this.logger.error("Unhandled Rejection", { data: reason });
      this.stopAndExit(ExitCode.UnhandledRejection, scheduler);
    });

    process.on("uncaughtException", (err) => {
      this.logger.error(`Uncaught Exception: ${err.message}`);
      this.stopAndExit(ExitCode.UncaughtException, scheduler);
    });

    const providerHttpUrl = process.env["RPC_HTTP_URL"];
    const providerWsUrl = process.env["RPC_WS_URL"];
    if (!providerWsUrl) {
      throw new Error("No URL for a node has been provided in RPC_WS_URL");
    }
    if (!providerHttpUrl) {
      throw new Error("No URL for a node has been provided in RPC_HTTP_URL");
    }
    const privateKey = process.env["PRIVATE_KEY"];
    if (!privateKey) {
      throw new Error("No private key provided in PRIVATE_KEY");
    }

    // In case of a http provider we do not want to query chain id, so we use the Static provider; otherwise, we use the default WebSocketProvider.
    const defaultProvider = getDefaultProvider(providerHttpUrl);
    const provider =
      defaultProvider instanceof WebSocketProvider
        ? defaultProvider
        : new StaticJsonRpcProvider(providerHttpUrl);
    const signer = new Wallet(privateKey, provider);
    const nonceManager = new NonceManager(signer);
    const providerType = this.configUtils.getProviderType();
    const mgv = await Mangrove.connect({
      signer: nonceManager,
      providerWsUrl: providerType == "http" ? undefined : providerWsUrl,
      shouldNotListenToNewEvents: shouldNotListenToNewEvents,
    });
    this.importLocalAddresses(mgv);

    if (!shouldNotListenToNewEvents) {
      setInterval(
        () => checkFreshness(this.logger, mgv),
        CHECK_FRESHNESS_INTERVAL_MS
      );
    }

    if (providerType == "http") {
      this.logger.warn(
        `Using HTTP provider, this is not recommended for production`
      );
    }
    this.logger.info("Connected to Mangrove", {
      contextInfo: "init",
      data: {
        network: mgv.network,
        addresses: Mangrove.getAllAddresses(mgv.network.name),
      },
    });

    await this.exitIfMangroveIsKilled(mgv, "init", scheduler);

    await botFunction(mgv, signer, provider);

    this.server = this.createServer(mgv);
  }

  importLocalAddresses(mgv: Mangrove) {
    const networkName = mgv.network.name;
    const addressesPath = path.resolve(
      process.cwd(),
      "src",
      "constants",
      "addresses.json"
    );
    try {
      const addressesByNetwork = JSON.parse(
        readFileSync(addressesPath, "utf8")
      ) as { [networkName: string]: { [name: string]: string } };

      const addresses = addressesByNetwork[networkName];
      if (!addresses) {
        this.logger.info(`No local addresses found for network ${networkName}`);
      }
      for (const [name, address] of Object.entries(addresses)) {
        try {
          const address = mgv.getAddress(name);
          this.logger.warn(`Address ${name} already set to ${address}`);
        } catch (e) {
          mgv.setAddress(name, address);
        }
      }
    } catch (e) {
      this.logger.debug(e);
      this.logger.info(`Not able to read local addresses on ${networkName}`);
    }
  }

  // Starts an Express server which serves environment information
  createServer(mgv: Mangrove): http.Server {
    const app: Express = express();
    const port = process.env.PORT || 8080;

    app.get("/environmentInformation.json", (req: Request, res: Response) => {
      res.json({
        dependencies: packageInfos,
        network: mgv.network,
        addresses: Mangrove.getAllAddresses(mgv.network.name),
      });
    });

    app.get("/latestActivity", (req: Request, res: Response) => {
      res.json(this.latestActivity);
    });

    return app.listen(port, () => {
      this.logger.info(
        `[server]: Server is running at http://localhost:${port}`
      );
    });
  }
}
