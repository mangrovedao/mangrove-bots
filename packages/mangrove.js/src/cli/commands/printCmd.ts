import * as yargs from "yargs";
import chalk from "chalk";
import { Mangrove, Semibook, Market } from "../..";

export const command = "print <base> <quote>";
export const aliases = [];
export const describe = "print the offers on a market";

const DEFAULT_NODE_URL = "http://localhost:8545";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const builder = (yargs) => {
  return yargs
    .positional("base", { type: "string", demandOption: true })
    .positional("quote", { type: "string", demandOption: true })
    .option("maxOffers", { type: "number", default: 10 })
    .option("ba", { choices: ["asks", "bids"] })
    .option("nodeUrl", { type: "string", default: DEFAULT_NODE_URL });
};

type Arguments = yargs.Arguments<ReturnType<typeof builder>>;

export async function handler(argv: Arguments): Promise<void> {
  const mangrove = await Mangrove.connect(argv.nodeUrl);
  const market = await mangrove.market({
    base: argv.base,
    quote: argv.quote,
    bookOptions: { maxOffers: argv.maxOffers },
  });
  const { asks, bids } = market.getBook();

  console.group("MARKET");
  console.log("Base token\t", chalk.blue(`${argv.base}`));
  console.log("Quote token\t", chalk.green(`${argv.quote}`));
  console.groupEnd();

  if (!argv.ba || argv.ba === "asks") {
    console.log();
    console.log();
    printOfferList("asks", asks);
  }

  if (!argv.ba || argv.ba === "bids") {
    console.log();
    console.log();
    printOfferList("bids", bids);
  }

  process.exit(0);
}

function printOfferList(ba: Market.BA, semibook: Semibook) {
  console.group(ba);
  console.table([...semibook]);
  console.groupEnd();
}
