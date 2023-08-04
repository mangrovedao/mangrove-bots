/**
 * A simple configurable gas price update bot for the Mangrove DEX.
 * @module
 */

import config from "./util/config";
import { logger } from "./util/logger";

import { BaseProvider } from "@ethersproject/providers";
import { Wallet } from "@ethersproject/wallet";
import Mangrove, { enableLogging } from "@mangrovedao/mangrove.js";

import { AsyncTask, SimpleIntervalJob, ToadScheduler } from "toad-scheduler";
import { ExitCode, Setup } from "@mangrovedao/bot-utils";

import { PrismaClient } from "@prisma/client";
import { getVolumes } from "./volume";
import { getBuiltGraphSDK } from "../.graphclient";

enableLogging();

const scheduler = new ToadScheduler();
const setup = new Setup(config);

const primsa = new PrismaClient();

async function botFunction(
  mgv: Mangrove,
  signer: Wallet,
  provider: BaseProvider
) {}

const main = async () => {
  // const chains = await primsa.chain.findFirst();
  // console.log(chains);

  const sdk = getBuiltGraphSDK("matic");
  const test = await getVolumes(sdk, {
    skip: 0,
    first: 1000,
    latestDate: new Date(),
  });

  console.log(test);

  // await primsa.chain.create({
  //   data: {
  //     id: 1,
  //     name: 'Polygon'
  //   }
  // });

  // await setup.startBot("update gas bot", botFunction, scheduler);
};

main().catch(async (e) => {
  await primsa.$disconnect();
  logger.error(e);
  setup.stopAndExit(ExitCode.ExceptionInMain, scheduler);
});
