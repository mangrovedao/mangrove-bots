// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MgvArbitrageActivateTokens} from "@mgv/arbitrage/script/MgvArbitrageActivateTokens.s.sol";
import {MgvArbitrageDeployer} from "@mgv/arbitrage/script/deployers/MgvArbitrageDeployer.s.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import "@mgv/test/lib/forks/Polygon.sol";
import {EmptyChainDeployer} from "@mangrovejs/src/util/test/emptyChainDeployer.s.sol";
import "@mgv/test/lib/MangroveTest.sol";

contract MgvArbitrageActivateTokensTest is Deployer, Test2 {
  MgvArbitrageActivateTokens mgvArbActivateTokens;
  MgvArbitrageDeployer mgvArbDeployer;
  IERC20 tokenA;
  IERC20 tokenB;

  function setUp() public {
    address admin = broadcaster();
    EmptyChainDeployer deployer = new EmptyChainDeployer();
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
