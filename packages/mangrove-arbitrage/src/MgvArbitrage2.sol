// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {IERC20, MgvStructs} from "mgv_src/MgvLib.sol";
import {AccessControlled} from "mgv_src/strategies/utils/AccessControlled.sol";
import {TransferLib} from "mgv_src/strategies/utils/TransferLib.sol";
import {IUniswapV3Pool} from "lib/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import {IUniswapV3SwapCallback} from "lib/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import {FullMath} from "./FullMath.sol";

/// @param takerGivesToken The token the taker gives
/// @param takerWantsToken The token the taker wants
/// @param pool The Uniswap pool
/// @param minimumGain The minimum amount the arbitrage needs to gain
struct ArbParams {
  IERC20 takerGivesToken;
  IERC20 takerWantsToken;
  IUniswapV3Pool pool;
  uint160 minimumGain; // if zero then ignored
}

contract MgvArbitrage2 is AccessControlled, IUniswapV3SwapCallback {
  /// copied from v3-core repo to interact with low level swap function of uniwap
  uint160 internal constant MIN_SQRT_RATIO = 4295128739;
  uint160 internal constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;

  IMangrove public mgv;

  mapping(address => bool) pools;

  /// @param _mgv The Mangrove instance to be arbitraged
  /// @param admin The admin of the contract. The only address allowed to withdraw funds.
  constructor(IMangrove _mgv, address admin) AccessControlled(admin) {
    mgv = _mgv;
  }

  receive() external payable virtual {}

  function getPrice(IUniswapV3Pool pool, uint token0Decimals) internal view returns (uint price) {
    (uint160 sqrtPriceX96,,,,,,) = pool.slot0();
    uint numerator1 = uint(sqrtPriceX96) * uint(sqrtPriceX96);
    uint numerator2 = 10 ** token0Decimals;
    return FullMath.mulDiv(numerator1, numerator2, 1 << 192);
  }

  function estimateUniswapV3PriceAndAmount(IUniswapV3Pool pool, IERC20 takerGivesToken, uint balance)
    internal
    view
    returns (uint amount)
  {
    IERC20 token0 = IERC20(pool.token0());
    IERC20 token1 = IERC20(pool.token1());

    uint token0Decimals = token0.decimals();
    uint token1Decimals = token1.decimals();
    uint price = getPrice(pool, token0Decimals);

    if (token1 == takerGivesToken) {
      // price is in takerWantsToken
      amount = 10 ** token0Decimals * balance / price;
    } else {
      // price is in takerGivesToken
      amount = (balance * price) / 10 ** token0Decimals;
    }
  }

  /// @notice Authorize or unauthorize a specific Uniswap pool to call the 'uniswapV3SwapCallback' function.
  /// @param pool The address of the Uniswap pool.
  /// @param authorized A boolean flag indicating whether the pool is authorized (true) or unauthorized (false) to call the 'uniswapV3SwapCallback' function.
  function setPool(address pool, bool authorized) external onlyAdmin {
    pools[pool] = authorized;
  }

  /// @notice This enables the admin to change the Mangrove address.
  /// @param newMgv The new Mangrove address
  function setMgv(IMangrove newMgv) external onlyAdmin {
    mgv = newMgv;
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

  /// @notice This function performs an arbitrage by first exchanging `takerGivesToken` for `takerWantsToken` using Mangrove, and then it swaps the received `takerWantsToken` back to `takerGivesToken` using Uniswap.
  /// @dev This function is designed to exploit arbitrage opportunities between the Mangrove market and a Uniswap V3 pool. Let's consider an example where the Mangrove market (takerWantsToken/takerGivesToken) is structured as follows:
  /// ```
  /// {
  ///    outboundTkn: takerWantsToken,
  ///    inboundTkn: takerGivesToken,
  ///    gives: x,
  ///    wants: y,
  ///    // ... (other properties)
  /// }
  /// ```
  /// The arbitrageur's balance of `takerGivesToken` is `z`.
  /// This function calculates the minimum between `z` and `y`, and then performs a `marketOrder` with `fillWants` set to `false` and `takerGives` set to the minimum value between `z` and `y`. The `marketOrder` returns `totalGot` (in `takerWantsToken`) and `totalGave` (in `takerGivesToken`). It then swaps `totalGot` tokens using Uniswap, which returns `deltaTakerWants` (in `takerWantsToken`) and `deltaTakerGives` (in `takerGivesToken).
  /// After these operations, the function checks that the balances of `takerGivesToken` and `takerWantsToken` have increased. If the balances have not increased, the transaction reverts, indicating that the arbitrage was not profitable.
  /// @param params An `ArbParams` struct containing the necessary information for the arbitrage operation.
  function doArbitrageFirstMangroveThenUniswap(ArbParams calldata params) public onlyAdmin {
    uint givesTokenBalance = params.takerGivesToken.balanceOf(address(this));
    uint wantsTokenBalance = params.takerWantsToken.balanceOf(address(this));

    MgvStructs.OfferUnpacked memory bestOffer =
      mangroveGetBestOffer(address(params.takerWantsToken), address(params.takerGivesToken));

    (uint totalGot, uint totalGave,,) = mgv.marketOrder(
      address(params.takerWantsToken),
      address(params.takerGivesToken),
      0,
      bestOffer.wants > givesTokenBalance ? givesTokenBalance : bestOffer.wants,
      false
    );

    (uint deltaTakerWants, uint deltaTakerGives) =
      lowLevelUniswapSwap(address(params.takerWantsToken), address(params.takerGivesToken), int(totalGot), params.pool);

    require(params.minimumGain + totalGave <= deltaTakerGives, "MgvArbitrage/notProfitable");
    require(wantsTokenBalance <= totalGot - deltaTakerWants, "MgvArbitrage/notProfitable");
  }

  /// @notice This function performs an arbitrage by first exchanging `takerGivesToken` for `takerWantsToken` using Uniswap, and then it swaps the received `takerWantsToken` back to `takerGivesToken` using Uniswap.
  ///
  /// @dev This function is designed to execute arbitrage opportunities between the Mangrove market and a Uniswap V3 pool. Let's consider an example where the Mangrove market (takerWantsToken/takerGivesToken) is structured as follows:
  ///
  /// ```
  /// {
  ///    outboundTkn: takerWantsToken,
  ///    inboundTkn: takerGivesToken,
  ///    gives: x,
  ///    wants: y,
  ///    // ... (other properties)
  /// }
  /// ```
  ///
  /// The primary objective of this function is to exchange a specified amount of `takerGivesToken` (z) to acquire an exact quantity of `takerWantsToken` (y) using uniswap
  /// and subsequently swap the acquired `takerWantsToken` for `takerGivesToken` using Mangrove.
  /// After these operations, the function checks that the balances of `takerGivesToken` and `takerWantsToken` have increased. If the balances have not increased, the transaction reverts, indicating that the arbitrage was not profitable.
  ///
  /// @param params An `ArbParams` struct containing the necessary information for the arbitrage operation.
  function doArbitrageFirstUniwapThenMangrove(ArbParams calldata params) public onlyAdmin {
    uint givesTokenBalance = params.takerGivesToken.balanceOf(address(this));

    uint maxAmount = estimateUniswapV3PriceAndAmount(params.pool, params.takerGivesToken, givesTokenBalance);

    uint wantsTokenBalance = params.takerWantsToken.balanceOf(address(this));

    MgvStructs.OfferUnpacked memory bestOffer =
      mangroveGetBestOffer(address(params.takerGivesToken), address(params.takerWantsToken));

    (uint deltaGives, uint deltaWants) = lowLevelUniswapSwap(
      address(params.takerGivesToken),
      address(params.takerWantsToken),
      bestOffer.wants < maxAmount ? -int(bestOffer.wants) : int(givesTokenBalance),
      params.pool
    ); // TODO: compute minimum between my balance and wants converted using offer price

    (uint totalGot, uint totalGave,,) =
      mgv.marketOrder(address(params.takerGivesToken), address(params.takerWantsToken), 0, deltaWants, false);

    require(params.minimumGain + deltaGives <= totalGot, "MgvArbitrage/notProfitable");
    require(wantsTokenBalance <= wantsTokenBalance + deltaWants - totalGave, "MgvArbitrage/notProfitable");
  }

  ///@notice Retrieves the best mangrove offer for a given market pair of outbound token and inbound token onplatformMangrove.
  ///@param outboundTkn The token sent by the offer maker.
  ///@param inboundTkn The token sent by the offer taker.
  ///@return bestOffer A struct containing the best offer parameters.
  function mangroveGetBestOffer(address outboundTkn, address inboundTkn)
    internal
    view
    returns (MgvStructs.OfferUnpacked memory bestOffer)
  {
    uint bestOfferId = mgv.best(outboundTkn, inboundTkn);
    bestOffer = mgv.offers(outboundTkn, inboundTkn, bestOfferId).to_struct();
  }

  /// @notice Executes a low-level call to the Uniswap V3 `swap` function for exchanging tokens.
  /// @param givesToken The token to be exchanged.
  /// @param wantsToken The token to be received in the exchange.
  /// @param amount The amount to be swapped, specified as a positive integer if selling `givesToken` or a negative integer if selling `givesToken` to obtain the exact `amount` of the `wantsToken.
  /// @param pool The Uniswap V3 pool where the swap will take place.
  /// @return amountGives The amount of `givesToken` sent in the swap.
  /// @return amountWants The amount of `wantsToken` received in the swap.
  function lowLevelUniswapSwap(address givesToken, address wantsToken, int amount, IUniswapV3Pool pool)
    internal
    returns (uint amountGives, uint amountWants)
  {
    bool zeroForOne = givesToken < wantsToken; // tokenIn < tokenOut
    (int amount0, int amount1) = pool.swap(
      address(this), zeroForOne, amount, zeroForOne ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1, abi.encode(givesToken)
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

  /// @inheritdoc IUniswapV3SwapCallback
  function uniswapV3SwapCallback(int amount0Delta, int amount1Delta, bytes calldata data) external {
    require(pools[msg.sender] == true); // ensure only approved UniswapV3 can call this function
    // TODO: maybe we should check that we first called doArbitrage fn ?
    address tokenToTransfer = abi.decode(data, (address));

    uint amountToPay = amount0Delta > 0 ? uint(amount0Delta) : uint(amount1Delta);

    TransferLib.transferToken(IERC20(tokenToTransfer), msg.sender, amountToPay);
  }

  /// @notice This approves all the necessary tokens on Mangrove and the Uniswap router
  /// It is only the admin that can call this function
  /// @param tokens The tokens to approve
  function activateTokens(IERC20[] calldata tokens) external onlyAdmin {
    for (uint i = 0; i < tokens.length; ++i) {
      TransferLib.approveToken(tokens[i], address(mgv), type(uint).max);
    }
  }
}
