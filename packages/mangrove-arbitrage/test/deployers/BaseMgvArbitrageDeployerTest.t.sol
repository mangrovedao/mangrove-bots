// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MangroveDeployer} from "@mgv/script/core/deployers/MangroveDeployer.s.sol";
import {MgvArbitrageDeployer} from "@mgv/arbitrage/script/deployers/MgvArbitrageDeployer.s.sol";

import {Test2, Test} from "@mgv/lib/Test2.sol";

abstract contract BaseMgvArbitrageDeployerTest is Deployer, Test2 {
  MgvArbitrageDeployer mgvArbDeployer;
  MangroveDeployer mgvDeployer;
  address admin;

  function test_toy_ens_has_addresses() public {
    assertEq(mgvArbDeployer.mgvArb().admin(), admin, "Wrong admin address");
    assertEq(address(mgvArbDeployer.mgvArb().mgv()), fork.get("Mangrove"), "Wrong mgv address");
    assertEq(fork.get("MgvArbitrage"), address(mgvArbDeployer.mgvArb()), "MgvArbitrage address not correct");
  }
}
