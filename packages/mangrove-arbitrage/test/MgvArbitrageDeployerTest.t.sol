// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MangroveDeployer} from "mgv_script/core/deployers/MangroveDeployer.s.sol";
import {MgvArbitrageDeployer} from "script/MgvArbitrageDeployer.s.sol";

import {Test2, Test} from "mgv_lib/Test2.sol";

contract MgvArbitrageDeployerTest is Deployer, Test2 {
  MgvArbitrageDeployer mgvArbDeployer;
  MangroveDeployer mgvDeployer;
  address admin = freshAddress("chief");
  address arbitrager = freshAddress("arbitrager");

  function setUp() public {
    mgvDeployer = new MangroveDeployer();
    mgvDeployer.innerRun({chief: admin, gasprice: 1, gasmax: 2_000_000, gasbot: address(0)});
    mgvArbDeployer = new MgvArbitrageDeployer();
  }

  function test_innerRun() public {
    mgvArbDeployer.innerRun({admin: admin, mgv: address(mgvDeployer.mgv()), arbitrager: arbitrager});
  }
}
