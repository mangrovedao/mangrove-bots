// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrageDeployer} from "script/deployers/MgvArbitrageDeployer.s.sol";

contract MumbaiMgvArbitrageDeployer is Deployer {
  MgvArbitrageDeployer public arbDeployer;

  function run() public {
    runWithChainSpecificParams();
    outputDeployment();
  }

  function runWithChainSpecificParams() public {
    arbDeployer = new MgvArbitrageDeployer();
    arbDeployer.innerRun({admin: broadcaster(), mgv: envAddressOrName("MGV", "Mangrove")});
  }
}
