// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {IERC20, MgvStructs} from "mgv_src/MgvLib.sol";
import {AccessControlled} from "mgv_src/strategies/utils/AccessControlled.sol";
import {TransferLib} from "mgv_src/strategies/utils/TransferLib.sol";
import {IUniswapV3Pool} from "lib/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IUniswapV3SwapCallback} from "lib/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";

import "forge-std/console.sol";

struct ArbParams {
  IERC20 takerGivesToken;
  IERC20 takerWantsToken;
  IUniswapV3Pool pool;
}

contract MgvArbitrage2 is AccessControlled, IUniswapV3SwapCallback {
  /// @dev The minimum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MIN_TICK)
  uint160 internal constant MIN_SQRT_RATIO = 4295128739;
  /// @dev The maximum value that can be returned from #getSqrtRatioAtTick. Equivalent to getSqrtRatioAtTick(MAX_TICK)
  uint160 internal constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;

  IMangrove public mgv;

  mapping(address => bool) pools;

  /// @param _mgv The Mangrove instance to be arbitraged
  /// @param admin The admin of the contract. The only address allowed to withdraw funds.
  constructor(IMangrove _mgv, address admin) AccessControlled(admin) {
    mgv = _mgv;
  }

  function setPool(address pool, bool authorized) external onlyAdmin {
    pools[pool] = authorized;
  }

  /// @notice This enables the admin to withdraw tokens from the contract. Notice that only the admin can call this.
  /// @param token The token to be withdrawn
  /// @param amount The amount to be withdrawn
  /// @param to The address the amount should be transferred to.
  /// @return success true if transfer was successful; otherwise, false.
  function withdrawToken(address token, uint amount, address to) external onlyAdmin returns (bool success) {
    return TransferLib.transferToken(IERC20(token), to, amount);
  }

  /// @notice This enables the admin to withdraw native tokens from the contract. Notice that only the admin can call this.
  /// @param amount The amount to be withdrawn
  /// @param to The address the amount should be transferred to.
  /// @return success true if transfer was successful; otherwise, false.
  function withdrawNative(uint amount, address to) external onlyAdmin returns (bool success) {
    (success,) = to.call{value: amount}("");
  }

  /**
   * @notice This function performs an arbitrage by first exchanging `takerGivesToken` for `takerWantsToken` using Mangrove, and then it swaps the received `takerWantsToken` back to `takerGivesToken` using Uniswap.
   *
   * @dev This function is designed to exploit arbitrage opportunities between the Mangrove market and a Uniswap V3 pool. Let's consider an example where the Mangrove market (takerWantsToken/takerGivesToken) is structured as follows:
   *
   * ```
   * {
   *    outboundTkn: takerWantsToken,
   *    inboundTkn: takerGivesToken,
   *    gives: x,
   *    wants: y,
   *    // ... (other properties)
   * }
   * ```
   * The arbitrageur's balance of `takerGivesToken` is `z`.
   *
   * This function calculates the minimum between `z` and `y`, and then performs a `marketOrder` with `fillWants` set to `false` and `takerGives` set to the minimum value between `z` and `y`. The `marketOrder` returns `totalGot` (in `takerWantsToken`) and `totalGave` (in `takerGivesToken`). It then swaps `totalGot` tokens using Uniswap, which returns `deltaTakerWants` (in `takerWantsToken`) and `deltaTakerGives` (in `takerGivesToken).
   *
   * After these operations, the function checks that the balances of `takerGivesToken` and `takerWantsToken` have increased. If the balances have not increased, the transaction reverts, indicating that the arbitrage was not profitable.
   *
   * @param params An `ArbParams` struct containing the necessary information for the arbitrage operation.
   */
  function doArbitrageFirstMangroveThenUniswap(ArbParams calldata params) public {
    uint givesTokenBalance = params.takerGivesToken.balanceOf(address(this));
    uint wantsTokenBalance = params.takerWantsToken.balanceOf(address(this));

    MgvStructs.OfferUnpacked memory bestOffer =
      getMinimumAmountBetweenBalanceAndBestOffer(address(params.takerWantsToken), address(params.takerGivesToken));

    (uint totalGot, uint totalGave,,) = mgv.marketOrder(
      address(params.takerWantsToken),
      address(params.takerGivesToken),
      0,
      bestOffer.wants > givesTokenBalance ? givesTokenBalance : bestOffer.wants,
      false
    );

    (uint deltaTakerWants, uint deltaTakerGives) =
      lowLevelUniswapSwap(address(params.takerWantsToken), address(params.takerGivesToken), int(totalGot), params.pool);

    require(givesTokenBalance <= givesTokenBalance - totalGave + deltaTakerGives, "MgvArbitrage/notProfitable");
    require(wantsTokenBalance <= totalGot - deltaTakerWants, "MgvArbitrage/notProfitable");
  }

  /**
   * @notice This function performs an arbitrage by first exchanging `takerGivesToken` for `takerWantsToken` using Uniswap, and then it swaps the received `takerWantsToken` back to `takerGivesToken` using Uniswap.
   *
   * @dev This function is designed to execute arbitrage opportunities between the Mangrove market and a Uniswap V3 pool. Let's consider an example where the Mangrove market (takerWantsToken/takerGivesToken) is structured as follows:
   *
   * ```
   * {
   *    outboundTkn: takerWantsToken,
   *    inboundTkn: takerGivesToken,
   *    gives: x,
   *    wants: y,
   *    // ... (other properties)
   * }
   * ```
   *
   * The primary objective of this function is to exchange a specified amount of `takerGivesToken` (z) to acquire an exact quantity of `takerWantsToken` (y) using uniswap
   * and subsequently swap the acquired `takerWantsToken` for `takerGivesToken` using Mangrove.
   * After these operations, the function checks that the balances of `takerGivesToken` and `takerWantsToken` have increased. If the balances have not increased, the transaction reverts, indicating that the arbitrage was not profitable.
   *
   * @param params An `ArbParams` struct containing the necessary information for the arbitrage operation.
   */
  function doArbitrageFirstUniwapThenMangrove(ArbParams calldata params) public {
    uint givesTokenBalance = params.takerGivesToken.balanceOf(address(this));
    uint wantsTokenBalance = params.takerWantsToken.balanceOf(address(this));

    MgvStructs.OfferUnpacked memory bestOffer =
      getMinimumAmountBetweenBalanceAndBestOffer(address(params.takerGivesToken), address(params.takerWantsToken));

    (uint deltaGives, uint deltaWants) = lowLevelUniswapSwap(
      address(params.takerGivesToken), address(params.takerWantsToken), -int(bestOffer.wants), params.pool
    ); // compute minimum between my balance and wants converted using offer price

    (uint totalGot, uint totalGave,,) =
      mgv.marketOrder(address(params.takerGivesToken), address(params.takerWantsToken), 0, deltaWants, false);

    require(givesTokenBalance <= givesTokenBalance + totalGot - deltaGives, "MgvArbitrage/notProfitable");
    require(wantsTokenBalance <= wantsTokenBalance + deltaWants - totalGave, "MgvArbitrage/notProfitable");
  }

  function getMinimumAmountBetweenBalanceAndBestOffer(address outboundTkn, address inboundTkn)
    internal
    view
    returns (MgvStructs.OfferUnpacked memory bestOffer)
  {
    uint bestOfferId = mgv.best(outboundTkn, inboundTkn);
    bestOffer = mgv.offers(outboundTkn, inboundTkn, bestOfferId).to_struct();
  }

  function mangroveMarketOrder(address givesToken, address wantsToken, uint givesTokenBalance)
    internal
    returns (uint totalGot, uint totalGave, uint totalPenalty)
  {
    uint bestOfferId = mgv.best(givesToken, wantsToken);
    MgvStructs.OfferUnpacked memory bestOffer = mgv.offers(givesToken, wantsToken, bestOfferId).to_struct();

    if (bestOffer.gives < givesTokenBalance) {
      (totalGot, totalGave, totalPenalty,) = mgv.marketOrder(givesToken, wantsToken, 0, bestOffer.gives, false);
    } else {
      (totalGot, totalGave, totalPenalty,) = mgv.marketOrder(givesToken, wantsToken, 0, givesTokenBalance, false);
    }
  }

  function lowLevelUniswapSwap(address givesToken, address wantsToken, int amountIn, IUniswapV3Pool pool)
    internal
    returns (uint amountGives, uint amountWants)
  {
    bool zeroForOne = givesToken < wantsToken; // tokenIn < tokenOut
    (int amount0, int amount1) = pool.swap(
      address(this), zeroForOne, amountIn, zeroForOne ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1, abi.encode(givesToken)
    );

    if (amount0 > 0) {
      amountGives = uint(amount0);
    } else {
      amountWants = uint(-amount0);
    }

    if (amount1 > 0) {
      amountGives = uint(amount1);
    } else {
      amountWants = uint(-amount1);
    }
  }

  function uniswapV3SwapCallback(int amount0Delta, int amount1Delta, bytes calldata data) external {
    require(pools[msg.sender] == true); // ensure only approved UniswapV3 can call this function
    address tokenToTransfer = abi.decode(data, (address));

    uint amountToPay = amount0Delta > 0 ? uint(amount0Delta) : uint(amount1Delta);

    TransferLib.transferToken(IERC20(tokenToTransfer), msg.sender, amountToPay);
  }

  /// @notice This approves all the necessary tokens on Mangrove and the Uniswap router
  /// It is only the admin that can call this function
  /// @param tokens The tokens to approve
  function activateTokens(IERC20[] calldata tokens, address pool) external onlyAdmin {
    for (uint i = 0; i < tokens.length; ++i) {
      TransferLib.approveToken(tokens[i], address(mgv), type(uint).max);
      TransferLib.approveToken(tokens[i], pool, type(uint).max);
    }
  }
}
