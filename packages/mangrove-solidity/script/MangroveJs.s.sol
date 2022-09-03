// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.13;

import {MangroveDeployer} from "./lib/MangroveDeployer.sol";

import {AbstractMangrove} from "mgv_src/AbstractMangrove.sol";
import {IERC20} from "mgv_src/MgvLib.sol";
import {TestToken} from "mgv_test/lib/tokens/TestToken.sol";
import {MangroveOrder} from "mgv_src/periphery/MangroveOrderEnriched.sol";
import {SimpleTestMaker} from "mgv_test/lib/agents/TestMaker.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {Deployer} from "./lib/Deployer.sol";

/* 
This script prepares a local server for testing by mangrove.js.

In the future it should a) Use mostly the normal deploy file, so there is as
little discrepancy between real deploys and deploys that mangrove.js tests
interact with.  b) For any additional deployments needed, those files should be
hosted in mangrove.js.

*/

contract MangroveJsDeploy is Deployer {
  IERC20 tokenA;
  IERC20 tokenB;
  IERC20 dai;
  IERC20 usdc;
  IERC20 weth;
  SimpleTestMaker simpleTestMaker;
  MangroveOrder mgo;

  function run() public {
    deploy({chief: msg.sender, gasprice: 1, gasmax: 2_000_000});
    outputDeployment();
  }

  function deploy(
    address chief,
    uint gasprice,
    uint gasmax
  ) public {
    MangroveDeployer mgvDeployer = new MangroveDeployer();

    mgvDeployer.deploy({chief: chief, gasprice: gasprice, gasmax: gasmax});

    address mgv = address(mgvDeployer.mgv());

    vm.broadcast();
    tokenA = new TestToken({
      admin: chief,
      name: "Token A",
      symbol: "TokenA",
      _decimals: 18
    });
    register("TokenA", address(tokenA), true);

    vm.broadcast();
    tokenB = new TestToken({
      admin: chief,
      name: "Token B",
      symbol: "TokenB",
      _decimals: 18
    });
    register("TokenB", address(tokenB), true);

    vm.broadcast();
    dai = new TestToken({
      admin: chief,
      name: "DAI",
      symbol: "DAI",
      _decimals: 18
    });
    register("DAI", address(dai), true);

    vm.broadcast();
    usdc = new TestToken({
      admin: chief,
      name: "USD Coin",
      symbol: "USDC",
      _decimals: 6
    });
    register("USDC", address(usdc), true);

    vm.broadcast();
    weth = new TestToken({
      admin: chief,
      name: "Wrapped Ether",
      symbol: "WETH",
      _decimals: 18
    });
    register("WETH", address(weth), true);

    vm.broadcast();
    simpleTestMaker = new SimpleTestMaker({
      mgv: AbstractMangrove(payable(mgv)),
      base: tokenA,
      quote: tokenB
    });
    register("SimpleTestMaker", address(simpleTestMaker));

    vm.broadcast();
    mgo = new MangroveOrder({_MGV: IMangrove(payable(mgv)), deployer: chief});
    register("MangroveOrder", address(mgo));
  }
}
