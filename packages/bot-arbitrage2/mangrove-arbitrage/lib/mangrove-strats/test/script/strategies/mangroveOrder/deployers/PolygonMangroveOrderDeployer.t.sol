// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {PolygonMangroveDeployer} from "@mgv/script/core/deployers/PolygonMangroveDeployer.s.sol";

import {BaseMangroveOrderDeployerTest} from "./BaseMangroveOrderDeployer.t.sol";

import {
  PolygonMangroveOrderDeployer,
  MangroveOrder
} from "@mgv-strats/script/strategies/mangroveOrder/deployers/PolygonMangroveOrderDeployer.s.sol";

contract PolygonMangroveOrderDeployerTest is BaseMangroveOrderDeployerTest {
  function setUp() public {
    chief = freshAddress("chief");
    fork.set("MgvGovernance", chief);

    fork.set("Gasbot", freshAddress("gasbot"));
    (new PolygonMangroveDeployer()).runWithChainSpecificParams();

    PolygonMangroveOrderDeployer polygonMgoDeployer = new PolygonMangroveOrderDeployer();
    polygonMgoDeployer.runWithChainSpecificParams();
    mgoDeployer = polygonMgoDeployer.mangroveOrderDeployer();
  }
}
