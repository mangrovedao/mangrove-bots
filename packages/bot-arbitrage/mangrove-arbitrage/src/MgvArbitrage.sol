// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IMangrove} from "mgv_src/IMangrove.sol";
import {IERC20} from "mgv_src/MgvLib.sol";
import {AccessControlled} from "mgv_src/strategies/utils/AccessControlled.sol";
import {TransferLib} from "mgv_src/strategies/utils/TransferLib.sol";

/// @param offerId The offer to be arbitraged
/// @param takerWantsToken The token the taker wants
/// @param takerWants The amount the taker wants
/// @param takerGivesToken The token the taker gives
/// @param takerGives The amount the taker gives
/// @param fee The fee used for the swap on Uniswap
/// @param minGain The minimum amount the arbitrage needs to gain
struct ArbParams {
  uint offerId;
  address takerWantsToken;
  uint takerWants;
  address takerGivesToken;
  uint takerGives;
  uint24 fee;
  uint minGain;
}

contract MgvArbitrage is AccessControlled {
  IMangrove public mgv;
  address public arbitrager;

  /// @param _mgv The Mangrove instance to be arbitraged
  /// @param admin The admin of the contract. The only address allowed to withdraw funds.
  constructor(IMangrove _mgv, address admin, address _arbitrager) AccessControlled(admin) {
    mgv = _mgv;
    arbitrager = _arbitrager;
  }

  /// @notice This modifier verifies that the `msg.sender` is the arbitrager
  modifier onlyArbitrager() {
    require(msg.sender == arbitrager, "Only arbitrager can call this function");
    _;
  }

  /// @notice The router used to do the swap on Uniswap
  ISwapRouter router = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

  receive() external payable virtual {}

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

  /// @notice This tries to snipe the offer on Mangrove and sell what it got on Uniswap
  /// It reverts if it is not profitable
  /// It is only the arbitrager that can call this
  /// @param params The parameters needed to do the arbitrage
  /// @return amountOut The amount received from Uniswap
  function doArbitrage(ArbParams calldata params) external onlyArbitrager returns (uint amountOut) {
    uint givesBalance = IERC20(params.takerGivesToken).balanceOf(address(this)); // Important that this is done before any transfers
    (uint takerGot, uint takerGave) = snipeOnMgv(params);
    amountOut = swapOnUniswap(params, takerGot, takerGave);
    checkGain(params.takerGivesToken, givesBalance, params.minGain);
  }

  /// @notice This tries do an initial exchange from a token that the contract is holding, to the token needed for the arbitrage, via Uniswap
  /// Then tries to snipe the offer on Mangrove and sell what it got on Uniswap
  /// At last it exchanges back to the contracts own token, via Uniswap
  /// It reverts if it is not profitable
  /// It is only the arbitrager that can call this
  /// @param token The token needed to do the arbitrage
  /// @param fee The fee on the pool to do the initial and final exchange
  /// @param params The parameters needed to do the arbitrage
  /// @return amountOut The amount received from Uniswap
  function doArbitrageExchangeOnUniswap(ArbParams calldata params, address token, uint24 fee)
    external
    onlyArbitrager
    returns (uint amountOut)
  {
    uint holdingTokenBalance = IERC20(token).balanceOf(address(this)); // Important that this is done before any transfers
    preExchangeOnUniswap(params, token, fee);
    (uint takerGot, uint takerGave) = snipeOnMgv(params);
    amountOut = swapOnUniswap(params, takerGot, takerGave);
    postExchangeOnUniswap(params, token, fee, amountOut);
    checkGain(token, holdingTokenBalance, params.minGain);
  }

  /// @notice This tries do an initial exchange from a token that the contract is holding, to the token needed for the arbitrage, via Mangrove
  /// Then tries to snipe the offer on Mangrove and sell what it got on Uniswap
  /// At last it exchanges back to the contracts own token, via Mangrove
  /// It reverts if it is not profitable
  /// It is only the arbitrager that can call this
  /// @param token The token needed to do the arbitrage
  /// @param params The parameters needed to do the arbitrage
  /// @return amountOut The amount received from Uniswap
  function doArbitrageExchangeOnMgv(ArbParams calldata params, address token)
    external
    onlyArbitrager
    returns (uint amountOut)
  {
    uint holdingTokenBalance = IERC20(token).balanceOf(address(this)); // Important that this is done before any transfers
    preExchangeOnMgv(params, token);
    (uint takerGot, uint takerGave) = snipeOnMgv(params);
    amountOut = swapOnUniswap(params, takerGot, takerGave);
    postExchangeOnMgv(params, token, amountOut);
    checkGain(token, holdingTokenBalance, params.minGain);
  }

  /// @notice This checks wether the gain has been positive and if the meets the minGain
  /// @param takerGivesToken The token the taker gives
  /// @param givesBalance The balance of the takerGivesToken before the arbitrage
  /// @param minGain The minimum amount the arbitrage needs to gain
  function checkGain(address takerGivesToken, uint givesBalance, uint minGain) internal view {
    uint balance = IERC20(takerGivesToken).balanceOf(address(this));
    require(balance > givesBalance, "MgvArbitrage/notProfitable");
    require(balance - givesBalance > minGain, "MgvArbitrage/notMinGain");
  }

  /// @notice This swaps the opposite of the Mangrove offer.
  /// @param params The parameters needed to do the arbitrage
  /// @param takerGot the amount the taker got from Mangrove
  /// @param takerGave the amount the taker gave to Mangrove
  /// @return amountOut The amount received from Uniswap
  function swapOnUniswap(ArbParams calldata params, uint takerGot, uint takerGave) internal returns (uint amountOut) {
    ISwapRouter.ExactInputSingleParams memory uniswapParams = ISwapRouter.ExactInputSingleParams({
      tokenIn: params.takerWantsToken,
      tokenOut: params.takerGivesToken,
      fee: params.fee,
      recipient: address(this),
      deadline: type(uint).max,
      amountIn: takerGot,
      amountOutMinimum: takerGave,
      sqrtPriceLimitX96: 0
    });
    amountOut = router.exactInputSingle(uniswapParams);
    require(amountOut >= takerGave, "MgvArbitrage/notProfitable");
  }

  /// @notice This snipes the specified offer on Mangrove
  /// @param params The parameters needed to do the arbitrage
  /// @return takerGot The amount the taker got from Mangrove
  /// @return takerGave The amount the taker gave to Mangrove
  function snipeOnMgv(ArbParams calldata params) internal returns (uint, uint) {
    uint[4][] memory targets = new uint[4][](1);
    targets[0] = [params.offerId, params.takerWants, params.takerGives, type(uint).max];
    (uint successes, uint takerGot, uint takerGave,,) =
      mgv.snipes(params.takerWantsToken, params.takerGivesToken, targets, false);
    require(successes == 1, "MgvArbitrage/snipeFail");
    return (takerGot, takerGave);
  }

  /// @notice this exchanges, on Uniswap, from the token the contract gain from the arbitrage, to the token the contract is holding
  /// @param params The parameters needed to do the arbitrage
  /// @param token the token the contract is holding
  /// @param fee the fee used for the swap on Uniswap
  /// @param amountOut The amount received from the arbitrage
  function postExchangeOnUniswap(ArbParams calldata params, address token, uint24 fee, uint amountOut) internal {
    if (token != address(0) && token != params.takerGivesToken) {
      ISwapRouter.ExactInputSingleParams memory exchangeParams = ISwapRouter.ExactInputSingleParams({
        tokenIn: params.takerGivesToken,
        tokenOut: token,
        fee: fee,
        recipient: address(this),
        deadline: type(uint).max,
        amountIn: amountOut,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
      });
      router.exactInputSingle(exchangeParams);
    }
  }

  /// @notice this exchanges, on Mangrove, from the token the contract gain from the arbitrage, to the token the contract is holding
  /// @param params The parameters needed to do the arbitrage
  /// @param token the token the contract is holding
  /// @param amountOut The amount received from the arbitrage
  function postExchangeOnMgv(ArbParams calldata params, address token, uint amountOut) internal {
    if (token != address(0) && token != params.takerGivesToken) {
      (, uint takerGave,,) = mgv.marketOrder({
        outbound_tkn: token,
        inbound_tkn: params.takerGivesToken,
        takerWants: 0,
        takerGives: amountOut,
        fillWants: false
      });
      require(takerGave == amountOut, "MgvArbitrage/notEnoughOnMgv");
    }
  }

  /// @notice this exchanges, on Uniswap, from the token the contract is holding, to the token the contract needs for the arbitrage
  /// @param params The parameters needed to do the arbitrage
  /// @param token the token the contract is holding
  /// @param fee the fee used for the swap on Uniswap
  function preExchangeOnUniswap(ArbParams calldata params, address token, uint24 fee) internal {
    if (token != address(0) && token != params.takerGivesToken) {
      ISwapRouter.ExactOutputSingleParams memory exchangeParams = ISwapRouter.ExactOutputSingleParams({
        tokenIn: token,
        tokenOut: params.takerGivesToken,
        fee: fee,
        recipient: address(this),
        deadline: type(uint).max,
        amountOut: params.takerGives,
        amountInMaximum: IERC20(token).balanceOf(address(this)),
        sqrtPriceLimitX96: 0
      });
      router.exactOutputSingle(exchangeParams);
    }
  }

  /// @notice this exchanges, on Mangrove, from the token the contract is holding, to the token the contract need for the arbitrage
  /// @param params The parameters needed to do the arbitrage
  /// @param token the token the contract is holding
  function preExchangeOnMgv(ArbParams calldata params, address token) internal {
    if (token != address(0) && token != params.takerGivesToken) {
      (uint takerGot,,,) = mgv.marketOrder({
        outbound_tkn: params.takerGivesToken,
        inbound_tkn: token,
        takerWants: params.takerGives,
        takerGives: IERC20(token).balanceOf(address(this)),
        fillWants: true
      });
      require(takerGot == params.takerGives, "MgvArbitrage/notEnoughOnMgv");
    }
  }

  /// @notice This approves all the necessary tokens on Mangrove and the Uniswap router
  /// It is only the admin that can call this function
  /// @param tokens The tokens to approve
  function activateTokens(IERC20[] calldata tokens) external onlyAdmin {
    for (uint i = 0; i < tokens.length; ++i) {
      TransferLib.approveToken(tokens[i], address(mgv), type(uint).max);
      TransferLib.approveToken(tokens[i], address(router), type(uint).max);
    }
  }

  /// @notice This checks if the contract has enough allowance on Mangrove and the Uniswap router
  /// @param tokens The tokens to check
  /// @return needsActivate The tokens that need to be approved
  function needsActivateTokens(IERC20[] calldata tokens) external view returns (IERC20[] memory) {
    IERC20[] memory needsActivate = new IERC20[](tokens.length);
    for (uint i = 0; i < tokens.length; ++i) {
      if (
        tokens[i].allowance(address(this), address(mgv)) == 0
          || tokens[i].allowance(address(this), address(router)) == 0
      ) {
        needsActivate[i] = tokens[i];
      }
    }
    return needsActivate;
  }
}
