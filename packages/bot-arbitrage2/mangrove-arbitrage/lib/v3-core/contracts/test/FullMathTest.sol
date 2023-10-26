// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../libraries/FullMath.sol";

contract FullMathTest {
  function mulDiv(uint x, uint y, uint z) external pure returns (uint) {
    return FullMath.mulDiv(x, y, z);
  }

  function mulDivRoundingUp(uint x, uint y, uint z) external pure returns (uint) {
    return FullMath.mulDivRoundingUp(x, y, z);
  }
}
