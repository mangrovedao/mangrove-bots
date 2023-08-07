import { Chain } from "./types";

export const chains: Chain[] = [
  {
    chainId: 137,
    name: "matic",
  },
  {
    chainId: 80001,
    name: "maticmum",
  },
];

export const subgraphMaxFirstValue = 10_000;

export const secondsInADay = 60 * 60 * 24;
