/**
 * Integration tests of ArbBot.ts.
 */
import { afterEach, beforeEach, describe, it } from "mocha";

import { Mangrove, mgvTestUtil } from "@mangrovedao/mangrove.js";

import { Token } from "@uniswap/sdk-core";
import assert from "assert";
import { getPoolInfo } from "../../src/uniswap/pool";
import {
  activateTokens,
  checkProfitableArbitrage,
  activatePool,
  doArbitrage,
} from "../../src/arbitarger";
import { logger } from "../../src/util/logger";
import { MgvArbitrage } from "../../src/types/typechain/MgvArbitrage";
import { MgvArbitrage__factory } from "../../src/types/typechain/";
import { sleep } from "@mangrovedao/bot-utils";

let mgv: Mangrove;
let mgvDeployer: Mangrove;
let arbitragerContract: MgvArbitrage;

describe("ArbBot integration tests", () => {
  beforeEach(async function () {
    mgv = await Mangrove.connect({
      privateKey: this.accounts.maker.key,
      provider: this.server.url,
      blockManagerOptions: {
        maxBlockCached: 5,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 5,
      },
    });

    mgvDeployer = await Mangrove.connect({
      privateKey: this.accounts.deployer.key,
      provider: mgv.provider,
      blockManagerOptions: {
        maxBlockCached: 5,
        maxRetryGetBlock: 10,
        retryDelayGetBlockMs: 500,
        maxRetryGetLogs: 10,
        retryDelayGetLogsMs: 500,
        batchSize: 5,
      },
    });

    const arb = mgv.getAddress("MgvArbitrage");
    const weth = await mgv.token("WETH");
    const dai = await mgv.token("DAI");
    const usdc = await mgv.token("USDC");
    await weth.contract.mintTo(this.accounts.maker.address, weth.toUnits(100));
    await dai.contract.mintTo(this.accounts.maker.address, dai.toUnits(100000));

    arbitragerContract = MgvArbitrage__factory.connect(arb, mgvDeployer.signer);
    /* arbitrager */
    await dai.contract.mintTo(arb, dai.toUnits(10000));
    await weth.contract.mintTo(arb, weth.toUnits(100));
    await usdc.contract.mintTo(arb, usdc.toUnits(10000));

    console.log(
      `--label ${this.accounts.maker.address}:maker --label ${this.accounts.deployer.address}:deployer --label ${arb}:arbContract --label ${weth.address}:weth --label ${dai.address}:dai --label ${mgv.address}:mangrove --label ${usdc.address}:usdc`
    );

    mgvTestUtil.setConfig(mgv, this.accounts, mgvDeployer);
    mgvTestUtil.initPollOfTransactionTracking(mgvDeployer.provider);
  });

  afterEach(async function () {
    mgvTestUtil.stopPollOfTransactionTracking();
    mgvDeployer.disconnect();
    mgv.disconnect();
  });

  describe("test arb bot", () => {
    it.only(`should find arb and do arb, ask`, async function () {
      const mgvArbAddress = mgv.getAddress("MgvArbitrage");

      const market = await mgv.market({
        base: "WETH",
        quote: "DAI",
        tickSpacing: 1,
      });

      const lp = await mgv.liquidityProvider(market);
      const provision = await lp.computeAskProvision();
      const offer = await lp.newAsk({ wants: 1, gives: 1, fund: provision });

      await mgvTestUtil.waitForTransaction(
        await market.base.approve(mgv.address, 1)
      );
      await mgvTestUtil.waitForTransaction(
        await market.quote.approve(mgv.address, 1)
      );
      const factoryAddress = mgv.getAddress("UniswapV3Factory");
      const poolInfo = await getPoolInfo(
        factoryAddress,
        new Token(mgv.network.id!, market.base.address, market.base.decimals),
        new Token(mgv.network.id!, market.quote.address, market.quote.decimals),
        3000,
        mgv.provider
      );

      market.consoleAsks();
      const txActivate = await activateTokens(
        mgv,
        [market.base, market.quote],
        arbitragerContract
      );
      await mgvTestUtil.waitForBlock(mgvDeployer, txActivate.blockNumber);

      const txActivatePool = await activatePool(
        arbitragerContract,
        poolInfo.poolContract.address
      );

      if (txActivatePool) {
        await mgvTestUtil.waitForBlock(mgvDeployer, txActivatePool.blockNumber);
      }

      const baseBeforeBalance = await market.base.balanceOf(mgvArbAddress);
      const quoteBeforeBalance = await market.quote.balanceOf(mgvArbAddress);

      const profitableArbs = await checkProfitableArbitrage(
        mgvDeployer,
        arbitragerContract,
        [
          {
            base: market.base,
            quote: market.quote,
            tickSpacing: "1",
            uniswapPoolAddress: poolInfo.poolContract.address,
          },
        ]
      );

      assert.equal(profitableArbs.length, 1);

      const tx = await doArbitrage(arbitragerContract, profitableArbs[0]);

      await mgvTestUtil.waitForBlock(mgv, tx.blockNumber);

      const quoteAfterBalance = await market.quote.balanceOf(mgvArbAddress);
      const baseAfterBalance = await market.base.balanceOf(mgvArbAddress);

      assert.ok(!(await market.isLive("asks", offer.id)));
      assert.deepStrictEqual(
        baseBeforeBalance,
        baseAfterBalance,
        "Should have the same amount of base"
      );
      assert.ok(
        quoteBeforeBalance < quoteAfterBalance,
        "Should have gained quote"
      );
    });
  });
});
