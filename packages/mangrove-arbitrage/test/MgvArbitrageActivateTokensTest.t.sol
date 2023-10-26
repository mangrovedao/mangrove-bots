// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrageActivateTokens} from "mgv_arbitrage_script/MgvArbitrageActivateTokens.s.sol";
import {MgvArbitrageDeployer} from "mgv_arbitrage_script/deployers/MgvArbitrageDeployer.s.sol";
import {IERC20} from "mgv_lib/IERC20.sol";
import "mgv_test/lib/forks/Polygon.sol";
import {MangroveJsDeploy} from "mgv_strats_script/toy/MangroveJs.s.sol";
import "mgv_test/lib/MangroveTest.sol";

contract MgvArbitrageActivateTokensTest is Deployer, Test2 {
  MgvArbitrageActivateTokens mgvArbActivateTokens;
  MgvArbitrageDeployer mgvArbDeployer;
  IERC20 tokenA;
  IERC20 tokenB;

  function setUp() public {
    address admin = broadcaster();
    MangroveJsDeploy deployer = new MangroveJsDeploy();
    deployer.broadcaster(admin);
    deployer.innerRun(0, 0, freshAddress("gasbot"));

    address mgv = fork.get("Mangrove");
    tokenA = IERC20(fork.get("TokenA"));
    tokenB = IERC20(fork.get("TokenB"));
    mgvArbDeployer = new MgvArbitrageDeployer();
    mgvArbDeployer.innerRun({admin: admin, mgv: mgv});
    mgvArbActivateTokens = new MgvArbitrageActivateTokens();
  }

  function test_innerRun() public {
    mgvArbActivateTokens.innerRun({
      tkn1: tokenA,
      tkn2: tokenB,
      arbitrageContract: payable(address(mgvArbDeployer.mgvArb()))
    });
  }
}
