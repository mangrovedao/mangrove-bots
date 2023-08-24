import { KandelStrategies, Mangrove, ethers } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";

import { deal } from "@mangrovedao/mangrove.js/dist/nodejs/util/deal.js";

// run this from the bot-arbitrage folder
const main = async () => {
  var parsed = require("dotenv").config();

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.LOCAL_NODE_URL
  );

  const LOCAL_MNEMONIC =
    "test test test test test test test test test test test junk";
  const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);

  const wallet = new ethers.Wallet(mnemonic.key(0), provider);

  const mgv = await Mangrove.connect({ signer: wallet });

  let market = await mgv.market({ base: "WETH", quote: "USDC" });

  await deal({
    url: provider.connection.url,
    provider: provider,
    token: market.base.address,
    account: wallet.address,
    amount: 10,
  });

  let approveTx = await market.base.approveMangrove();
  await approveTx.wait();
  approveTx = await market.quote.approveMangrove();
  await approveTx.wait();
  const tx = await market.sell({
    wants: 10,
    gives: 23000,
    fillWants: false,
  });
  const buyReceipt = await (await tx.response).wait();
  market = await mgv.market({ base: "WETH", quote: "USDC" });
  market.consoleAsks();
  market.consoleBids();
};

main();
