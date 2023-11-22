// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Script, console} from "@mgv/forge-std/Script.sol";
import {MangroveOrder, IERC20, IMangrove} from "@mgv-strats/src/strategies/MangroveOrder.sol";
import {Deployer} from "@mgv/script/lib/Deployer.sol";

/*  Deploys a MangroveOrder instance
    First test:
 forge script --fork-url mumbai MangroveOrderDeployer -vvv 
    Then broadcast and verify:
 WRITE_DEPLOY=true forge script --fork-url mumbai MangroveOrderDeployer -vvv --broadcast --verify
    Remember to activate it using ActivateMangroveOrder

  You can specify a mangrove address with the MGV env var.*/
contract MangroveOrderDeployer is Deployer {
  function run() public {
    innerRun({
      mgv: IMangrove(envAddressOrName("MGV", "Mangrove")),
      admin: envAddressOrName("MGV_GOVERNANCE", broadcaster())
    });
    outputDeployment();
  }

  /**
   * @param mgv The Mangrove that MangroveOrder should operate on
   * @param admin address of the admin on MangroveOrder after deployment
   */
  function innerRun(IMangrove mgv, address admin) public {
    MangroveOrder mgvOrder;
    // Bug workaround: Foundry has a bug where the nonce is not incremented when MangroveOrder is deployed.
    //                 We therefore ensure that this happens.
    uint64 nonce = vm.getNonce(broadcaster());
    broadcast();
    // See MangroveOrderGasreqBaseTest description for calculation of the gasreq.
    if (forMultisig) {
      mgvOrder = new MangroveOrder{salt:salt}(mgv, admin);
    } else {
      mgvOrder = new MangroveOrder(mgv, admin);
    }
    // Bug workaround: See comment above `nonce` further up
    if (nonce == vm.getNonce(broadcaster())) {
      vm.setNonce(broadcaster(), nonce + 1);
    }

    fork.set("MangroveOrder", address(mgvOrder));
    fork.set("MangroveOrder-Router", address(mgvOrder.router()));
    smokeTest(mgvOrder, mgv);
  }

  function smokeTest(MangroveOrder mgvOrder, IMangrove mgv) internal view {
    require(mgvOrder.MGV() == mgv, "Incorrect Mangrove address");
  }
}
