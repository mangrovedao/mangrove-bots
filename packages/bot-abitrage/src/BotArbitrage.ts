import { logger } from "./util/logger";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { WebSocketProvider } from "@ethersproject/providers";

type SolSnipeOrder = {
  outbound_tkn: string;
  inbound_tkn: string;
  targets: [BigNumberish, BigNumberish, BigNumberish, BigNumberish][];
  fillWants: boolean;
};

const TEN_MIN_MILLISECOND = 10 * 60 * 1000;
const MAX_GAS_REQ = BigNumber.from(2).pow(256).sub(1);
//Arbitrary, estimateGas fails on hardhat
const MAX_GAS_LIMIT = 2000000;

export class BotArbitrage {
  #mgvContract: ethers.Contract;
  #multiOrderProxyContract: ethers.Contract;
  #blocksSubscriber: WebSocketProvider;
  #outboundTokenAddress: string;
  #outboundTokenSymbol: string;
  #inboundTokenAddress: string;
  #inboundTokenSymbol: string;
  #askIdsBlacklist: BigNumber[];
  #bidIdsBlacklist: BigNumber[];
  #lastBlockRun: number;
  #lastBlockNumber: number;
  #alivePollingRunning: boolean;
  /**
   * Constructs the bot.
   * @param mgvContract Mangrove ethers.js contract object
   * @param multiOrderProxyContract Multi order ethers.js contract object
   * @param blocksSubscriber WS provider to subscribe to the blockchain
   * @param outboundTokenAddress base address
   * @param inboundTokenAddress quote address
   */
  constructor(
    mgvContract: ethers.Contract,
    multiOrderProxyContract: ethers.Contract,
    blocksSubscriber: WebSocketProvider,
    outboundTokenAddress: string,
    outboundTokenSymbol: string,
    inboundTokenAddress: string,
    inboundTokenSymbol: string
  ) {
    this.#mgvContract = mgvContract;
    this.#multiOrderProxyContract = multiOrderProxyContract;
    this.#blocksSubscriber = blocksSubscriber;
    this.#outboundTokenAddress = outboundTokenAddress;
    this.#outboundTokenSymbol = outboundTokenSymbol;
    this.#inboundTokenAddress = inboundTokenAddress;
    this.#inboundTokenSymbol = inboundTokenSymbol;
    this.#askIdsBlacklist = [];
    this.#bidIdsBlacklist = [];
    this.#lastBlockRun = 0;
    this.#lastBlockNumber = 0;
    this.#alivePollingRunning = false;
  }

  public async start(): Promise<void> {
    logger.info("Started arbitrage bot", {
      base: this.#outboundTokenSymbol,
      quote: this.#inboundTokenSymbol,
    });

    this.#blocksSubscriber.on("block", async () => {
      const blockNumber = await this.#blocksSubscriber.getBlockNumber();
      const [bestAskId, bestBidId, bestAsk, bestBid] =
        await this.#getOpportunity();

      if (
        !(
          bestAskId.eq(BigNumber.from(-1)) && bestBidId.eq(BigNumber.from(-1))
        ) &&
        !(
          this.#askIdsBlacklist.includes(bestAskId) ||
          this.#bidIdsBlacklist.includes(bestBidId)
        ) &&
        //Arbitrary solution to bypass the 2s blocktime issue where
        //the bot would identify twice the same opportunity and try
        //to execute it twice.
        blockNumber - this.#lastBlockRun > 1
      ) {
        this.#lastBlockRun = blockNumber;
        this.#blackListOffers(
          BigNumber.from(bestAskId),
          BigNumber.from(bestBidId)
        );

        this.#logBlacklist(blockNumber, 0);

        this.#logOpportunity(blockNumber, bestAsk, bestBid);

        const [buyOrder, sellOrder] = this.#createArbOrders(
          bestAskId,
          bestBidId,
          bestAsk,
          bestBid
        );

        const tx = await (
          await this.#multiOrderProxyContract.twoOrders(buyOrder, sellOrder, {
            gasLimit: MAX_GAS_LIMIT,
          })
        ).wait();

        this.#logArbitrage(tx);

        this.#unBlackListOffers(bestAskId, bestBidId);

        this.#logBlacklist(blockNumber, 1);
      }
    });

    this.#alivePollingRunning = true;
    this.#pollIsAlive(this.#blocksSubscriber);
  }

  #logBlacklist(blockNumber: number, addOrRm: Number) {
    if (addOrRm == 0) {
      //something added to blacklist
      logger.debug(`Ask blacklist addition at block ${blockNumber}`, {
        data: this.#askIdsBlacklist,
      });
      logger.debug(`Bid blacklist addition at block ${blockNumber}`, {
        data: this.#bidIdsBlacklist,
      });
    }
    if (addOrRm == 1) {
      //something removed from blacklist
      logger.debug(`Ask blacklist removal at block ${blockNumber}`, {
        data: this.#askIdsBlacklist,
      });
      logger.debug(`Bid blacklist removal at block ${blockNumber}`, {
        data: this.#bidIdsBlacklist,
      });
    }
  }

  #blackListOffers(askId: BigNumber, bidId: BigNumber) {
    if (this.#askIdsBlacklist.includes(askId)) {
      logger.warn(`askId:${askId} already blacklisted. Should not happen.`);
      return;
    }
    if (this.#bidIdsBlacklist.includes(bidId)) {
      logger.warn(`bidId:${bidId} already blacklisted. Should not happen.`);
      return;
    }
    this.#askIdsBlacklist.push(askId);
    this.#bidIdsBlacklist.push(bidId);
  }

  #unBlackListOffers(askId: BigNumber, bidId: BigNumber) {
    const askIndex = this.#askIdsBlacklist.indexOf(askId);
    const bidIndex = this.#bidIdsBlacklist.indexOf(bidId);

    if (askIndex == -1) {
      logger.warn(
        `Trying to unblackList askId:${askId} that is not blacklisted. Should not happen`
      );
      return;
    }
    if (bidIndex == -1) {
      logger.warn(
        `Trying to unblackList bidId:${bidId} that is not blacklisted. Should not happen`
      );
      return;
    }
    this.#askIdsBlacklist.splice(askIndex, 1);
    this.#bidIdsBlacklist.splice(bidIndex, 1);
  }

  async #getOpportunity(): Promise<
    | [BigNumber, BigNumber, object, object]
    | [BigNumber, BigNumber, BigNumber, BigNumber]
  > {
    const [bestAskId, bestBidId] = await Promise.all([
      this.#mgvContract.best(
        this.#outboundTokenAddress,
        this.#inboundTokenAddress
      ),
      this.#mgvContract.best(
        this.#inboundTokenAddress,
        this.#outboundTokenAddress
      ),
    ]);

    let [bestAsk, bestBid] = await Promise.all([
      this.#mgvContract.offerInfo(
        this.#outboundTokenAddress,
        this.#inboundTokenAddress,
        bestAskId
      ),
      this.#mgvContract.offerInfo(
        this.#inboundTokenAddress,
        this.#outboundTokenAddress,
        bestBidId
      ),
    ]);

    bestAsk = bestAsk.offer;
    bestBid = bestBid.offer;

    if (
      BigNumber.from(bestAsk.gives).eq(0) ||
      BigNumber.from(bestBid.wants).eq(0) ||
      BigNumber.from(bestAsk.wants).eq(0) ||
      BigNumber.from(bestBid.gives).eq(0)
    ) {
      logger.warn("Got null price", {
        base: this.#outboundTokenAddress,
        quote: this.#inboundTokenAddress,
        data: `askId:${bestAskId} askGives:${bestAsk.gives} askWants:${bestAsk.wants}\nbidId:${bestBidId} bidGives:${bestBid.gives} bidWants:${bestBid.wants}`,
      });
      return [
        BigNumber.from(-1),
        BigNumber.from(-1),
        BigNumber.from(-1),
        BigNumber.from(-1),
      ];
    }
    const bestAskPrice: BigNumber = BigNumber.from(bestAsk.wants).div(
      BigNumber.from(bestAsk.gives)
    );
    const bestBidPrice: BigNumber = BigNumber.from(bestBid.gives).div(
      BigNumber.from(bestBid.wants)
    );

    if (bestAskPrice.lt(bestBidPrice))
      return [bestAskId, bestBidId, bestAsk, bestBid];
    else
      return [
        BigNumber.from(-1),
        BigNumber.from(-1),
        BigNumber.from(-1),
        BigNumber.from(-1),
      ];
  }

  #createArbOrders(
    bestAskId: BigNumber,
    bestBidId: BigNumber,
    bestAsk: any,
    bestBid: any
  ): [SolSnipeOrder, SolSnipeOrder] {
    // bidVol <= askVol, so arbitrage on bidVol
    if (BigNumber.from(bestBid.wants).lte(BigNumber.from(bestAsk.gives))) {
      const params: [SolSnipeOrder, SolSnipeOrder] = [
        //BUY at ASK
        {
          outbound_tkn: this.#outboundTokenAddress,
          inbound_tkn: this.#inboundTokenAddress,
          targets: [
            [
              bestAskId,
              bestBid.wants, //takerWants
              bestBid.wants.mul(bestAsk.wants).div(bestAsk.gives), //takerGives
              MAX_GAS_REQ,
            ],
          ],
          fillWants: true,
        },
        //SELL at BID
        {
          outbound_tkn: this.#inboundTokenAddress,
          inbound_tkn: this.#outboundTokenAddress,
          targets: [
            [
              bestBidId,
              bestBid.gives, // takerWants
              bestBid.wants, // takerGives
              MAX_GAS_REQ,
            ],
          ],
          fillWants: true,
        },
      ];
      return params;
    }
    // bidVol > askVol, so arbitrage on askVol
    else {
      const params: [SolSnipeOrder, SolSnipeOrder] = [
        //BUY at ASK
        {
          outbound_tkn: this.#outboundTokenAddress,
          inbound_tkn: this.#inboundTokenAddress,
          targets: [
            [
              bestAskId,
              bestAsk.gives, // takerWants
              bestAsk.wants, // takerGives
              MAX_GAS_REQ,
            ],
          ],
          fillWants: true,
        },
        //SELL at BID
        {
          outbound_tkn: this.#inboundTokenAddress,
          inbound_tkn: this.#outboundTokenAddress,
          targets: [
            [
              bestBidId,
              bestAsk.gives.mul(bestBid.gives).div(bestBid.wants), //takerWants
              bestAsk.gives, // takerGives
              MAX_GAS_REQ,
            ],
          ],
          fillWants: true,
        },
      ];
      return params;
    }
  }

  #logArbitrage(tx: TransactionReceipt) {
    if (tx.status == 1) {
      logger.info(`Arbitrage successful:`, {
        base: this.#outboundTokenSymbol,
        quote: this.#inboundTokenSymbol,
        data: tx.transactionHash,
      });
      logger.debug(`Arbitrage successful:`, {
        base: this.#outboundTokenSymbol,
        quote: this.#inboundTokenSymbol,
        data: tx,
      });
    } else {
      logger.error(`Arbitrage failed:`, {
        base: this.#outboundTokenSymbol,
        quote: this.#inboundTokenSymbol,
        data: tx,
      });
    }
  }

  #logOpportunity(blockNumber: number, bestAsk: any, bestBid: any) {
    logger.info("Found opportunity:", {
      base: this.#outboundTokenSymbol,
      quote: this.#inboundTokenSymbol,
      data: blockNumber,
    });
    logger.info("Ask:", {
      base: this.#outboundTokenSymbol,
      quote: this.#inboundTokenSymbol,
      offer: bestAsk,
    });
    logger.info("Bid:", {
      base: this.#outboundTokenSymbol,
      quote: this.#inboundTokenSymbol,
      offer: bestBid,
    });
    // console.log("Opportunity found:\nBest Ask:");
    // console.log("wants: ", BigNumber.from(bestAsk.wants).toString());
    // console.log("gives: ", BigNumber.from(bestAsk.gives).toString());
    // console.log("Best Bid:");
    // console.log("wants: ", BigNumber.from(bestBid.wants).toString());
    // console.log("gives: ", BigNumber.from(bestBid.gives).toString());
  }

  async #pollIsAlive(provider: WebSocketProvider) {
    while (this.#alivePollingRunning) {
      // 10min sleep
      await this.#sleep(TEN_MIN_MILLISECOND);
      const currentBlock = await provider.getBlockNumber();
      if (currentBlock <= this.#lastBlockNumber) {
        this.#alivePollingRunning = false;
        throw new Error(`Websocket block provider hangs for 10min+`);
      }
      this.#lastBlockNumber = currentBlock;
    }
  }

  #sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  stop() {
    this.#blocksSubscriber.removeAllListeners();
    this.#mgvContract.removeAllListeners();
    this.#multiOrderProxyContract.removeAllListeners();
    this.#alivePollingRunning = false;
  }
}
