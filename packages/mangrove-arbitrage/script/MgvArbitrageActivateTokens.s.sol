// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrage} from "src/MgvArbitrage.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";

contract MgvArbitrageActivateTokens is Deployer {
  MgvArbitrage public mgvArb;

  function run() public {
    innerRun({
      tkn1: IERC20(envAddressOrName("TKN1")),
      tkn2: IERC20(envAddressOrName("TKN2")),
      arbitrageContract: envAddressOrName("ARBITRAGECONTRACT")
    });
    outputDeployment();
  }

  function innerRun(IERC20 tkn1, IERC20 tkn2, address arbitrageContract) public {
    broadcast();
    mgvArb = MgvArbitrage(arbitrageContract);
    IERC20[] tokens = new IERC20[](2);
    tokens[0] = tkn1;
    tokens[1] = tkn2;
    mgvArb.activateTokens(tokens);
    smokeTest(tkn1, tkn2);
  }

  function smokeTest(IERC20 tkn1, IERC20 tkn2) public view {
    require(
      tkn1.allowance(address(this), address(mgvArb.mgv())) == type(uint).max, "tkn1 allowance not set for mangrove"
    );
    require(
      tkn1.allowance(address(this), address(mgvArb.router())) == type(uint).max,
      "tkn1 allowance not set for uniswap router"
    );
    require(
      tkn2.allowance(address(this), address(mgvArb.mgv())) == type(uint).max, "tkn2 allowance not set for mangrove"
    );
    require(
      tkn2.allowance(address(this), address(mgvArb.router())) == type(uint).max,
      "tkn2 allowance not set for uniswap router"
    );
  }
}
