// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrageSetAdmin} from "mgv_arbitrage_script/MgvArbitrageSetAdmin.s.sol";
import {MgvArbitrageDeployer} from "mgv_arbitrage_script/deployers/MgvArbitrageDeployer.s.sol";
import {IERC20} from "mgv_lib/IERC20.sol";
import "mgv_test/lib/forks/Polygon.sol";
import {MangroveJsDeploy} from "mgv_strats_script/toy/MangroveJs.s.sol";
import "mgv_test/lib/MangroveTest.sol";

contract MgvArbitrageSetAdminTest is Deployer, Test2 {
  MgvArbitrageSetAdmin mgvArbitrageSetAdmin;
  MgvArbitrageDeployer mgvArbDeployer;
  IERC20 tokenA;
  IERC20 tokenB;
  address newAdmin = freshAddress("newAdmin");

  function setUp() public {
    address admin = broadcaster();
    MangroveJsDeploy deployer = new MangroveJsDeploy();
    deployer.broadcaster(admin);
    deployer.innerRun(0, 0, freshAddress("gasbot"));

    address mgv = fork.get("Mangrove");
    mgvArbDeployer = new MgvArbitrageDeployer();
    mgvArbDeployer.innerRun({admin: admin, mgv: mgv});
    mgvArbitrageSetAdmin = new MgvArbitrageSetAdmin();
  }

  function test_innerRun() public {
    mgvArbitrageSetAdmin.innerRun({arbitrageContract: payable(address(mgvArbDeployer.mgvArb())), admin: newAdmin});
  }
}
