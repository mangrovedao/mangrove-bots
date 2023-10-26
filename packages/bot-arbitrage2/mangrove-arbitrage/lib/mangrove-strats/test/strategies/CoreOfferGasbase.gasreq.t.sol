// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {OfferGasBaseBaseTest} from "@mgv/test/lib/gas/OfferGasBaseBase.t.sol";

///@notice For comparison to subtract from gasreq tests.
contract OfferGasBaseTest_Generic_A_B is OfferGasBaseBaseTest {
  function setUp() public override {
    super.setUpGeneric();
    this.setUpTokens(options.base.symbol, options.quote.symbol);
  }
}

///@notice For comparison to subtract from gasreq tests.
contract OfferGasBaseTest_Generic_WETH_DAI is OfferGasBaseBaseTest {
  function setUp() public override {
    super.setUpPolygon();
    this.setUpTokens("WETH", "DAI");
  }
}
