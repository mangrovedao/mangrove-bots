// TODO do not distribute in browser version
import { ethers } from "ethers";
import { Mangrove } from "../../";
import node from "../../util/node";
import { Deferred } from "../../util";
import ProxyServer from "transparent-proxy";
import DevNode from "../devNode";
import { sleep } from "@mangrovedao/commonlib.js";

const serverParams = {
  host: "127.0.0.1",
  port: 8546, // use 8546 for the actual node, but let all connections go through proxies to be able to cut the connection before snapshot revert.
  pipe: false,
  script: "MangroveJsDeploy",
  deploy: false,
  setMulticallCodeIfAbsent: false, // mangrove.js is supposed to work against servers that only have ToyENS deployed but not Multicall, so we don't deploy Multicall in tests. However mangrove.js needs ToyENS so we let the node ensure it's there.
};

let currentProxyPort = 8546;

export const mochaHooks = {
  async beforeAll() {
    if (process.env.MOCHA_WORKER_ID) {
      // running in parallel mode - change port
      serverParams.port =
        serverParams.port + 1000 * Number(process.env.MOCHA_WORKER_ID);
      currentProxyPort = serverParams.port + 1;
    }
    this.server = await node(serverParams).connect();

    // Workaround for https://github.com/foundry-rs/foundry/issues/2884
    for (let i = 0; i < 10; i++) {
      try {
        await this.server.deploy();
        break;
      } catch (e) {
        console.log("Failed to deploy, retrying...");
      }
    }
    this.accounts = {
      deployer: this.server.accounts[0],
      maker: this.server.accounts[1],
      cleaner: this.server.accounts[2],
      tester: this.server.accounts[3],
    };

    const provider = new ethers.providers.JsonRpcProvider(this.server.url);
    const devNode = new DevNode(provider);
    // Workaround for https://github.com/foundry-rs/foundry/issues/2884
    for (let i = 0; i < 10; i++) {
      try {
        await devNode.setToyENSCodeIfAbsent();
        await devNode.setMulticallCodeIfAbsent();
        break;
      } catch (e) {
        console.log("Failed to setCode on anvil, retrying...");
      }
    }

    const mgv = await Mangrove.connect({
      provider,
      privateKey: this.accounts.deployer.key,
    });

    const tokenA = mgv.token("TokenA");
    const tokenB = mgv.token("TokenB");
    //shorten polling for faster tests
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mgv.provider.pollingInterval = 10;
    await mgv.fundMangrove(10, this.accounts.deployer.address);
    // await mgv.contract["fund()"]({ value: mgv.toUnits(10,18) });

    await mgv.contract
      .activate(tokenA.address, tokenB.address, 500, 10, 20000)
      .then((tx) => tx.wait());
    await mgv.contract
      .activate(tokenB.address, tokenA.address, 500, 10, 20000)
      .then((tx) => tx.wait());

    await tokenA.contract.mint(
      this.accounts.tester.address,
      mgv.toUnits(10, 18)
    );
    await tokenB.contract.mint(
      this.accounts.tester.address,
      mgv.toUnits(10, 18)
    );

    const tx = await mgv.fundMangrove(10, mgv.getAddress("SimpleTestMaker"));
    // making sure that last one is mined before snapshotting, anvil may snapshot too early otherwise
    await tx.wait();
    mgv.disconnect();
    await this.server.snapshot();
  },

  async beforeEach() {
    // Create a proxy for each test, and tear down that proxy at the beginning of the next test, before reverting to a prior snapshot
    if (!this.proxies) {
      this.proxies = {
        closeCurrentProxy: async () => {
          // Tear down existing proxy - waiting for all outstanding connections to close.
          // Note: anvil could still be processing something when this completes in case its async,
          // Consider probing anvil for completion.
          const currentProxy = this.proxies[currentProxyPort];
          if (currentProxy) {
            currentProxy.cancelAll = true;
            const closedDeferred = new Deferred();
            currentProxy.proxyServer.close(() => {
              closedDeferred.resolve();
            });
            await closedDeferred.promise;
          }
        },
      };
    }

    const provider = new ethers.providers.JsonRpcProvider(this.server.url);
    for (let i = 0; i < 100; i++) {
      const result = await provider.send("txpool_content", []);
      if (!Object.keys(result).length) {
        throw new Error("Missing txpool data");
      }

      if (
        Object.keys(result.pending).length ||
        Object.keys(result.queued).length
      ) {
        console.log("txpool_content not empty... waiting...");
        console.log(JSON.stringify(result));
        await sleep(200);
      } else {
        break;
      }
    }

    await this.proxies.closeCurrentProxy();

    // Create a new proxy for a new port (in case an outstanding async operation for a previous test sends a request)
    const newProxy = {
      cancelAll: false,
      proxyServer: null,
    };
    currentProxyPort++;
    newProxy.proxyServer = new ProxyServer({
      upstream: async function () {
        return `http://${serverParams.host}:${serverParams.port}`;
      },
      intercept: true,
      injectData: (data: any, session: any) => {
        // Make it fail quickly - and log to find tests which leave requests behind
        if (newProxy.cancelAll) {
          console.log("mochaHooks: Got request after cancelled!");
          session.destroy();
          // The following can be used for debugging what is calling:
          // console.dir(data.toString());
          // and for created providers:
          // provider.on('debug', (info) => {
          //   console.log("======================");
          //   console.log("ACTION");
          //   console.log(info.action);
          //   console.log("REQUEST");
          //   console.log(info.request);
          //   console.log("RESPONSE");
          //   console.log(info.response);
          //   console.log("======================");
          // });

          return null;
        }
        return data;
      },
    });
    newProxy.proxyServer.listen(currentProxyPort, serverParams.host);
    this.proxies[currentProxyPort] = newProxy;
    // Tests reference the anvil instance through the following address.
    // Note, this is updated on this global instance, so a test should never read it inside an non-awaited async request
    this.server.url = `http://${serverParams.host}:${currentProxyPort}`;

    await this.server.revert();
    // revert removes the old snapshot, a new snapshot is therefore needed. https://github.com/foundry-rs/foundry/blob/6262fbec64021463fd403204039201983effa00d/evm/src/executor/fork/database.rs#L117
    await this.server.snapshot();
  },

  async afterAll() {
    await this.proxies.closeCurrentProxy();

    if (this.server.process) {
      this.server.process.kill();
    }
  },
};
