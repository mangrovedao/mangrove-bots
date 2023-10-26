// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MangroveDeployer} from "@mgv/script/core/deployers/MangroveDeployer.s.sol";

import {Test2, Test} from "@mgv/lib/Test2.sol";

import {Local} from "@mgv/src/core/MgvLib.sol";
import {Mangrove} from "@mgv/src/core/Mangrove.sol";
import {MgvReader} from "@mgv/src/periphery/MgvReader.sol";
import {MgvOracle} from "@mgv/src/periphery/MgvOracle.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {AbstractRouter} from "@mgv-strats/src/strategies/routers/abstract/AbstractRouter.sol";
import {
  MangroveOrderDeployer,
  MangroveOrder
} from "@mgv-strats/script/strategies/mangroveOrder/deployers/MangroveOrderDeployer.s.sol";

/**
 * Base test suite for [Chain]MangroveOrderDeployer scripts
 */
abstract contract BaseMangroveOrderDeployerTest is Deployer, Test2 {
  MangroveOrderDeployer mgoDeployer;
  address chief;

  function test_normal_deploy() public {
    // MangroveOrder - verify mgv is used and admin is chief
    address mgv = fork.get("Mangrove");
    mgoDeployer.innerRun(IMangrove(payable(mgv)), chief);
    MangroveOrder mgoe = MangroveOrder(fork.get("MangroveOrder"));
    address mgvOrderRouter = fork.get("MangroveOrder-Router");

    assertEq(mgoe.admin(), chief);
    assertEq(address(mgoe.MGV()), mgv);
    assertEq(address(mgoe.router()), mgvOrderRouter);
  }
}
