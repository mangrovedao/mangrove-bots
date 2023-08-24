import Mangrove, { ethers } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";
import DevNode from "@mangrovedao/mangrove.js/dist/nodejs/util/devNode";
import {
  inputServerParamsType,
  node,
  nodeType,
  serverType,
} from "@mangrovedao/mangrove.js/dist/nodejs/util/node";
import {
  hookInfo,
  mochaHooks as mgvMochaHooks,
} from "@mangrovedao/mangrove.js/dist/nodejs/util/test/mochaHooks";
import * as dotenv from "dotenv";
import path from "path";
import { mintPosition } from "../../uniswap/deployPosition";
import {
  UniswapV3Contracts,
  UniswapV3Deployer,
} from "../../uniswap/deployUniswapv3";
import { initPool } from "../../uniswap/initializePool";

const LOCAL_MNEMONIC =
  "test test test test test test test test test test test junk";
const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);
const CORE_DIR = path.parse(
  require.resolve("../../../../../node_modules/@mangrovedao/mangrove-core")
).dir;

export const mochaHooks = {
  server: undefined as serverType,
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

    await mochaHooks.beforeAllImpl(serverParams, this);
    const provider = new ethers.providers.JsonRpcProvider(this.server.url);
    const devNode = new DevNode(provider);
    await devNode.setToyENSCodeIfAbsent();

    await deployUniswap(provider, this.server.url);

    await this.server.snapshot();
  },
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((cb) => setTimeout(cb, ms));
};

async function deployUniswap(
  provider: ethers.providers.JsonRpcProvider,
  serverUrl: string
) {
  const thisMgv = await Mangrove.connect({
    privateKey: mnemonic.key(0),
    provider: serverUrl,
  });
  const weth = await thisMgv.token("WETH");
  const usdc = await thisMgv.token("USDC");

  const wallet = new ethers.Wallet(mnemonic.key(0), provider);
  const signer = wallet.connect(provider);
  const uniContracts = (await UniswapV3Deployer.deploy(
    signer
  )) as UniswapV3Contracts;
  await initPool({
    positionManager: uniContracts.positionManager,
    factory: uniContracts.factory,
    actor: signer,
    token1: usdc,
    token1Value: "1",
    token2: weth,
    token2Value: "1639",
    poolFee: 3000,
  });

  thisMgv.setAddress("UniswapV3Router", uniContracts.router.address);
  thisMgv.setAddress("UniswapV3Factory", uniContracts.factory.address);
  thisMgv.setAddress(
    "UniswapV3PositionManager",
    uniContracts.positionManager.address
  );
  thisMgv.setAddress(
    "UniswapV3PositionDescriptor",
    uniContracts.positionDescriptor.address
  );
  thisMgv.setAddress("UniswapV3WETH9", uniContracts.weth9.address);

  await weth.contract.setMintLimit(weth.toUnits(1000000));
  await usdc.contract.setMintLimit(usdc.toUnits(10000000000));
  await weth.contract.mintTo(wallet.address, weth.toUnits(1000000));
  await usdc.contract.mintTo(wallet.address, usdc.toUnits(1600000000));

  await weth.contract.approve(
    uniContracts.positionManager.address,
    weth.toUnits(1000000)
  );
  await usdc.contract.approve(
    uniContracts.positionManager.address,
    usdc.toUnits(1600000000)
  );

  await mintPosition({
    token0: usdc,
    token0Amount: 160000000,
    token1: weth,
    token1Amount: 100000,
    poolFee: 3000,
    nfManagerAddress: uniContracts.positionManager.address,
    poolFactoryAddress: uniContracts.factory.address,
    provider: provider,
    signer: signer,
  });

  thisMgv.disconnect();
}
