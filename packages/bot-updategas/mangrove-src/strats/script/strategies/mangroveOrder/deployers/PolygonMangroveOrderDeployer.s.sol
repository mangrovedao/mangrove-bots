// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Script, console} from "@mgv/forge-std/Script.sol";
import {MangroveOrder, IERC20, IMangrove} from "@mgv-strats/src/strategies/MangroveOrder.sol";

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MangroveOrderDeployer} from "./MangroveOrderDeployer.s.sol";

/**
 * Polygon specific deployment of MangroveOrder
 */
contract PolygonMangroveOrderDeployer is Deployer {
  MangroveOrderDeployer public mangroveOrderDeployer;

  function run() public {
    runWithChainSpecificParams();
    outputDeployment();
  }

  function runWithChainSpecificParams() public {
    mangroveOrderDeployer = new MangroveOrderDeployer();
    mangroveOrderDeployer.innerRun({mgv: IMangrove(fork.get("Mangrove")), admin: fork.get("MgvGovernance")});
  }
}
