// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Script, console} from "@mgv/forge-std/Script.sol";

import {IMangrove, KandelSeeder} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/KandelSeeder.sol";
import {AaveKandelSeeder} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/AaveKandelSeeder.sol";

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {KandelSeederDeployer, IERC20} from "./KandelSeederDeployer.s.sol";

contract PolygonKandelSeederDeployer is Deployer {
  function run() public {
    runWithChainSpecificParams();
    outputDeployment();
  }

  function runWithChainSpecificParams() public returns (KandelSeeder seeder, AaveKandelSeeder aaveSeeder) {
    return new KandelSeederDeployer().innerRun({
      mgv: IMangrove(fork.get("Mangrove")),
      addressesProvider: fork.get("AaveAddressProvider"),
      aaveKandelGasreq: 628_000,
      kandelGasreq: 128_000,
      deployKandel:true,
      deployAaveKandel:true,
      testBase: IERC20(fork.get("WETH")),
      testQuote: IERC20(fork.get("DAI"))
    });
  }
}
