// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MgvArbitrageDeployer} from "@mgv/arbitrage/script/deployers/MgvArbitrageDeployer.s.sol";

contract PolygonMgvArbitrageDeployer is Deployer {
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
