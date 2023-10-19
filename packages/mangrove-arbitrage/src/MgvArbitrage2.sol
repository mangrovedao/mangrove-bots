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

  function doArbitrageFirstMangroveThenUniswap(ArbParams calldata params) public {
    uint givesTokenBalance = params.takerGivesToken.balanceOf(address(this));
    uint wantsTokenBalance = params.takerWantsToken.balanceOf(address(this));

    (uint totalGot, uint totalGave,) = mangroveMarketOrder(params, givesTokenBalance);

    (uint deltaTakerWants, uint deltaTakerGives) =
      lowLevelUniswapSwap(address(params.takerWantsToken), address(params.takerGivesToken), int(totalGot), params.pool);

    require(givesTokenBalance <= givesTokenBalance - totalGave + deltaTakerGives, "MgvArbitrage/notProfitable");

    require(wantsTokenBalance <= totalGot - deltaTakerWants, "MgvArbitrage/notProfitable");
  }

  function mangroveMarketOrder(ArbParams memory params, uint givesTokenBalance)
    internal
    returns (uint totalGot, uint totalGave, uint totalPenalty)
  {
    uint bestOfferId = mgv.best(address(params.takerWantsToken), address(params.takerGivesToken));
    MgvStructs.OfferUnpacked memory bestOffer =
      mgv.offers(address(params.takerWantsToken), address(params.takerGivesToken), bestOfferId).to_struct();

    if (bestOffer.gives < givesTokenBalance) {
      (totalGot, totalGave, totalPenalty,) =
        mgv.marketOrder(address(params.takerWantsToken), address(params.takerGivesToken), 0, bestOffer.gives, false);
    } else {
      (totalGot, totalGave, totalPenalty,) =
        mgv.marketOrder(address(params.takerWantsToken), address(params.takerGivesToken), 0, givesTokenBalance, false);
    }
  }

  function lowLevelUniswapSwap(address givesToken, address wantsToken, int amountIn, IUniswapV3Pool pool)
    internal
    returns (uint amountGivesToken, uint amountWantsToken)
  {
    bool zeroForOne = givesToken < wantsToken; // tokenIn < tokenOut
    (int amount0, int amount1) = pool.swap(
      address(this), zeroForOne, amountIn, zeroForOne ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1, abi.encode(givesToken)
    );

    if (amount0 > amount1) {
      amountGivesToken = uint(-amount0);
      amountWantsToken = uint(amount1);
    } else {
      amountGivesToken = uint(amount1);
      amountWantsToken = uint(-amount0);
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
