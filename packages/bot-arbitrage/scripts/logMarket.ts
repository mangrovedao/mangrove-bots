import { Mangrove, ethers } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";

import { deal } from "@mangrovedao/mangrove.js/dist/nodejs/util/deal.js";
import { deployMgvArbitrage } from "../src/util/deployMgvAndMgvArbitrage";
import { activateTokensWithSigner } from "../src/util/ArbBotUtils";
import path from "path";

// run this from the bot-arbitrage folder
const main = async () => {
  var parsed = require("dotenv").config();

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.LOCAL_NODE_URL
  );

  const LOCAL_MNEMONIC =
    "test test test test test test test test test test test junk";
  const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);

  const wallet = new ethers.Wallet(mnemonic.key(1), provider);
  const mgv = await Mangrove.connect({ signer: wallet });
  const market = await mgv.market({ base: "WETH", quote: "DAI" });

  market.consoleAsks();
  market.consoleBids();
};

main();
