// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.13;

import {MangroveTest} from "@mgv/test/lib/MangroveTest.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MgvReader} from "@mgv/src/periphery/MgvReader.sol";
import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";

/**
 * @notice Prints the order book
 */

/*
   BASE=WETH QUOTE=USDC TICK_SPACING=1 forge script PrintOrderBook --fork-url $LOCALHOST_URL --private-key $MUMBAI_PRIVATE_KEY
 */
contract PrintOrderBook is Deployer, MangroveTest {
  function run() public {
    reader = MgvReader(envAddressOrName("MGV_READER", "MgvReader"));
    mgv = IMangrove(envAddressOrName("MGV", "Mangrove"));

    olKey = OLKey(envAddressOrName("BASE"), envAddressOrName("QUOTE"), vm.envUint("TICK_SPACING"));
    printOfferList(olKey);
    printOfferList(olKey.flipped());
  }
}
