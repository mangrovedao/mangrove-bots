// TODO do not distribute this in browser build
/* Run an anvil node, deploy a toy ENS contract, execute a script against it, gather its list of deployed contracts.
 
  This is a Mangrove.js utility for its internal tests. It can also be used in standalone.

  For rapid test cycles, use MGV_NODE_STATE_CACHE=true, this will cache the result
  of deploying contracts in a file (see DUMPFILE below), then delete that file
  every time you want to invalidate the cache.
*/
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
import { ethers } from "ethers";
import * as eth from "../eth";
import { default as nodeCleanup } from "node-cleanup";
import DevNode from "./devNode";
import { deal } from "./deal";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8545;
const LOCAL_MNEMONIC =
  "test test test test test test test test test test test junk";
const DUMPFILE = "mangroveJsNodeState.dump";

const CORE_DIR = path.parse(require.resolve("@mangrovedao/mangrove-core")).dir;

import yargs from "yargs";
import { JsonRpcProvider } from "@ethersproject/providers";
import { runScript } from "./forgeScript";

// default first three default anvil accounts,
// TODO once --unlocked is added to forge script: use anvil's eth_accounts return value & remove Mnemonic class
const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);
const anvilAccounts = [0, 1, 2, 3, 4, 5].map((i) => ({
  address: mnemonic.address(i),
  key: mnemonic.key(i),
}));

const stateCacheFile = path.resolve(`./${DUMPFILE}`);

export const builder = (yargs) => {
  return yargs
    .option("host", {
      describe: "The IP address the node will listen on",
      type: "string",
      default: DEFAULT_HOST,
    })
    .option("port", {
      describe: "Port number to listen on",
      type: "string",
      default: DEFAULT_PORT,
    })
    .option("spawn", {
      describe: "Do not spawn a new node",
      type: "boolean",
      default: true,
    })
    .option("state-cache", {
      describe: `Read/write ./${DUMPFILE} file when possible`,
      type: "boolean",
      default: false,
    })
    .option("deploy", {
      describe: "Create utility contracts at startup time",
      type: "boolean",
      default: true,
    })
    .option("script", {
      describe: "Path to forge script (contract or path or path:contract)",
      default: "MangroveJsDeploy",
      requiresArg: true,
      type: "string",
    })
    .option("fork-url", {
      describe: "Fork URL to be given to the newly deployed node",
      type: "string",
    })
    .option("fork-block-number", {
      describe: "Block number to fork from",
      type: "number",
    })
    .option("chain-id", {
      describe: "Chain id to use in node (default is anvil's default)",
      type: "number",
    })
    .option("pipe", {
      describe: "Pipe all internal anvil/script data to stdout",
      default: false,
      type: "boolean",
    })
    .option("set-multicall-code-if-absent", {
      describe: "Set Multicall code if absent",
      default: true,
      type: "boolean",
    })
    .option("set-toy-ens-code-if-absent", {
      alias: "setToyENSCodeIfAbsent",
      describe: "Set ToyENS code if absent",
      default: true,
      type: "boolean",
    })
    .env("MGV_NODE"); // allow env vars like MGV_NODE_DEPLOY=false
};

const computeArgv = (params: any, ignoreCmdLineArgs = false) => {
  // ignore command line if not main module, but still read from env vars
  // note: this changes yargs' default precedence, which is (high to low):
  // cmdline args -> env vars -> config(obj) -> defaults
  const cmdLineArgv = ignoreCmdLineArgs ? [] : process.argv.slice(2);
  return builder(yargs(cmdLineArgv))
    .usage("Run a test Mangrove deployment on a local node")
    .version(false)
    .config(params)
    .env("MGV_NODE") // allow env vars like MGV_NODE_DEPLOY=false
    .help().argv;
};

/* Spawn a test node */
type spawnParams = {
  chainId?: number;
  forkUrl?: number;
  forkBlockNumber?: number;
  host: string;
  port: number;
  pipe: boolean;
};

const spawn = async (params: spawnParams) => {
  const chainIdArgs = "chainId" in params ? ["--chain-id", params.chainId] : [];
  const forkUrlArgs = "forkUrl" in params ? ["--fork-url", params.forkUrl] : [];
  const blockNumberArgs =
    "forkBlockNumber" in params
      ? ["--fork-block-number", params.forkBlockNumber]
      : [];
  const anvil = childProcess.spawn(
    "anvil",
    [
      "--host",
      params.host,
      "--port",
      params.port,
      "--order",
      "fifo", // just mine as you receive
      "--mnemonic",
      LOCAL_MNEMONIC,
    ]
      .concat(chainIdArgs)
      .concat(forkUrlArgs)
      .concat(blockNumberArgs)
  );

  anvil.stdout.setEncoding("utf8");
  anvil.on("close", (code) => {
    if (code !== null && code != 0) {
      console.log(`anvil has closed with code ${code}`);
    }
  });

  anvil.stderr.on("data", (data) => {
    console.error(`anvil: stderr: ${data}`);
  });

  nodeCleanup((exitCode, signal) => {
    anvil.kill();
  });

  const spawnEndedPromise = new Promise<void>((ok) => {
    anvil.on("close", ok);
  });

  // wait a while for anvil to be ready, then bail
  const ready = new Promise<void>((ok, ko) => {
    let ready = null;
    setTimeout(() => {
      if (ready === null) {
        ready = false;
        ko("timeout");
      }
    }, 3000);
    anvil.stdout.on("data", (data) => {
      if (params.pipe) {
        console.log(data);
      }
      if (ready !== null) {
        return;
      }
      for (const line of data.split("\n")) {
        if (line.startsWith(`Listening on`)) {
          ready = true;
          ok();
          break;
        }
      }
    });
  });

  await ready;

  return {
    spawnEndedPromise,
    process: anvil,
  };
};

/* Run a deployment, populate Mangrove addresses */
type deployParams = {
  provider: JsonRpcProvider;
  stateCache: boolean;
  targetContract: string;
  script: string;
  url: string;
  pipe: boolean;
  setMulticallCodeIfAbsent: boolean;
  setToyENSCodeIfAbsent: boolean;
};
const deploy = async (params: deployParams) => {
  // convenience: deploy ToyENS/Multicall if not in place yet and not forbidden by params
  const devNode = new DevNode(params.provider);
  if (params.setToyENSCodeIfAbsent) {
    await devNode.setToyENSCodeIfAbsent();
  }

  if (params.setMulticallCodeIfAbsent) {
    await devNode.setMulticallCodeIfAbsent();
  }

  // test connectivity
  try {
    await params.provider.send("eth_chainId", []);
  } catch (err) {
    throw new Error(
      "Could not get chain id, is the anvil node running?\nOriginal error: \n" +
        err.toString()
    );
  }

  if (params.stateCache && fs.existsSync(stateCacheFile)) {
    const state = fs.readFileSync(stateCacheFile, "utf8");
    console.log("Loading state from cache...");
    await params.provider.send("anvil_loadState", [state]);
    console.log("...done.");
  } else {
    await runScript({
      url: params.url,
      pipe: params.pipe,
      script: params.script,
      provider: params.provider,
      targetContract: params.targetContract,
      coreDir: CORE_DIR,
      mnemonic,
      stateCache: params.stateCache,
      stateCacheFile,
    });
  }
};

/* 
  Connect to a node. Optionally spawns it before connecting. Optionally runs
  initial deployment before connecting.
 */
type preConnectParams = {
  spawn: boolean;
  deploy: boolean;
  url: string;
  provider: JsonRpcProvider;
};
type connectParams = preConnectParams &
  ({ spawn: false } | spawnParams) &
  deployParams;

const connect = async (params: connectParams) => {
  let spawnInfo = { process: null, spawnEndedPromise: null };
  if (params.spawn) {
    spawnInfo = await spawn(params);
  }

  const deployFn = () => {
    return deploy(params);
  };

  // deploy immediately if requested, otherwise return a deploy function
  if (params.deploy) {
    await deployFn();
  }

  // // convenience: try to populate global Mangrove instance if possible
  // disabled for now; may hide issues in normal use of Mangrove
  // if (require.main !== module) {
  //   // assume we will use mangrove.js soon
  //   await Mangrove.fetchAllAddresses(params.provider);
  // }

  /* Track node snapshot ids for easy snapshot/revert */
  let lastSnapshotId: string;
  let snapshotBlockNumber: number;

  return {
    ...spawnInfo,
    url: params.url,
    accounts: anvilAccounts,
    params,
    deploy: params.deploy ? undefined : deployFn,
    snapshot: async () => {
      lastSnapshotId = await params.provider.send("evm_snapshot", []);
      snapshotBlockNumber = await params.provider.getBlockNumber();
      return lastSnapshotId;
    },
    revert: async (snapshotId = lastSnapshotId) => {
      await params.provider.send("evm_revert", [snapshotId]);
      const blockNumberAfterRevert = await params.provider.getBlockNumber();
      if (blockNumberAfterRevert != snapshotBlockNumber) {
        throw Error(
          `evm_revert did not revert to expected block number ${snapshotBlockNumber} but to ${blockNumberAfterRevert}. Snapshots are deleted when reverting - did you take a new snapshot after the last revert?`
        );
      }
    },
    /* set ERC20 token balance of account at amount (display units) or internalAmount (internal units) */
    deal: async (dealParams: {
      token: string;
      account: string;
      amount?: number;
      internalAmount?: ethers.BigNumber;
    }) => {
      await deal({ ...dealParams, url: params.url, provider: params.provider });
    },
  };
};

/* Generate initial parameters with yargs, add data, then return node actions. */
export const node = (argv: any, useYargs: boolean = true) => {
  const params: any = useYargs ? computeArgv(argv) : argv;

  // if node is initialized with a URL, host/port
  if (typeof params.url === "undefined") {
    params.url = `http://${params.host}:${params.port}`;
  } else if (params.spawn) {
    throw new Error(
      "spawn and url params are incompatible. If you want to spawn a node, set host and port (not url); or keep url and set spawn to false."
    );
  }

  params.provider = new ethers.providers.StaticJsonRpcProvider(params.url);

  const devNode = new DevNode(params.provider);

  return {
    connect() {
      return connect(params);
    },
    watchAllToyENSEntries() {
      return devNode.watchAllToyENSEntries(params.provider);
    },
  };
};

export default node;

export const dealBuilder = (yargs) => {
  return yargs
    .option("host", {
      describe: "The node hostname -- must be a dev node (anvil, hardhat, ...)",
      type: "string",
      default: DEFAULT_HOST,
    })
    .option("port", {
      describe: "The node port -- must be a dev node (anvil, hardhat, ...)",
      type: "string",
      default: DEFAULT_PORT,
    })
    .option("token", {
      describe: "Address of the token",
      requiresArg: true,
      type: "string",
    })
    .option("account", {
      describe: "Address of the account to credit",
      requiresArg: true,
      type: "string",
    })
    .option("amount", {
      describe: "Number of tokens in display units.",
      requiresArg: true,
      type: "number",
    })
    .env("MGV_NODE"); // allow env vars like MGV_NODE_DEPLOY=false
};

/* If running as script, start anvil. */
if (require.main === module) {
  const main = async () => {
    const { spawnEndedPromise } = await node({
      pipe: true,
    }).connect();
    if (spawnEndedPromise) {
      console.log("Node ready.");
      await spawnEndedPromise;
    }
  };
  main()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
