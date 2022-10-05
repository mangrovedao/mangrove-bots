// TODO do not distribute this in browser build
/* Run an anvil node, deploy a toy ENS contract, execute a script against it, gather its list of deployed contracts.
 
  This is a Mangrove.js utility for its internal tests. It can also be used in standalone.

  For rapid test cycles, use MGV_NODE_USE_CACHE=true, this will cache the result
  of deploying contracts in a file (see DUMPFILE below), then delete that file
  every time you want to invalidate the cache.
*/
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
import { ethers } from "ethers";
import * as eth from "../eth";
import { Mangrove } from "..";
import * as ToyENS from "./ToyENSCode";
import * as Multicall from "./MulticallCode";
import { default as nodeCleanup } from "node-cleanup";
import { getAllToyENSEntries } from "./toyEnsEntries";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 8545;
const LOCAL_MNEMONIC =
  "test test test test test test test test test test test junk";
const DUMPFILE = "mangroveJsNodeState.dump";

const CORE_DIR = path.parse(require.resolve("@mangrovedao/mangrove-core")).dir;

import yargs from "yargs";

// default first three default anvil accounts,
// TODO once --unlocked is added to forge script: use anvil's eth_accounts return value & remove Mnemonic class
const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);
const anvilAccounts = [0, 1, 2, 3, 4, 5].map((i) => ({
  address: mnemonic.address(i),
  key: mnemonic.key(i),
}));

const stateCache = path.resolve(`./${DUMPFILE}`);

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
    .option("caching", {
      describe: `Read/write ./${DUMPFILE} file when possible`,
      type: "boolean",
      default: false,
    })
    .option("deploy", {
      describe: "Do not spawn a new node",
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
      describe: "Fork URL",
      type: "string",
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
    .option("forge-cache", {
      describe: "Location of forge cache dir",
      type: "string",
    })
    .option("forge-out", {
      describe: "Location of forge out dir",
      type: "string",
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
const spawn = async (params: any) => {
  const chainIdArgs = "chainId" in params ? ["--chain-id", params.chainId] : [];
  const forkUrlArgs = "forkUrl" in params ? ["--fork-url", params.forkUrl] : [];
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
      .concat(forkUrlArgs),
    {
      cwd: CORE_DIR,
    }
  );

  anvil.stdout.setEncoding("utf8");
  anvil.on("close", (code) => {
    if (code !== null) {
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
const deploy = async (params: any) => {
  // setup Toy ENS if needed
  const toyENSCode = await params.provider.send("eth_getCode", [
    ToyENS.address,
    "latest",
  ]);
  if (toyENSCode === "0x") {
    // will use setCode, only way to know exactly where it will be no matter the mnemonic / deriv path / etc
    await params.provider.send("anvil_setCode", [ToyENS.address, ToyENS.code]);
  }

  // setup Toy ENS if needed
  const MulticallCode = await params.provider.send("eth_getCode", [
    Multicall.address,
    "latest",
  ]);
  if (MulticallCode === "0x") {
    // will use setCode, only way to know exactly where it will be no matter the mnemonic / deriv path / etc
    await params.provider.send("anvil_setCode", [
      Multicall.address,
      Multicall.code,
    ]);
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

  if (params.caching && fs.existsSync(stateCache)) {
    const state = fs.readFileSync(stateCache, "utf8");
    console.log("Loading state from cache...");
    await params.provider.send("anvil_loadState", [state]);
    console.log("...done.");
  } else {
    console.log(params);
    // await provider.send("anvil_setLoggingEnabled", [true]);
    const forgeScriptCmd = `forge script \
    --rpc-url http://${params.host}:${params.port} \
    --froms ${mnemonic.address(0)} \
    --private-key ${mnemonic.key(0)} \
    --broadcast -vvv \
    ${
      params.targetContract ? `--target-contract ${params.targetContract}` : ""
    } \
    ${params.forgeCache ? `--cache-path ${params.forgeCache}` : ""} \
    ${params.forgeOut ? `--out ${params.forgeOut}` : ""} \
    ${params.script}`;

    console.log("Running forge script:");
    console.log(forgeScriptCmd);

    // Warning: using exec & awaiting promise instead of using the simpler `execSync`
    // due to the following issue: when too many transactions are broadcast by the script,
    // the script seems never receives tx receipts back. Moving to `exec` solves the issue.
    // Using util.promisify on childProcess.exec recreates the issue.
    // Must be investigated further if it pops up again.
    const scriptPromise = new Promise((ok, ko) => {
      childProcess.exec(
        forgeScriptCmd,
        {
          encoding: "utf8",
          env: process.env,
          cwd: CORE_DIR,
        },
        (error, stdout, stderr) => {
          if (params.pipe || error) {
            console.error("forge cmd stdout:");
            console.error(stdout);
          }
          if (stderr.length > 0) {
            console.error("forge cmd stderr:");
            console.error(stderr);
          }
          if (error) {
            throw error;
          } else {
            ok(void 0);
          }
        }
      );
    });
    await scriptPromise;
    if (params.caching) {
      const stateData = await params.provider.send("anvil_dumpState", []);
      fs.writeFileSync(stateCache, stateData);
      console.log(`Wrote state cache to ${stateCache}`);
    }
  }
};

/* 
  Connect to a node. Optionally spawns it before connecting. Optionally runs
  initial deployment before connecting.
 */
const connect = async (params: any) => {
  let spawnInfo = { process: null, spawnEndedPromise: null };
  if (params.spawn) {
    spawnInfo = await spawn(params);
  }

  if (params.deploy) {
    await deploy(params);
  }

  // // convenience: try to populate global Mangrove instance if possible
  // disabled for now; may hide issues in normal use of Mangrove
  // if (require.main !== module) {
  //   // assume we will use mangrove.js soon
  //   await Mangrove.fetchAllAddresses(params.provider);
  // }

  /* Track node snapshot ids for easy snapshot/revert */
  let lastSnapshotId;

  return {
    ...spawnInfo,
    url: params.url,
    accounts: anvilAccounts,
    params,
    snapshot: async () =>
      (lastSnapshotId = await params.provider.send("evm_snapshot", [])),
    revert: (snapshotId = lastSnapshotId) =>
      params.provider.send("evm_revert", [snapshotId]),
  };
};

/* Generate initial parameters with yargs, add data, then return node actions. */
export const node = (argv: any, useYargs: boolean = true) => {
  const params: any = useYargs ? computeArgv(argv) : argv;

  params.url = `http://${params.host}:${params.port}`;
  params.provider = new ethers.providers.StaticJsonRpcProvider(params.url);

  return {
    connect() {
      return connect(params);
    },
    getAllToyENSEntries() {
      return getAllToyENSEntries(params.provider);
    },
  };
};

node.getAllToyENSEntries = getAllToyENSEntries;

export default node;

export { getAllToyENSEntries };

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
