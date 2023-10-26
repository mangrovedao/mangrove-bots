// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveDeployer} from "mgv_script/core/deployers/MangroveDeployer.s.sol";
import {MgvArbitrageDeployer} from "mgv_arbitrage_script/deployers/MgvArbitrageDeployer.s.sol";
import {BaseMgvArbitrageDeployerTest} from "mgv_arbitrage_test/deployers/BaseMgvArbitrageDeployerTest.t.sol";

import {Test2, Test} from "mgv_lib/Test2.sol";

contract MgvArbitrageDeployerTest is BaseMgvArbitrageDeployerTest {
  function setUp() public {
    admin = freshAddress("chief");

    mgvDeployer = new MangroveDeployer();
    mgvDeployer.innerRun({chief: admin, gasprice: 1, gasmax: 2_000_000, gasbot: address(0)});
    mgvArbDeployer = new MgvArbitrageDeployer();
    mgvArbDeployer.innerRun({admin: admin, mgv: address(mgvDeployer.mgv())});
  }
}
