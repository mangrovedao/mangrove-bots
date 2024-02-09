import bn from "bignumber.js";
import { BigNumber, Contract, Signer } from "ethers";
import { logger } from "../util/logger";
import { Token } from "@mangrovedao/mangrove.js";

export async function initPool(params: {
  positionManager: Contract;
  factory: Contract;
  actor: Signer;
  token1: Token;
  token1Value: string;
  token2: Token;
  token2Value: string;
  poolFee: number;
}) {
  const { sqrtPrice } = encodePriceSqrt(
    params.token1Value,
    params.token1.decimals,
    params.token1.symbol,
    params.token2Value,
    params.token2.decimals,
    params.token2.symbol
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
    `poolAddress: ${poolAddress}, token1: ${params.token1.address}, token2: ${params.token2.address}, fee: ${params.poolFee}`
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
  const usableDecimals0 = getCorrectDecimal(reserve0Decimals, reserve1Decimals);
  const usableDecimals1 = getCorrectDecimal(reserve1Decimals, reserve0Decimals);
  const correctReservce0 = new bn(reserve0.toString()).multipliedBy(
    new bn(10).pow(usableDecimals1)
  );
  const correctReservce1 = new bn(reserve1.toString()).multipliedBy(
    new bn(10).pow(usableDecimals0)
  );

  const bnNumber = new bn(correctReservce0.toString())
    .div(correctReservce1.toString())
    .sqrt()
    .multipliedBy(new bn(2).pow(96))
    .integerValue(3);

  const p4 = bnNumber.pow(2).div(new bn(2).pow(192));
  const p5 = new bn(1).div(p4);
  const priceInfo = {
    sqrtPrice: bnNumber.toString(),
    reserve0Decimals,
    reserve1Decimals,
    usableDecimals0,
    usableDecimals1,
    price: {
      reserve0Name,
      price: p4.div(
        new bn(10).pow(
          reserve0Decimals == reserve1Decimals
            ? 0
            : reserve0Decimals > reserve1Decimals
            ? -reserve1Decimals
            : usableDecimals0
        )
      ),
    },
    priceInverse: {
      reserve1Name,
      price: p5.div(
        new bn(10).pow(
          reserve0Decimals == reserve1Decimals
            ? 0
            : reserve0Decimals > reserve1Decimals
            ? usableDecimals1
            : -reserve0Decimals
        )
      ),
    },
  };
  logger.debug("", {
    data: priceInfo,
  });
  return priceInfo;
}
