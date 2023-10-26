// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../interfaces/IERC20Minimal.sol";

import "../interfaces/callback/IUniswapV3SwapCallback.sol";
import "../interfaces/IUniswapV3Pool.sol";

contract UniswapV3PoolSwapTest is IUniswapV3SwapCallback {
  int private _amount0Delta;
  int private _amount1Delta;

  function getSwapResult(address pool, bool zeroForOne, int amountSpecified, uint160 sqrtPriceLimitX96)
    external
    returns (int amount0Delta, int amount1Delta, uint160 nextSqrtRatio)
  {
    (amount0Delta, amount1Delta) =
      IUniswapV3Pool(pool).swap(address(0), zeroForOne, amountSpecified, sqrtPriceLimitX96, abi.encode(msg.sender));

    (nextSqrtRatio,,,,,,) = IUniswapV3Pool(pool).slot0();
  }

  function uniswapV3SwapCallback(int amount0Delta, int amount1Delta, bytes calldata data) external override {
    address sender = abi.decode(data, (address));

    if (amount0Delta > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(sender, msg.sender, uint(amount0Delta));
    } else if (amount1Delta > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(sender, msg.sender, uint(amount1Delta));
    }
  }
}
