// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveDeployer} from "mgv_script/core/deployers/MangroveDeployer.s.sol";
import {MumbaiMgvArbitrageDeployer} from "script/deployers/MumbaiMgvArbitrageDeployer.s.sol";
import {BaseMgvArbitrageDeployerTest} from "test/deployers/BaseMgvArbitrageDeployerTest.t.sol";

import {Test2, Test} from "mgv_lib/Test2.sol";

contract MumbaiMgvArbitrageDeployerTest is BaseMgvArbitrageDeployerTest {
  function setUp() public {
    admin = broadcaster();

    mgvDeployer = new MangroveDeployer();
    mgvDeployer.innerRun({chief: admin, gasprice: 1, gasmax: 2_000_000, gasbot: address(0)});
    MumbaiMgvArbitrageDeployer mumbaiMgvArbitrageDeployer = new MumbaiMgvArbitrageDeployer();

    mumbaiMgvArbitrageDeployer.runWithChainSpecificParams();

    mgvArbDeployer = mumbaiMgvArbitrageDeployer.arbDeployer();
  }
}
