// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import "mgv_src/Mangrove.sol";
import "mgv_src/periphery/MgvReader.sol";
import {MangroveOrderEnriched} from "mgv_src/periphery/MangroveOrderEnriched.sol";
import {MgvCleaner} from "mgv_src/periphery/MgvCleaner.sol";
import {MgvOracle} from "mgv_src/periphery/MgvOracle.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {Deployer} from "./Deployer.sol";

contract MangroveDeployer is Deployer {
  Mangrove public mgv;
  MgvReader public reader;
  MgvCleaner public cleaner;
  MgvOracle public oracle;
  MangroveOrderEnriched public mgoe;

  function run() public {
    deploy({chief: msg.sender, gasprice: 1, gasmax: 2_000_000});
    outputDeployment();
  }

  function deploy(
    address chief,
    uint gasprice,
    uint gasmax
  ) public {
    vm.broadcast();
    mgv = new Mangrove({governance: chief, gasprice: gasprice, gasmax: gasmax});
    register("Mangrove", address(mgv));

    vm.broadcast();
    reader = new MgvReader({_mgv: payable(mgv)});
    register("MgvReader", address(reader));

    vm.broadcast();
    cleaner = new MgvCleaner({_MGV: address(mgv)});
    register("MgvCleaner", address(cleaner));

    vm.broadcast();
    oracle = new MgvOracle({_governance: chief, _initialMutator: chief});
    register("MgvOracle", address(oracle));

    vm.broadcast();
    mgoe = new MangroveOrderEnriched({
      _MGV: IMangrove(payable(mgv)),
      deployer: chief
    });
    register("MangroveOrderEnriched", address(mgoe));
  }
}
