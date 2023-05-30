// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Deployer} from "mgv_script/lib/Deployer.sol";
import {MangroveDeployer} from "mgv_script/core/deployers/MangroveDeployer.s.sol";
import {MangroveOrderDeployer} from "mgv_script/strategies/mangroveOrder/deployers/MangroveOrderDeployer.s.sol";
import {ActivateMarket} from "mgv_script/core/ActivateMarket.s.sol";
import {MgvArbitrage} from "src/MgvArbitrage.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {MgvReader} from "mgv_src/periphery/MgvReader.sol";
import {IERC20} from "mgv_src/IERC20.sol";
import {Mangrove} from "mgv_src/Mangrove.sol";

contract MgvArbitrageTestDeployer is Deployer {
  function run() public {
    innerRun({admin: broadcaster(), arbitrager: envAddressOrName("ARBITRAGER")});
    outputDeployment();
  }

  function innerRun(address admin, address arbitrager) public {
    MangroveDeployer mgvDeployer = new MangroveDeployer();
    mgvDeployer.innerRun({chief: admin, gasprice: 1, gasmax: 2_000_000, gasbot: address(0)});
    MgvReader reader = mgvDeployer.reader();
    Mangrove mgv = mgvDeployer.mgv();

    broadcast();
    mgv.setUseOracle(false);
    IMangrove iMgv = IMangrove(payable(mgv));

    ActivateMarket activateMarket = new ActivateMarket();
    IERC20 weth = IERC20(fork.get("WETH"));
    IERC20 dai = IERC20(fork.get("DAI"));
    IERC20 usdc = IERC20(fork.get("USDC"));
    activateMarket.innerRun(mgv, reader, dai, usdc, 1e9 / 1000, 1e9 / 1000, 0);
    activateMarket.innerRun(mgv, reader, weth, dai, 1e9, 1e9 / 1000, 0);
    activateMarket.innerRun(mgv, reader, weth, usdc, 1e9, 1e9 / 1000, 0);

    MangroveOrderDeployer mgoeDeployer = new MangroveOrderDeployer();
    mgoeDeployer.innerRun({admin: admin, mgv: iMgv});

    broadcast();
    MgvArbitrage mgvArb = new MgvArbitrage(iMgv, admin, arbitrager);
    fork.set("MgvArbitrage", address(mgvArb));
  }
}
