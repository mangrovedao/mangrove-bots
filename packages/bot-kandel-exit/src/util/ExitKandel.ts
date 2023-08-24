import Mangrove, { KandelInstance, Market } from "@mangrovedao/mangrove.js";
import { logger } from "./logger";
import { BigNumber, ContractReceipt } from "ethers";
import { Token } from "@uniswap/sdk-core";
import { createTrade } from "../uniswap/trade";
import { executeTrade } from "../uniswap/trade";
import { FeeAmount } from "@uniswap/v3-sdk";

export async function exitKandelIfNoBids(
  kandel: KandelInstance,
  market: Market,
  mgv: Mangrove
) {
  const offers = await kandel.getOffers();
  const hasBids = offers.reduce((acc, offer) => {
    if (offer.offerType == "bids") {
      const live = market.isLiveOffer(offer.offer);
      if (live) {
        return live;
      } else {
        return acc;
      }
    }
    return acc;
  }, false);
  const hasLiveKandelOffers =
    offers.filter((offer) => market.isLiveOffer(offer.offer)).length > 0;
  logger.info(`hasBids  ${hasBids}`);
  logger.info(`hasLiveKandelOffers  ${hasLiveKandelOffers}`);

  if (!hasBids && hasLiveKandelOffers) {
    const signerAdderss = await mgv.signer.getAddress();
    const retractTx = await kandel.retractAndWithdraw();
    const retractReciepts = await Promise.all(
      retractTx.reduce(
        (acc, tx) => [...acc, tx.wait()],
        [] as Promise<ContractReceipt>[]
      )
    );
    const baseBalance = await kandel.getBase().balanceOf(signerAdderss);
    const factoryAddress = mgv.getAddress("UniswapV3Factory");

    const swapRouterAddress = mgv.getAddress("UniswapV3Router");
    const tokenTrade = await createTrade(
      factoryAddress,
      market.base,
      baseBalance.toNumber(),
      market.quote,
      FeeAmount.MEDIUM,
      mgv.provider
    );
    const executeReceipt = await executeTrade(
      market.base,
      tokenTrade,
      swapRouterAddress,
      mgv.signer,
      mgv.provider
    );
    logger.info("Kandel has been exited and base swapped to quote");
    return [...retractReciepts, executeReceipt];
  }
}
