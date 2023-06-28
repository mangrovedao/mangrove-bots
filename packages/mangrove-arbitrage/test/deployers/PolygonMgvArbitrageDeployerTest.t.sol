// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {MangroveDeployer} from "mgv_script/core/deployers/MangroveDeployer.s.sol";
import {PolygonMgvArbitrageDeployer} from "script/deployers/PolygonMgvArbitrageDeployer.s.sol";
import {BaseMgvArbitrageDeployerTest} from "test/deployers/BaseMgvArbitrageDeployerTest.t.sol";

import {Test2, Test} from "mgv_lib/Test2.sol";

contract PolygonMgvArbitrageDeployerTest is BaseMgvArbitrageDeployerTest {
  function setUp() public {
    admin = broadcaster();
    arbitrager = freshAddress("arbitrager");
    fork.set("Arbitrager", arbitrager);

    mgvDeployer = new MangroveDeployer();
    mgvDeployer.innerRun({chief: admin, gasprice: 1, gasmax: 2_000_000, gasbot: address(0)});

    PolygonMgvArbitrageDeployer polygonMgvArbitrageDeployer = new PolygonMgvArbitrageDeployer();

    polygonMgvArbitrageDeployer.runWithChainSpecificParams();

    mgvArbDeployer = polygonMgvArbitrageDeployer.arbDeployer();
  }
}
