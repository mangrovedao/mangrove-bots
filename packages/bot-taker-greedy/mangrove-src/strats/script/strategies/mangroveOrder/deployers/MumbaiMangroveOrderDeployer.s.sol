// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Script, console} from "@mgv/forge-std/Script.sol";
import {MangroveOrder, IERC20, IMangrove} from "@mgv-strats/src/strategies/MangroveOrder.sol";

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MangroveOrderDeployer} from "./MangroveOrderDeployer.s.sol";

/**
 * Mumbai specific deployment of MangroveOrderDeployer
 */
contract MumbaiMangroveOrderDeployer is Deployer {
  function run() public {
    runWithChainSpecificParams();
    outputDeployment();
  }

  function runWithChainSpecificParams() public {
    new MangroveOrderDeployer().innerRun({
      mgv: IMangrove(envAddressOrName("MGV", "Mangrove")),
      admin: envAddressOrName("MGV_GOVERNANCE", broadcaster())
    });
  }
}
