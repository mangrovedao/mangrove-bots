// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveDeployer} from "@mgv/script/core/deployers/MangroveDeployer.s.sol";
import {PolygonMgvArbitrageDeployer} from "@mgv/arbitrage/script/deployers/PolygonMgvArbitrageDeployer.s.sol";
import {BaseMgvArbitrageDeployerTest} from "@mgv/arbitrage/test/deployers/BaseMgvArbitrageDeployerTest.t.sol";

import {Test2, Test} from "@mgv/lib/Test2.sol";

contract PolygonMgvArbitrageDeployerTest is BaseMgvArbitrageDeployerTest {
  function setUp() public {
    admin = broadcaster();

    mgvDeployer = new MangroveDeployer();
    mgvDeployer.innerRun({chief: admin, gasprice: 1, gasmax: 2_000_000, gasbot: address(0)});

    PolygonMgvArbitrageDeployer polygonMgvArbitrageDeployer = new PolygonMgvArbitrageDeployer();

    polygonMgvArbitrageDeployer.runWithChainSpecificParams();

    mgvArbDeployer = polygonMgvArbitrageDeployer.arbDeployer();
  }
}
