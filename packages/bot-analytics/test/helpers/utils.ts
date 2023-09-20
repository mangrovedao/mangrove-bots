export const transformVolumeWithDecimalsToString = (volume: any) => ({
  ...volume,
  received0: volume!.received0.toString(),
  received1: volume!.received1.toString(),
  sent0: volume!.sent0.toString(),
  sent1: volume!.sent1.toString(),
  totalSent0: volume!.totalSent0.toString(),
  totalSent1: volume!.totalSent1.toString(),
  totalReceived0: volume!.totalReceived0.toString(),
  totalReceived1: volume!.totalReceived1.toString(),
});

export const transformLiquidityWithDecimalsToString = (liquidity: any) => ({
  ...liquidity,
  amountToken0: liquidity.amountToken0.toString(),
  amountToken1: liquidity.amountToken1.toString(),
});
