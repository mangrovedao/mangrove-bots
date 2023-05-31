// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MgvArbitrage} from "src/MgvArbitrage.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";

contract MgvArbitrageDeployer is Deployer {
  MgvArbitrage public mgvArb;

  function run() public {
    innerRun({
      admin: envAddressOrName("CHIEF"),
      arbitrager: envAddressOrName("ARBITRAGER"),
      mgv: envAddressOrName("MGV", "Mangrove")
    });
    outputDeployment();
  }

  function innerRun(address admin, address arbitrager, address mgv) public {
    broadcast();
    mgvArb = new MgvArbitrage(IMangrove(payable(mgv)), admin, arbitrager);
    fork.set("MgvArbitrage", address(mgvArb));
    smokeTest(admin, arbitrager, mgv);
  }

  function smokeTest(address admin, address arbitrager, address mgv) public view {
    require(mgvArb.arbitrager() == arbitrager, "Wrong arbitrager address");
    require(mgvArb.admin() == admin, "Wrong admin address");
    require(address(mgvArb.mgv()) == mgv, "Wrong mgv address");
    require(fork.get("MgvArbitrage") != address(0), "MgvArbitrage address not set");
    require(fork.get("MgvArbitrage") == address(mgvArb), "MgvArbitrage address not correct");
  }
}
