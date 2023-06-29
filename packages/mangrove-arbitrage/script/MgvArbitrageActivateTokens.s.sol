// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrage} from "src/MgvArbitrage.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {IERC20} from "mgv_src/IERC20.sol";

contract MgvArbitrageActivateTokens is Deployer {
  MgvArbitrage public mgvArb;

  function run() public {
    innerRun({
      tkn1: IERC20(envAddressOrName("TKN1")),
      tkn2: IERC20(envAddressOrName("TKN2")),
      arbitrageContract: envAddressOrName("ARBITRAGECONTRACT", "MgvArbitrage")
    });
  }

  function innerRun(IERC20 tkn1, IERC20 tkn2, address payable arbitrageContract) public {
    mgvArb = MgvArbitrage(arbitrageContract);
    IERC20[] memory tokens = new IERC20[](2);
    tokens[0] = tkn1;
    tokens[1] = tkn2;
    broadcast();
    mgvArb.activateTokens(tokens);
    smokeTest(tkn1, tkn2, address(arbitrageContract));
  }

  function smokeTest(IERC20 tkn1, IERC20 tkn2, address arbitrageContract) public view {
    require(
      tkn1.allowance(arbitrageContract, address(mgvArb.mgv())) == type(uint).max, "tkn1 allowance not set for mangrove"
    );
    require(
      tkn1.allowance(arbitrageContract, address(mgvArb.router())) == type(uint).max,
      "tkn1 allowance not set for uniswap router"
    );
    require(
      tkn2.allowance(arbitrageContract, address(mgvArb.mgv())) == type(uint).max, "tkn2 allowance not set for mangrove"
    );
    require(
      tkn2.allowance(arbitrageContract, address(mgvArb.router())) == type(uint).max,
      "tkn2 allowance not set for uniswap router"
    );
  }
}
