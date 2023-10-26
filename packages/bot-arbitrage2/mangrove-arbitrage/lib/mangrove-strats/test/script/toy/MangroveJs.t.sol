// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {Deployer, SINGLETON_BROADCASTER} from "@mgv/script/lib/Deployer.sol";
import {MangroveJsDeploy} from "@mgv-strats/script/toy/MangroveJs.s.sol";

import {StratTest} from "@mgv-strats/test/lib/StratTest.sol";
import "@mgv/forge-std/console.sol";

contract MangroveJsDeployTest is StratTest {
  function test_runs(address chief, uint gasprice, uint gasmax, address gasbot, uint mintA, uint mintB) public {
    vm.assume(chief != address(0));
    gasprice = bound(gasprice, 0, type(uint16).max);
    gasmax = bound(gasmax, 0, type(uint24).max);
    // execution
    MangroveJsDeploy deployer = new MangroveJsDeploy();
    deployer.broadcaster(chief);
    deployer.innerRun(gasprice, gasmax, gasbot);
    // mintability of test tokens
    deployer.tokenA().mint(mintA);
    deployer.tokenB().mint(mintB);
  }
}
