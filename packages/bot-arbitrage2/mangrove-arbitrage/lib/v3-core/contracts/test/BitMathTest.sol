// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../libraries/BitMath.sol";

contract BitMathTest {
  function mostSignificantBit(uint x) external pure returns (uint8 r) {
    return BitMath.mostSignificantBit(x);
  }

  function getGasCostOfMostSignificantBit(uint x) external view returns (uint) {
    uint gasBefore = gasleft();
    BitMath.mostSignificantBit(x);
    return gasBefore - gasleft();
  }

  function leastSignificantBit(uint x) external pure returns (uint8 r) {
    return BitMath.leastSignificantBit(x);
  }

  function getGasCostOfLeastSignificantBit(uint x) external view returns (uint) {
    uint gasBefore = gasleft();
    BitMath.leastSignificantBit(x);
    return gasBefore - gasleft();
  }
}
