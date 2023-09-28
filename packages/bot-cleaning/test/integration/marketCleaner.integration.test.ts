/**
 * Integration tests of MarketCleaner.ts.
 */
import { afterEach, beforeEach, describe, it } from "mocha";
import * as chai from "chai";
const { expect } = chai;
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);

import { Mangrove, Market } from "@mangrovedao/mangrove.js";
import { mgvTestUtil } from "@mangrovedao/mangrove.js";

import { ethers } from "ethers";
import { Provider } from "@ethersproject/abstract-provider";

import { MarketCleaner } from "../../src/MarketCleaner";
import { sleep } from "@mangrovedao/bot-utils";

let maker: mgvTestUtil.Account; // Owner of SimpleTestMaker contract
let cleaner: mgvTestUtil.Account; // Owner of cleaner EOA
let accounts: mgvTestUtil.Account[]; // All referenced accounts for easy debugging

let balancesBefore: Map<string, mgvTestUtil.Balances>; // mgvTestUtil.Account name |-> mgvTestUtil.Balances

let testProvider: Provider; // Only used to read state for assertions, not associated with an mgvTestUtil.Account
let cleanerProvider: Provider; // Tied to the cleaner bot's mgvTestUtil.Account

let mgv: Mangrove;
let mgvAdmin: Mangrove;
let mgvConfig: Mangrove;

let market: Market;

describe("MarketCleaner integration tests", () => {
  after(async function () {
    await mgvTestUtil.logAddresses();
  });

  beforeEach(async function () {
    testProvider = ethers.getDefaultProvider(this.server.url);

    mgvConfig = await Mangrove.connect({
      privateKey: this.accounts.deployer.key,
      provider: this.server.url,
    });

    mgvAdmin = await Mangrove.connect({
      privateKey: this.accounts.deployer.key,
      provider: mgvConfig.provider,
    });

    mgvTestUtil.setConfig(mgvConfig, this.accounts, mgvAdmin);

    maker = await mgvTestUtil.getAccount(mgvTestUtil.AccountName.Maker);
    cleaner = await mgvTestUtil.getAccount(mgvTestUtil.AccountName.Cleaner);

    accounts = [maker, cleaner];

    mgv = await Mangrove.connect({
      signer: cleaner.signer,
    });
    market = await mgv.market({ base: "TokenA", quote: "TokenB" });

    cleanerProvider = mgv.provider;

    // Turn up the Mangrove gasprice to increase the bounty
    await mgvTestUtil.setMgvGasPrice(50);

    balancesBefore = await mgvTestUtil.getBalances(accounts, testProvider);
    mgvTestUtil.initPollOfTransactionTracking(mgv.provider);
  });

  afterEach(async function () {
    mgvTestUtil.stopPollOfTransactionTracking();
    mgv.disconnect();
    mgvConfig.disconnect();
    mgvAdmin.disconnect();

    const balancesAfter = await mgvTestUtil.getBalances(accounts, testProvider);
    mgvTestUtil.logBalances(accounts, balancesBefore, balancesAfter);
  });

  mgvTestUtil.bidsAsks.forEach((ba) => {
    it(`should clean offer failing to trade 0 wants on the '${ba}' offer list`, async function () {
      // Arrange
      const tx = await mgvTestUtil.postNewRevertingOffer(market, ba, maker);
      await mgvTestUtil.waitForBlock(market.mgv, tx.blockNumber);

      const marketCleaner = new MarketCleaner(market, cleanerProvider, {
        base: market.base.name,
        quote: market.quote.name,
      });

      // Act
      await marketCleaner.clean();

      // Assert
      return Promise.all([
        expect(market.requestBook()).to.eventually.have.property(ba).which.is
          .empty,
        expect(testProvider.getBalance(cleaner.address)).to.eventually.satisfy(
          (balanceAfter: ethers.BigNumber) =>
            balanceAfter.gt(balancesBefore.get(cleaner.name)?.ether || -1)
        ),
      ]);
    });

    it(`should not clean offer succeeding to trade 0 wants on the '${ba}' offer list`, async function () {
      // Arrange
      const tx = await mgvTestUtil.postNewSucceedingOffer(market, ba, maker);
      await mgvTestUtil.waitForBlock(market.mgv, tx.blockNumber);

      const marketCleaner = new MarketCleaner(market, cleanerProvider, {
        base: market.base.name,
        quote: market.quote.name,
      });

      // Act
      await marketCleaner.clean();

      // Assert
      return Promise.all([
        expect(
          market.requestBook(),
          "there should be exactly one element in `ba`"
        )
          .to.eventually.have.property(ba)
          .which.has.lengthOf(1),
        expect(
          testProvider.getBalance(cleaner.address),
          "the balance of the cleaner changed, it should not"
        ).to.eventually.satisfy((balanceAfter: ethers.BigNumber) =>
          balanceAfter.eq(balancesBefore.get(cleaner.name)?.ether || -1)
        ),
      ]);
    });
  });

  it(`asks Should clean offer with non zero takerWants and takerGives`, async function () {
    await mgvTestUtil.mint(market.quote, cleaner, 1);

    await market.quote.approveIfNotInfinite(mgv.address);

    // Arrange
    const txReceipt = await mgvTestUtil.postNewOffer({
      market,
      ba: "asks",
      maker,
      shouldFail: true,
    });
    await mgvTestUtil.waitForBlock(market.mgv, txReceipt.blockNumber!);

    const whitelistedSets = new Set<string>();
    const marketCleaner = new MarketCleaner(
      market,
      cleanerProvider,
      {
        base: market.base.name,
        quote: market.quote.name,
      },
      whitelistedSets
    );

    let book = await market.requestBook();
    whitelistedSets.add(book.asks[0].maker.toLowerCase());

    const cleanerAddr = await mgv.signer.getAddress();
    const beforeBalance = await mgv.provider.getBalance(cleanerAddr);
    // Act
    await marketCleaner.clean();
    const afterBalance = await mgv.provider.getBalance(cleanerAddr);

    book = await market.requestBook();

    expect(book).to.have.property("asks").which.is.empty;
    expect(afterBalance.gt(beforeBalance)).to.satisfy(
      (val: any) => val == true
    );
  });

  it(`bids Should clean offer with non zero takerWants and takerGives`, async function () {
    await mgvTestUtil.mint(market.base, cleaner, 1);

    const result = await (
      await market.base.approve(mgv.address, { amount: "1", overrides: {} })
    ).wait();
    await mgvTestUtil.waitForBlock(mgv, result.blockNumber);

    // Arrange
    const txReceipt = await mgvTestUtil.postNewOffer({
      market,
      ba: "bids",
      maker,
      shouldFail: true,
      wants: 1,
      gives: 100000000,
    });
    await mgvTestUtil.waitForBlock(market.mgv, txReceipt.blockNumber!);

    const whitelistedSets = new Set<string>();
    const marketCleaner = new MarketCleaner(
      market,
      cleanerProvider,
      {
        base: market.base.name,
        quote: market.quote.name,
      },
      whitelistedSets
    );

    let book = await market.requestBook();
    whitelistedSets.add(book.bids[0].maker.toLowerCase());

    const cleanerAddr = await mgv.signer.getAddress();

    const beforeBalance = await mgv.provider.getBalance(cleanerAddr);

    // Act
    await marketCleaner.clean();

    const afterBalance = await mgv.provider.getBalance(cleanerAddr);

    await sleep(5000);

    book = await market.requestBook();

    expect(book).to.have.property("bids").which.is.empty;

    expect(afterBalance.gt(beforeBalance)).to.satisfy(
      (val: any) => val == true
    );
  });

  it(`Should clean by Impersonating`, async function () {
    // Testing with new params
    const mgvNewInstance = await Mangrove.connect({
      privateKey: this.accounts.arbitrager.key,
      provider: this.server.url,
    });

    const marketNew = await mgvNewInstance.market({
      base: "TokenA",
      quote: "TokenB",
    });
    await mgvTestUtil.mint(marketNew.base, cleaner, 1);
    await mgvTestUtil.mint(marketNew.base, this.accounts.arbitrager, 1);

    const result = await (
      await marketNew.base.approve(mgvNewInstance.address, {
        amount: "1",
        overrides: {},
      })
    ).wait();
    await mgvTestUtil.waitForBlock(mgvNewInstance, result.blockNumber);

    const txReceipt = await mgvTestUtil.postNewOffer({
      market,
      ba: "bids",
      maker,
      shouldFail: true,
      wants: 1,
      gives: 100000000,
    });
    await mgvTestUtil.waitForBlock(marketNew.mgv, txReceipt.blockNumber!);

    const whitelistedSets = new Set<string>();
    const marketCleaner = new MarketCleaner(
      marketNew,
      cleanerProvider,
      {
        base: market.base.name,
        quote: market.quote.name,
      },
      whitelistedSets,
      this.accounts.deployer.address
    );

    let book = await marketNew.requestBook();
    whitelistedSets.add(book.bids[0].maker.toLowerCase());

    const cleanerAddr = await mgvNewInstance.signer.getAddress();

    const beforeBalance = await mgvNewInstance.provider.getBalance(cleanerAddr);

    // Act
    await marketCleaner.clean();

    const afterBalance = await mgvNewInstance.provider.getBalance(cleanerAddr);

    await sleep(5000);

    book = await marketNew.requestBook();

    expect(book).to.have.property("bids").which.is.empty;

    expect(afterBalance.gt(beforeBalance)).to.satisfy(
      (val: any) => val == true
    );
  });
});
