import bn from "bignumber.js";
import { BigNumber, Contract, Signer } from "ethers";
import { logger } from "../util/logger";
import { MgvToken } from "@mangrovedao/mangrove.js";

export async function initPool(params: {
  positionManager: Contract;
  factory: Contract;
  actor: Signer;
  token1: MgvToken;
  token1Value: string;
  token2: MgvToken;
  token2Value: string;
  poolFee: number;
}) {
  const { sqrtPrice } = encodePriceSqrt(
    params.token1Value,
    params.token1.decimals,
    params.token1.name,
    params.token2Value,
    params.token2.decimals,
    params.token2.name
  );
  await params.positionManager
    .connect(params.actor)
    .createAndInitializePoolIfNecessary(
      params.token1.address,
      params.token2.address,
      params.poolFee,
      BigNumber.from(sqrtPrice),
      { gasLimit: 5000000 }
    );

  const poolAddress = await params.factory
    .connect(params.actor)
    .getPool(params.token1.address, params.token2.address, params.poolFee);
  logger.debug(
    `sqrtPrice: ${sqrtPrice} poolAddress: ${poolAddress}, token1: ${params.token1.name} ${params.token1.address}, token2: ${params.token2.name} ${params.token2.address}, fee: ${params.poolFee}`
  );
}

function getCorrectDecimal(decimals0: number, decimals1: number) {
  if (decimals0 == decimals1) {
    return decimals0;
  } else if (decimals0 > decimals1) {
    return decimals0 - decimals1;
  } else {
    return decimals0;
  }
}

export function encodePriceSqrt(
  reserve0: bn.Value,
  reserve0Decimals: number,
  reserve0Name: string,
  reserve1: bn.Value,
  reserve1Decimals: number,
  reserve1Name: string
) {
  bn.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });
  const decimal = Math.abs(reserve0Decimals - reserve1Decimals);
  const correctReserve0 = new bn(reserve0.toString()).multipliedBy(
    new bn(10).pow(reserve1Decimals)
  );
  const correctReserve1 = new bn(reserve1.toString()).multipliedBy(
    new bn(10).pow(reserve0Decimals)
  );

  const sqrtPrice = new bn(correctReserve0.toString())
    .div(correctReserve1.toString())
    .sqrt()
    .multipliedBy(new bn(2).pow(96))
    .integerValue(3);

  const rawPrice = sqrtPrice.pow(2).div(new bn(2).pow(192));
  const rawInvertedPrice = new bn(1).div(rawPrice);
  const priceInfo = {
    sqrtPrice: sqrtPrice.toString(),
    reserve0Decimals,
    reserve1Decimals,
    price: {
      reserve0Name,
      price: rawPrice.div(
        new bn(10).pow(
          reserve0Decimals == reserve1Decimals
            ? 0
            : reserve0Decimals > reserve1Decimals
            ? -decimal
            : decimal
        )
      ),
    },
    priceInverse: {
      reserve1Name,
      price: rawInvertedPrice.div(
        new bn(10).pow(
          reserve0Decimals == reserve1Decimals
            ? 0
            : reserve0Decimals > reserve1Decimals
            ? decimal
            : -decimal
        )
      ),
    },
  };
  return priceInfo;
}
