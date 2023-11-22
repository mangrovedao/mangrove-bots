// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {GeometricKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/GeometricKandel.sol";
import {AbstractKandelSeeder} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/KandelSeeder.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {
  AaveKandel, AavePooledRouter
} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/AaveKandel.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {MangroveTest} from "@mgv/test/lib/MangroveTest.sol";
import {console2 as console} from "@mgv/forge-std/Script.sol";

/**
 * @notice deploys a Kandel instance on a given market
 * @dev since the max number of price slot Kandel can use is an immutable, one should deploy Kandel on a large price range.
 * @dev Example: WRITE_DEPLOY=true ON_AAVE=true SHARING=false BASE=CRV QUOTE=WBTC TICK_SPACING=1 forge script --fork-url $LOCALHOST_URL KandelSower --broadcast --private-key $MUMBAI_PRIVATE_KEY
 */

contract KandelSower is Deployer, MangroveTest {
  function run() public {
    bool onAave = vm.envBool("ON_AAVE");
    innerRun({
      kandelSeeder: AbstractKandelSeeder(
        envAddressOrName("KANDEL_SEEDER", onAave ? fork.get("AaveKandelSeeder") : fork.get("KandelSeeder"))
        ),
      olKeyBaseQuote: OLKey(envAddressOrName("BASE"), envAddressOrName("QUOTE"), vm.envUint("TICK_SPACING")),
      sharing: vm.envBool("SHARING"),
      onAave: onAave,
      registerNameOnFork: true,
      name: envHas("NAME") ? vm.envString("NAME") : ""
    });
    outputDeployment();
  }

  /**
   * @param kandelSeeder The address of the (Aave)KandelSeeder
   * @param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
   * @param sharing whether the deployed (aave) Kandel should allow shared liquidity
   * @param onAave whether AaveKandel should be deployed instead of Kandel
   * @param registerNameOnFork whether to register the Kandel instance on the fork.
   * @param name The name to register the deployed Kandel instance under. If empty, a name will be generated
   */
  function innerRun(
    AbstractKandelSeeder kandelSeeder,
    OLKey memory olKeyBaseQuote,
    bool sharing,
    bool onAave,
    bool registerNameOnFork,
    string memory name
  ) public {
    broadcast();
    GeometricKandel kdl = kandelSeeder.sow({olKeyBaseQuote: olKeyBaseQuote, liquiditySharing: sharing});
    prettyLog("A kandel instance was deployed!");
    console.logAddress(address(kdl));

    if (registerNameOnFork) {
      string memory kandelName = getName(name, olKeyBaseQuote, onAave);
      fork.set(kandelName, address(kdl));
    }

    smokeTest(kdl, onAave, olKeyBaseQuote);
  }

  function getName(string memory name, OLKey memory olKeyBaseQuote, bool onAave) public view returns (string memory) {
    if (bytes(name).length > 0) {
      return name;
    } else {
      string memory baseName = onAave ? "AaveKandel_" : "Kandel_";
      return string.concat(
        baseName,
        IERC20(olKeyBaseQuote.outbound_tkn).symbol(),
        "_",
        IERC20(olKeyBaseQuote.inbound_tkn).symbol(),
        "_",
        vm.toString(olKeyBaseQuote.tickSpacing)
      );
    }
  }

  function smokeTest(GeometricKandel kdl, bool onAave, OLKey memory olKeyBaseQuote) internal {
    require(kdl.admin() == broadcaster(), "Incorrect admin for Kandel");
    require(onAave || address(kdl.router()) == address(0), "Incorrect router");

    IERC20 base = IERC20(olKeyBaseQuote.outbound_tkn);
    IERC20 quote = IERC20(olKeyBaseQuote.inbound_tkn);

    if (onAave) {
      prettyLog("Verifying Aave interaction");
      deal(address(base), address(this), 1000);
      deal(address(quote), address(this), 1000);
      base.approve(address(kdl), type(uint).max);
      quote.approve(address(kdl), type(uint).max);

      IERC20 aBase = IERC20(AavePooledRouter(address(kdl.router())).POOL().getReserveData(address(base)).aTokenAddress);
      IERC20 aQuote =
        IERC20(AavePooledRouter(address(kdl.router())).POOL().getReserveData(address(quote)).aTokenAddress);

      AaveKandel(payable(kdl)).depositFunds(1000, 1000);
      require(aBase.balanceOf(address(kdl.router())) == 1000, "Smoke Test: did not deposit base on the pool");
      require(aQuote.balanceOf(address(kdl.router())) == 1000, "Smoke Test: did not deposit quote on the pool");
    }
  }
}
