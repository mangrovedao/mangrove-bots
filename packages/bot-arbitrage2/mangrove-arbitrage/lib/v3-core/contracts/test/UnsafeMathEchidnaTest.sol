// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../libraries/UnsafeMath.sol";

contract UnsafeMathEchidnaTest {
  function checkDivRoundingUp(uint x, uint d) external pure {
    require(d > 0);
    uint z = UnsafeMath.divRoundingUp(x, d);
    uint diff = z - (x / d);
    if (x % d == 0) {
      assert(diff == 0);
    } else {
      assert(diff == 1);
    }
  }
}
