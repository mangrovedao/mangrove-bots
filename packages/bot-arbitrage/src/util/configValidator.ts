import { ethers } from "ethers";
import { Market } from "../types";
import { z } from "zod";
import config from "./config";

const ethAddressSchema = z
  .string()
  .refine((value) => ethers.utils.isAddress(value), {
    message:
      "Provided address is invalid. Please insure you have typed correctly.",
  });

export const marketValidator = z.array(
  z.object({
    base: z.string(),
    quote: z.string(),
    tickSpacing: z.string(),
    fee: z.number(),
  })
);

export const getMarketsConfig = (): Market[] => {
  const markets = config.get<Market[]>("markets");
  marketValidator.parse(markets);

  return markets;
};

export const getArbitragerContractAddress = (): string => {
  const arbitragerContractAddress = config.get<string>(
    "arbitragerContractAddress"
  );

  ethAddressSchema.parse(arbitragerContractAddress);

  return arbitragerContractAddress;
};

export const getFactoryAddress = (): string => {
  const factoryAddress = config.get<string>("factoryAddress");

  ethAddressSchema.parse(factoryAddress);

  return factoryAddress;
};

export const getEveryXMinutes = (): number => {
  const everyXMinutes = config.get<number>("everyXMinutes");

  z.number().parse(everyXMinutes);

  return everyXMinutes;
};
