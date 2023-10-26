// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

import "../interfaces/IERC20Minimal.sol";

import "../libraries/SafeCast.sol";
import "../libraries/TickMath.sol";

import "../interfaces/callback/IUniswapV3MintCallback.sol";
import "../interfaces/callback/IUniswapV3SwapCallback.sol";
import "../interfaces/callback/IUniswapV3FlashCallback.sol";

import "../interfaces/IUniswapV3Pool.sol";

contract TestUniswapV3Callee is IUniswapV3MintCallback, IUniswapV3SwapCallback, IUniswapV3FlashCallback {
  using SafeCast for uint;

  function swapExact0For1(address pool, uint amount0In, address recipient, uint160 sqrtPriceLimitX96) external {
    IUniswapV3Pool(pool).swap(recipient, true, amount0In.toInt256(), sqrtPriceLimitX96, abi.encode(msg.sender));
  }

  function swap0ForExact1(address pool, uint amount1Out, address recipient, uint160 sqrtPriceLimitX96) external {
    IUniswapV3Pool(pool).swap(recipient, true, -amount1Out.toInt256(), sqrtPriceLimitX96, abi.encode(msg.sender));
  }

  function swapExact1For0(address pool, uint amount1In, address recipient, uint160 sqrtPriceLimitX96) external {
    IUniswapV3Pool(pool).swap(recipient, false, amount1In.toInt256(), sqrtPriceLimitX96, abi.encode(msg.sender));
  }

  function swap1ForExact0(address pool, uint amount0Out, address recipient, uint160 sqrtPriceLimitX96) external {
    IUniswapV3Pool(pool).swap(recipient, false, -amount0Out.toInt256(), sqrtPriceLimitX96, abi.encode(msg.sender));
  }

  function swapToLowerSqrtPrice(address pool, uint160 sqrtPriceX96, address recipient) external {
    IUniswapV3Pool(pool).swap(recipient, true, type(int).max, sqrtPriceX96, abi.encode(msg.sender));
  }

  function swapToHigherSqrtPrice(address pool, uint160 sqrtPriceX96, address recipient) external {
    IUniswapV3Pool(pool).swap(recipient, false, type(int).max, sqrtPriceX96, abi.encode(msg.sender));
  }

  event SwapCallback(int amount0Delta, int amount1Delta);

  function uniswapV3SwapCallback(int amount0Delta, int amount1Delta, bytes calldata data) external override {
    address sender = abi.decode(data, (address));

    emit SwapCallback(amount0Delta, amount1Delta);

    if (amount0Delta > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(sender, msg.sender, uint(amount0Delta));
    } else if (amount1Delta > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(sender, msg.sender, uint(amount1Delta));
    } else {
      // if both are not gt 0, both must be 0.
      assert(amount0Delta == 0 && amount1Delta == 0);
    }
  }

  function mint(address pool, address recipient, int24 tickLower, int24 tickUpper, uint128 amount) external {
    IUniswapV3Pool(pool).mint(recipient, tickLower, tickUpper, amount, abi.encode(msg.sender));
  }

  event MintCallback(uint amount0Owed, uint amount1Owed);

  function uniswapV3MintCallback(uint amount0Owed, uint amount1Owed, bytes calldata data) external override {
    address sender = abi.decode(data, (address));

    emit MintCallback(amount0Owed, amount1Owed);
    if (amount0Owed > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(sender, msg.sender, amount0Owed);
    }
    if (amount1Owed > 0) {
      IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(sender, msg.sender, amount1Owed);
    }
  }

  event FlashCallback(uint fee0, uint fee1);

  function flash(address pool, address recipient, uint amount0, uint amount1, uint pay0, uint pay1) external {
    IUniswapV3Pool(pool).flash(recipient, amount0, amount1, abi.encode(msg.sender, pay0, pay1));
  }

  function uniswapV3FlashCallback(uint fee0, uint fee1, bytes calldata data) external override {
    emit FlashCallback(fee0, fee1);

    (address sender, uint pay0, uint pay1) = abi.decode(data, (address, uint, uint));

    if (pay0 > 0) IERC20Minimal(IUniswapV3Pool(msg.sender).token0()).transferFrom(sender, msg.sender, pay0);
    if (pay1 > 0) IERC20Minimal(IUniswapV3Pool(msg.sender).token1()).transferFrom(sender, msg.sender, pay1);
  }
}
