// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;
pragma abicoder v2;

import "../libraries/Tick.sol";

contract TickTest {
  using Tick for mapping(int24 => Tick.Info);

  mapping(int24 => Tick.Info) public ticks;

  function tickSpacingToMaxLiquidityPerTick(int24 tickSpacing) external pure returns (uint128) {
    return Tick.tickSpacingToMaxLiquidityPerTick(tickSpacing);
  }

  function setTick(int24 tick, Tick.Info memory info) external {
    ticks[tick] = info;
  }

  function getFeeGrowthInside(
    int24 tickLower,
    int24 tickUpper,
    int24 tickCurrent,
    uint feeGrowthGlobal0X128,
    uint feeGrowthGlobal1X128
  ) external view returns (uint feeGrowthInside0X128, uint feeGrowthInside1X128) {
    return ticks.getFeeGrowthInside(tickLower, tickUpper, tickCurrent, feeGrowthGlobal0X128, feeGrowthGlobal1X128);
  }

  function update(
    int24 tick,
    int24 tickCurrent,
    int128 liquidityDelta,
    uint feeGrowthGlobal0X128,
    uint feeGrowthGlobal1X128,
    uint160 secondsPerLiquidityCumulativeX128,
    int56 tickCumulative,
    uint32 time,
    bool upper,
    uint128 maxLiquidity
  ) external returns (bool flipped) {
    return ticks.update(
      tick,
      tickCurrent,
      liquidityDelta,
      feeGrowthGlobal0X128,
      feeGrowthGlobal1X128,
      secondsPerLiquidityCumulativeX128,
      tickCumulative,
      time,
      upper,
      maxLiquidity
    );
  }

  function clear(int24 tick) external {
    ticks.clear(tick);
  }

  function cross(
    int24 tick,
    uint feeGrowthGlobal0X128,
    uint feeGrowthGlobal1X128,
    uint160 secondsPerLiquidityCumulativeX128,
    int56 tickCumulative,
    uint32 time
  ) external returns (int128 liquidityNet) {
    return ticks.cross(
      tick, feeGrowthGlobal0X128, feeGrowthGlobal1X128, secondsPerLiquidityCumulativeX128, tickCumulative, time
    );
  }
}
