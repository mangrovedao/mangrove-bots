// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../libraries/SwapMath.sol";

contract SwapMathTest {
  function computeSwapStep(uint160 sqrtP, uint160 sqrtPTarget, uint128 liquidity, int amountRemaining, uint24 feePips)
    external
    pure
    returns (uint160 sqrtQ, uint amountIn, uint amountOut, uint feeAmount)
  {
    return SwapMath.computeSwapStep(sqrtP, sqrtPTarget, liquidity, amountRemaining, feePips);
  }

  function getGasCostOfComputeSwapStep(
    uint160 sqrtP,
    uint160 sqrtPTarget,
    uint128 liquidity,
    int amountRemaining,
    uint24 feePips
  ) external view returns (uint) {
    uint gasBefore = gasleft();
    SwapMath.computeSwapStep(sqrtP, sqrtPTarget, liquidity, amountRemaining, feePips);
    return gasBefore - gasleft();
  }
}
