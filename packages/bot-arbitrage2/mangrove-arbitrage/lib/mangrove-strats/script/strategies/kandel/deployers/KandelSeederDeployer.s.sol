// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {console} from "@mgv/forge-std/Script.sol";
import {
  IMangrove, KandelSeeder, Kandel
} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/KandelSeeder.sol";
import {
  AaveKandelSeeder,
  AaveKandel
} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/AaveKandelSeeder.sol";
import {AbstractKandelSeeder} from
  "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/AbstractKandelSeeder.sol";
import {CoreKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/CoreKandel.sol";
import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {AbstractRouter} from "@mgv-strats/src/strategies/routers/abstract/AbstractRouter.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";

/**
 * @notice deploys a Kandel seeder
 */

contract KandelSeederDeployer is Deployer {
  function run() public {
    innerRun({
      mgv: IMangrove(envAddressOrName("MGV", "Mangrove")),
      addressesProvider: envAddressOrName("AAVE", "Aave"),
      aaveKandelGasreq: 200_000,
      kandelGasreq: 200_000,
      aaveRouterGasreq: 280_000
    });
    outputDeployment();
  }

  function innerRun(
    IMangrove mgv,
    address addressesProvider,
    uint aaveRouterGasreq,
    uint aaveKandelGasreq,
    uint kandelGasreq
  ) public returns (KandelSeeder seeder, AaveKandelSeeder aaveSeeder) {
    prettyLog("Deploying Kandel seeder...");
    broadcast();
    seeder = new KandelSeeder(mgv, kandelGasreq);
    fork.set("KandelSeeder", address(seeder));

    prettyLog("Deploying AaveKandel seeder...");
    // Bug workaround: Foundry has a bug where the nonce is not incremented when AaveKandelSeeder is deployed.
    //                 We therefore ensure that this happens.
    uint64 nonce = vm.getNonce(broadcaster());
    broadcast();
    aaveSeeder = new AaveKandelSeeder(mgv, addressesProvider, aaveRouterGasreq, aaveKandelGasreq);
    // Bug workaround: See comment above `nonce` further up
    if (nonce == vm.getNonce(broadcaster())) {
      vm.setNonce(broadcaster(), nonce + 1);
    }
    fork.set("AaveKandelSeeder", address(aaveSeeder));
    fork.set("AavePooledRouter", address(aaveSeeder.AAVE_ROUTER()));

    console.log("Deploying Kandel instances for code verification...");
    IERC20 weth = IERC20(fork.get("WETH"));
    IERC20 dai = IERC20(fork.get("DAI"));
    //FIXME: what tick spacing? Why do we assume an open market?
    uint tickSpacing = 1;
    OLKey memory olKeyBaseQuote = OLKey(address(weth), address(dai), tickSpacing);

    prettyLog("Deploying Kandel instance...");
    broadcast();
    new Kandel(mgv, olKeyBaseQuote, 1, address(0));

    prettyLog("Deploying AaveKandel instance...");
    broadcast();
    new AaveKandel(mgv, olKeyBaseQuote, 1, address(0));

    smokeTest(mgv, olKeyBaseQuote, seeder, AbstractRouter(address(0)));
    smokeTest(mgv, olKeyBaseQuote, aaveSeeder, aaveSeeder.AAVE_ROUTER());

    console.log("Deployed!");
  }

  function smokeTest(
    IMangrove mgv,
    OLKey memory olKeyBaseQuote,
    AbstractKandelSeeder kandelSeeder,
    AbstractRouter expectedRouter
  ) internal {
    // Ensure that WETH/DAI market is open on Mangrove
    vm.startPrank(mgv.governance());
    mgv.activate(olKeyBaseQuote, 0, 1, 1);
    mgv.activate(olKeyBaseQuote.flipped(), 0, 1, 1);
    vm.stopPrank();

    CoreKandel kandel = kandelSeeder.sow({olKeyBaseQuote: olKeyBaseQuote, liquiditySharing: true});

    require(kandel.router() == expectedRouter, "Incorrect router address");
    require(kandel.admin() == address(this), "Incorrect admin");
    if (expectedRouter == kandel.NO_ROUTER()) {
      require(kandel.RESERVE_ID() == address(kandel), "Incorrect id");
    } else {
      require(kandel.RESERVE_ID() == kandel.admin(), "Incorrect id");
    }
    IERC20[] memory tokens = new IERC20[](2);
    tokens[0] = IERC20(olKeyBaseQuote.outbound_tkn);
    tokens[1] = IERC20(olKeyBaseQuote.inbound_tkn);
    kandel.checkList(tokens);
  }
}
