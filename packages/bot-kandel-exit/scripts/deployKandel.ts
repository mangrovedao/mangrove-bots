import { KandelStrategies, Mangrove, ethers } from "@mangrovedao/mangrove.js";
import * as eth from "@mangrovedao/mangrove.js/dist/nodejs/eth";

import { deal } from "@mangrovedao/mangrove.js/dist/nodejs/util/deal.js";
import { ContractReceipt } from "ethers";

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

  let market = await mgv.market({ base: "WETH", quote: "USDC" });

  const kandelStrats = new KandelStrategies(mgv);

  const { kandelPromise } = await kandelStrats.seeder.sow({
    market,
    liquiditySharing: false,
    onAave: false,
    gasprice: undefined,
    gaspriceFactor: 2,
  });

  const kandel = await kandelPromise;

  const distribution = kandelStrats.generator(market).calculateDistribution({
    priceParams: { minPrice: 1350, ratio: 1.1, pricePoints: 6 },
    midPrice: 1650,
    initialAskGives: 1,
  });

  await deal({
    url: provider.connection.url,
    provider: provider,
    token: market.base.address,
    account: wallet.address,
    amount: 10,
  });
  await deal({
    url: provider.connection.url,
    provider: provider,
    token: market.quote.address,
    account: wallet.address,
    amount: 20000,
  });

  const approvalTxs = await kandel.approveIfHigher(10, 20000);
  await approvalTxs[0]?.wait();
  await approvalTxs[1]?.wait();

  const txs = await kandel.populate({
    distribution,
    depositBaseAmount: 10,
    depositQuoteAmount: 20000,
  });

  const retractReciepts = await Promise.all(
    txs.reduce(
      (acc, tx) => [...acc, tx.wait()],
      [] as Promise<ContractReceipt>[]
    )
  );

  market = await mgv.market({ base: "WETH", quote: "USDC" });
  market.consoleAsks();
  market.consoleBids();
  console.log("kandelAddress", kandel.address);
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
};

main();
