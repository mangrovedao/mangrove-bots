// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrageActivateTokens} from "script/MgvArbitrageActivateTokens.s.sol";
import {MgvArbitrageDeployer} from "script/MgvArbitrageDeployer.s.sol";
import {IERC20} from "mgv_src/IERC20.sol";
import "mgv_test/lib/forks/Polygon.sol";
import {MangroveJsDeploy} from "mgv_script/toy/MangroveJs.s.sol";
import "mgv_test/lib/MangroveTest.sol";

contract MgvArbitrageActivateTokensTest is Deployer, Test2 {
  MgvArbitrageActivateTokens mgvArbActivateTokens;
  MgvArbitrageDeployer mgvArbDeployer;
  IERC20 dai;
  IERC20 usdc;
  address mgv;

  address arbitrager = freshAddress("arbitrager");

  function setUp() public {
    address admin = broadcaster();
    MangroveJsDeploy deployer = new MangroveJsDeploy();
    deployer.broadcaster(admin);
    deployer.innerRun(admin, 0, 0, freshAddress("gasbot"));

    mgv = fork.get("Mangrove");
    dai = IERC20(fork.get("TokenA"));
    usdc = IERC20(fork.get("TokenB"));
    mgvArbDeployer = new MgvArbitrageDeployer();
    mgvArbDeployer.innerRun({admin: admin, mgv: mgv, arbitrager: arbitrager});
    mgvArbActivateTokens = new MgvArbitrageActivateTokens();
  }

  function test_innerRun() public {
    mgvArbActivateTokens.innerRun({tkn1: dai, tkn2: usdc, arbitrageContract: payable(address(mgvArbDeployer.mgvArb()))});
  }
}
