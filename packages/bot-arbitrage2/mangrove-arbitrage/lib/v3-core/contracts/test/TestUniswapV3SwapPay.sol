// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../interfaces/IERC20Minimal.sol";

import "../interfaces/callback/IUniswapV3SwapCallback.sol";
import "../interfaces/IUniswapV3Pool.sol";

contract TestUniswapV3SwapPay is IUniswapV3SwapCallback {
  function swap(
    address pool,
    address recipient,
    bool zeroForOne,
    uint160 sqrtPriceX96,
    int amountSpecified,
    uint pay0,
    uint pay1
  ) external {
    IUniswapV3Pool(pool).swap(recipient, zeroForOne, amountSpecified, sqrtPriceX96, abi.encode(msg.sender, pay0, pay1));
  }

  function uniswapV3SwapCallback(int, int, bytes calldata data) external override {
    (address sender, uint pay0, uint pay1) = abi.decode(data, (address, uint, uint));

    if (pay0 > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(sender, msg.sender, uint(pay0));
    } else if (pay1 > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(sender, msg.sender, uint(pay1));
    }
  }
}
