import { Log, Provider } from "@ethersproject/providers";
import { Contract } from "ethers";
import Market from "./market";
import Semibook from "./semibook";
import {
  BlockManager,
  LogSubscriber,
} from "@mangrovedao/reliable-event-subscriber";
import logger from "./util/logger";

const BookSubscriptionEventsSet = new Set([
  "OfferWrite",
  "OfferFail",
  "OfferSuccess",
  "OfferRetract",
  "SetGasbase",
]);

class MangroveEventSubscriber extends LogSubscriber<Market.BookSubscriptionEvent> {
  private bookEventSubscribers: Record<string, Record<string, Semibook>>;

  constructor(
    private provider: Provider,
    private contract: Contract,
    private blockManager: BlockManager
  ) {
    super();
    this.bookEventSubscribers = {};
  }

  public async enableSubscriptions() {
    await this.blockManager.subscribeToLogs(
      {
        address: this.contract.address,
        topics: [],
      },
      this
    );
  }

  public computeBookIdentifier(market: Market, ba: Market.BA): string {
    return ba === "asks"
      ? `${market.base.address}_${market.quote.address}`.toLowerCase()
      : `${market.quote.address}_${market.base.address}`.toLowerCase();
  }

  public getSemiBook(
    market: Market,
    ba: Market.BA,
    options: Semibook.Options
  ): Semibook | undefined {
    const identifier = this.computeBookIdentifier(market, ba);

    const books = this.bookEventSubscribers[identifier];

    if (!books) {
      return;
    }

    const semibook =
      books[
        `${options.maxOffers}_${options.chunkSize}_${options.desiredPrice}_${options.desiredVolume}`
      ];
    if (!semibook) {
      return;
    }

    return semibook;
  }

  public async subscribeToSemibook(semibook: Semibook, rec = 0): Promise<void> {
    const identifier = this.computeBookIdentifier(semibook.market, semibook.ba);

    logger.debug(
      `[MangroveEventSubscriber] subscribeToSemibook() ${semibook.ba} ${semibook.market.base.name}/${semibook.market.quote.name}`
    );
    const block = this.blockManager.getLastBlock();

    const { error, ok } = await semibook.initialize(block);
    if (error) {
      logger.debug(
        `[MangroveEventSubscriber] subscribeToSemibook error ${error}`
      );
      throw new Error(error);
    }

    if (ok.hash !== block.hash) {
      logger.debug(
        `[MangroveEventSubscriber] found reorg ${ok.hash}, ${block.hash}`
      );
      /* detected reorg during initialization */
      return new Promise((resolve, reject) => {
        /* retry when next block is handled */
        this.blockManager.addHandleBlockPostHook(async () => {
          try {
            await this.subscribeToSemibook(semibook, rec + 1);
            return resolve();
          } catch (e) {
            if (rec === 5) {
              return reject(e);
            } else {
              return this.subscribeToSemibook(semibook, rec + 1);
            }
          }
        });
      });
    }

    logger.debug(
      `[MangroveEventSubscriber] Semibook initialized ${semibook.ba} ${semibook.market.base.name}/${semibook.market.quote.name}`
    );

    if (!this.bookEventSubscribers[identifier]) {
      this.bookEventSubscribers[identifier] = {};
    }

    this.bookEventSubscribers[identifier][semibook.optionsIdentifier] =
      semibook;
  }

  /**
   * initialize subscriber at block number `blockNumber`.
   */
  public async initialize(
    wantedBlock: BlockManager.BlockWithoutParentHash
  ): Promise<LogSubscriber.InitialzeErrorOrBlock> {
    this.initializedAt = undefined;
    this.lastSeenEventBlock = undefined;

    try {
      const block = await this.provider.getBlock(wantedBlock.number);
      this.initializedAt = {
        hash: block.hash,
        number: block.number,
      };

      this.lastSeenEventBlock = block;
      return { error: undefined, ok: this.initializedAt };
    } catch {
      return { error: "FailedInitialize", ok: undefined };
    }
  }

  /**
   * handle log
   */
  public async handleLog(log: Log): Promise<void> {
    const event: Market.BookSubscriptionEvent =
      this.contract.interface.parseLog(log) as any; // wrap this in try catch
    const identifier = `${event.args[0]}_${event.args[1]}`.toLowerCase(); // outbound_tkn_inbound_tkn

    if (!BookSubscriptionEventsSet.has(event.name)) {
      return; // ignore events
    }

    const subs = this.bookEventSubscribers[identifier];
    if (!subs) {
      return;
    }

    for (const sub of Object.values(subs)) {
      await sub.handleLog(log, event);
    }
    return;
  }

  /**
   * rollback subscriber to block `block`
   */
  public rollback(block: BlockManager.Block): void {
    for (const subs of Object.values(this.bookEventSubscribers)) {
      for (const sub of Object.values(subs)) {
        if (
          sub.lastSeenEventBlock &&
          block.number < sub.lastSeenEventBlock.number
        ) {
          sub.rollback(block);
        }
      }
    }
  }
}

export default MangroveEventSubscriber;
