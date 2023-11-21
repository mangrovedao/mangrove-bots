// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MgvArbitrage} from "@mgv/arbitrage/src/MgvArbitrage.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";

contract MgvArbitrageSetAdmin is Deployer {
  MgvArbitrage public mgvArb;

  function run() public {
    innerRun({
      arbitrageContract: envAddressOrName("ARBITRAGECONTRACT", "MgvArbitrage"),
      admin: envAddressOrName("ADMIN")
    });
  }

  function innerRun(address payable arbitrageContract, address admin) public {
    mgvArb = MgvArbitrage(arbitrageContract);
    broadcast();
    mgvArb.setAdmin(admin);
    smokeTest(admin);
  }

  function smokeTest(address admin) public view {
    require(admin == mgvArb.admin(), "admin should be set to new admin");
  }
}
