import Mangrove, { ethers } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";
import DevNode from "@mangrovedao/mangrove.js/dist/nodejs/util/devNode";
import {
  node,
  nodeType,
  inputServerParamsType,
  serverType,
} from "@mangrovedao/mangrove.js/dist/nodejs/util/node";
import {
  hookInfo,
  mochaHooks as mgvMochaHooks,
} from "@mangrovedao/mangrove.js/dist/nodejs/util/test/mochaHooks";
import * as dotenv from "dotenv";
import path from "path";
import {
  UniswapV3Contracts,
  UniswapV3Deployer,
} from "../../src/uniswap/deployUniswapv3";
import { mintPosition } from "../../src/uniswap/deployPosition";
import { Token } from "@uniswap/sdk-core";
import { initPool } from "../../src/uniswap/initializePool";

const LOCAL_MNEMONIC =
  "test test test test test test test test test test test junk";
const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);
const CORE_DIR = path.parse(require.resolve("../../mangrove-arbitrage/")).dir;

export const mochaHooks = {
  server: undefined as unknown as serverType,
  async beforeAllImpl(
    args: inputServerParamsType,
    hook: hookInfo & { node: nodeType }
  ) {
    hook.node = await node(args);
    hook.server = await hook.node.connect();
    hook.accounts = {
      deployer: hook.server.accounts[0],
      maker: hook.server.accounts[1],
      cleaner: hook.server.accounts[2],
      tester: hook.server.accounts[3],
      arbitrager: hook.server.accounts[4],
    };
  },

  async beforeEach() {
    await mgvMochaHooks.beforeEachImpl(this);
  },

  async afterAll() {
    await mgvMochaHooks.afterAllImpl(this);
  },

  async beforeAll() {
    dotenv.config();
    const serverParams = {
      host: "127.0.0.1",
      port: 8546, // use 8546 for the actual node, but let all connections go through proxies to be able to cut the connection before snapshot revert.
      pipe: false,
      script: "MangroveJsDeploy",
      deploy: true,
      setMulticallCodeIfAbsent: false, // mangrove.js is supposed to work against servers that only have ToyENS deployed but not Multicall, so we don't deploy Multicall in tests. However mangrove.js needs ToyENS so we let the node ensure it's there.
    };

    await mochaHooks.beforeAllImpl(serverParams, this as any);
    const provider = new ethers.providers.JsonRpcProvider(this.server.url);
    const devNode = new DevNode(provider);
    await devNode.setToyENSCodeIfAbsent();

    await this.server.snapshot();
  },
};
