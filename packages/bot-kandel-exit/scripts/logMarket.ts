import {
  KandelInstance,
  KandelStrategies,
  Mangrove,
  ethers,
} from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";

import { deal } from "@mangrovedao/mangrove.js/dist/nodejs/util/deal.js";
import path from "path";

import { ConfigUtils } from "../src/util/configUtils";
import config from "../src/util/config";
const configUtil = new ConfigUtils(config);

// run this from the bot-arbitrage folder
const main = async () => {
  var parsed = require("dotenv").config();
  const botConfig = configUtil.getAndValidateKandelExitConfig();
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.LOCAL_NODE_URL
  );

  const LOCAL_MNEMONIC =
    "test test test test test test test test test test test junk";
  const mnemonic = new eth.Mnemonic(LOCAL_MNEMONIC);

  const wallet = new ethers.Wallet(mnemonic.key(1), provider);
  const mgv = await Mangrove.connect({ signer: wallet });
  const market = await mgv.market({ base: "WETH", quote: "USDC" });

  const kandelStrategies = new KandelStrategies(mgv);
  const kandel = await KandelInstance.create({
    address: botConfig.kandelAddress,
    signer: wallet,
    market,
  });
  const kandelBaseBalance = await market.base.balanceOf(kandel.address);
  const kandelQuoteBalance = await market.quote.balanceOf(kandel.address);
  const makerBaseBalance = await market.base.balanceOf(wallet.address);
  const makerQuoteBalance = await market.quote.balanceOf(wallet.address);
  const kandelOffersLive = (await kandel.getOffers()).filter((offer) =>
    market.isLiveOffer(offer.offer)
  );
  console.log("kandelBaseBalance", kandelBaseBalance.toString());
  console.log("kandelQuoteBalance", kandelQuoteBalance.toString());
  console.log("makerBaseBalance", makerBaseBalance.toString());
  console.log("makerQuoteBalance", makerQuoteBalance.toString());
  console.log("kandelOffersLive", kandelOffersLive.length);

  market.consoleAsks();
  market.consoleBids();
};

main();
