// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../libraries/FullMath.sol";

contract FullMathEchidnaTest {
  function checkMulDivRounding(uint x, uint y, uint d) external pure {
    require(d > 0);

    uint ceiled = FullMath.mulDivRoundingUp(x, y, d);
    uint floored = FullMath.mulDiv(x, y, d);

    if (mulmod(x, y, d) > 0) {
      assert(ceiled - floored == 1);
    } else {
      assert(ceiled == floored);
    }
  }

  function checkMulDiv(uint x, uint y, uint d) external pure {
    require(d > 0);
    uint z = FullMath.mulDiv(x, y, d);
    if (x == 0 || y == 0) {
      assert(z == 0);
      return;
    }

    // recompute x and y via mulDiv of the result of floor(x*y/d), should always be less than original inputs by < d
    uint x2 = FullMath.mulDiv(z, d, y);
    uint y2 = FullMath.mulDiv(z, d, x);
    assert(x2 <= x);
    assert(y2 <= y);

    assert(x - x2 < d);
    assert(y - y2 < d);
  }

  function checkMulDivRoundingUp(uint x, uint y, uint d) external pure {
    require(d > 0);
    uint z = FullMath.mulDivRoundingUp(x, y, d);
    if (x == 0 || y == 0) {
      assert(z == 0);
      return;
    }

    // recompute x and y via mulDiv of the result of floor(x*y/d), should always be less than original inputs by < d
    uint x2 = FullMath.mulDiv(z, d, y);
    uint y2 = FullMath.mulDiv(z, d, x);
    assert(x2 >= x);
    assert(y2 >= y);

    assert(x2 - x < d);
    assert(y2 - y < d);
  }
}
