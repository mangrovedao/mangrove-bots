// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../libraries/LowGasSafeMath.sol";

contract LowGasSafeMathEchidnaTest {
  function checkAdd(uint x, uint y) external pure {
    uint z = LowGasSafeMath.add(x, y);
    assert(z == x + y);
    assert(z >= x && z >= y);
  }

  function checkSub(uint x, uint y) external pure {
    uint z = LowGasSafeMath.sub(x, y);
    assert(z == x - y);
    assert(z <= x);
  }

  function checkMul(uint x, uint y) external pure {
    uint z = LowGasSafeMath.mul(x, y);
    assert(z == x * y);
    assert(x == 0 || y == 0 || (z >= x && z >= y));
  }

  function checkAddi(int x, int y) external pure {
    int z = LowGasSafeMath.add(x, y);
    assert(z == x + y);
    assert(y < 0 ? z < x : z >= x);
  }

  function checkSubi(int x, int y) external pure {
    int z = LowGasSafeMath.sub(x, y);
    assert(z == x - y);
    assert(y < 0 ? z > x : z <= x);
  }
}
