import { ethers } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";
import DevNode from "@mangrovedao/mangrove.js/dist/nodejs/util/devNode";
import { runScript } from "@mangrovedao/mangrove.js/dist/nodejs/util/forgeScript";

export async function deployMgvArbitrage(params: {
  provider: ethers.providers.JsonRpcProvider;
  url: string;
  mnemonic: eth.Mnemonic;
  coreDir: string;
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

  await runScript({
    url: params.url,
    provider: params.provider,
    env,
    script: "MgvArbitrageDeployer",
    mnemonic: params.mnemonic,
    pipe: false,
    stateCache: false,
    stateCacheFile: "",
  });
}
