import { ethers, Mangrove } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";
import DevNode from "@mangrovedao/mangrove.js/dist/nodejs/util/devNode";
import { runScript } from "@mangrovedao/mangrove.js/dist/nodejs/util/forgeScript";
import path from "path";
import { Token } from "@uniswap/sdk-core";
import { initPool } from "../../src/uniswap/initializePool";
import {
  UniswapV3Deployer,
  UniswapV3Contracts,
} from "../../src/uniswap/deployUniswapv3";
import { mintPosition } from "../../src/uniswap/deployPosition";
import { exec } from "shelljs";

const CORE_DIR = path.parse(require.resolve("../../mangrove-arbitrage/")).dir;

export async function deployMgvArbitrage(params: {
  mgv: Mangrove;
  provider: ethers.providers.JsonRpcProvider;
  url: string;
  mnemonic: eth.Mnemonic;
  setToyENSCodeIfAbsent: boolean;
  setMulticallCodeIfAbsent?: boolean;
}) {
  if (params.setMulticallCodeIfAbsent || params.setToyENSCodeIfAbsent) {
    const devNode = new DevNode(params.provider);
    if (params.setMulticallCodeIfAbsent) {
      await devNode.setMulticallCodeIfAbsent();
    }
    if (params.setToyENSCodeIfAbsent) {
      await devNode.setToyENSCodeIfAbsent();
    }
  }
  const env = {
    ...process.env,
    FOUNDRY_PROFILE: "arbitrage",
  };

  // console.log('test');
  // console.log(params.url);
  const cmd = `FOUNDRY_PROFILE=arbitrage forge script -vvvvvv --rpc-url http://localhost:8546 --froms ${params.mnemonic.address(
    0
  )} --private-key ${params.mnemonic.key(0)} --broadcast MgvArbitrageDeployer`;
  //
  //
  // console.log(cmd);
  //
  exec(cmd);
  //
  console.log(CORE_DIR);
  // await runScript({
  //   url: params.url,
  //   provider: params.provider,
  //   env,
  //   script: "MgvArbitrageDeployer",
  //   mnemonic: params.mnemonic,
  //   root: CORE_DIR,
  //   pipe: false,
  //   stateCache: false,
  //   stateCacheFile: "",
  // });

  console.log("done deploying");
  await deployUniswapAndMgvArbitrage(params.mnemonic, "http://localhost:8546");
}

async function deployUniswapAndMgvArbitrage(
  mnemonic: eth.Mnemonic,
  providerUrl: string
) {
  const provider = new ethers.providers.StaticJsonRpcProvider(providerUrl);
  console.log("deployUniswapAndMgvArbitrage");
  const mgv = await Mangrove.connect({
    privateKey: mnemonic.key(0),
    provider,
  });
  console.log("done deployUniswapAndMgvArbitrage");
  const weth = await mgv.token("WETH");
  const dai = await mgv.token("DAI");
  const usdc = await mgv.token("USDC");

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
    token2Value: "1600",
    poolFee: 3000,
  });
  await initPool({
    positionManager: uniContracts.positionManager,
    factory: uniContracts.factory,
    actor: signer,
    token1: weth,
    token1Value: "1600",
    token2: dai,
    token2Value: "1",
    poolFee: 3000,
  });

  await initPool({
    positionManager: uniContracts.positionManager,
    factory: uniContracts.factory,
    actor: signer,
    token1: usdc,
    token1Value: "1",
    token2: dai,
    token2Value: "1",
    poolFee: 3000,
  });

  mgv.setAddress("UniswapV3Router", uniContracts.router.address);
  mgv.setAddress("UniswapV3Factory", uniContracts.factory.address);
  mgv.setAddress(
    "UniswapV3PositionManager",
    uniContracts.positionManager.address
  );
  mgv.setAddress(
    "UniswapV3PositionDescriptor",
    uniContracts.positionDescriptor.address
  );
  mgv.setAddress("UniswapV3WETH9", uniContracts.weth9.address);

  await weth.contract.setMintLimit(weth.toUnits(10000));
  await dai.contract.setMintLimit(dai.toUnits(100000000));
  await usdc.contract.setMintLimit(usdc.toUnits(100000000));
  await weth.contract.mintTo(wallet.address, weth.toUnits(10000));
  await dai.contract.mintTo(wallet.address, dai.toUnits(16000000));
  await usdc.contract.mintTo(wallet.address, usdc.toUnits(16000000));

  await weth.contract.approve(
    uniContracts.positionManager.address,
    weth.toUnits(10000)
  );
  await dai.contract.approve(
    uniContracts.positionManager.address,
    dai.toUnits(16000000)
  );
  await usdc.contract.approve(
    uniContracts.positionManager.address,
    usdc.toUnits(16000000)
  );

  const uniWethToken = new Token(mgv.network.id!, weth.address, weth.decimals);
  const uniDaiToken = new Token(mgv.network.id!, dai.address, dai.decimals);
  const uniUsdcToken = new Token(mgv.network.id!, usdc.address, usdc.decimals);

  await mintPosition({
    token0: uniWethToken,
    token0Amount: 100,
    token1: uniDaiToken,
    token1Amount: 160000,
    poolFee: 3000,
    nfManagerAddress: uniContracts.positionManager.address,
    poolFactoryAddress: uniContracts.factory.address,
    provider: provider,
    signer: signer,
  });

  await mintPosition({
    token0: uniUsdcToken,
    token0Amount: 160000,
    token1: uniWethToken,
    token1Amount: 100,
    poolFee: 3000,
    nfManagerAddress: uniContracts.positionManager.address,
    poolFactoryAddress: uniContracts.factory.address,
    provider: provider,
    signer: signer,
  });

  await mintPosition({
    token0: new Token(mgv.network.id!, usdc.address, usdc.decimals),
    token0Amount: 1000000,
    token1: new Token(mgv.network.id!, dai.address, dai.decimals),
    token1Amount: 1000000,
    poolFee: 3000,
    nfManagerAddress: uniContracts.positionManager.address,
    poolFactoryAddress: uniContracts.factory.address,
    provider: provider,
    signer: signer,
  });
}
