# bot-kandel-exit

A simple bot for Mangrove, which monitors the a kandel instance and retracts all offers, when it only it only has asks, and then swaps all base to quote on uniswap.

## Strategy

The following strategy is followed in order to execute a kandel exit:

- Checks the current kandel offers
- If there are no bids live and there are still asks live, then the bot will:
  - Retract all asks
  - Swap all base to quote on uniswap
- Else, the bot will do nothing

### Options

The bot can be configured to run on only kandel on one market. A future feature could be to run on multiple kandels.

## Installation

First, clone the repo and install the prerequisites for the monorepo described in the root [README.md](../../README.md).

Next, run the following commands:

```shell
cd <Mangrove monorepo>/packages/bot-kandel-exit
yarn install   # Sets up the Mangrove monorepo and install dependencies
yarn build     # Builds the bot and its dependencies
```

## Usage

The JSON-RPC endpoint, private key and Alchemy API key that the bot should use must be specified in the following environment variables:

```yaml
# The URL for an Ethereum-compatible JSON-RPC endpoint
RPC_NODE_URL=<URL>
# example:
RPC_NODE_URL=https://eth-mainnet.alchemyapi.io/v2/abcd-12345679

# The private key for transaction signing
PRIVATE_KEY=<private key>
# example:
PRIVATE_KEY=0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

# The Alchemy API key
API_KEY=<API key>
#example:
API_KEY=abcd-12345679

# The address of the kandel instance
KANDEL_ADDRESS=<address>
#example:
KANDEL_ADDRESS=0x77d9531De0a5aB4DbD87519859B5770A590EDcf7

# The market to monitor
MARKET=<market>
#example:
MARKET='{ "base": "WETH", "quote": "USDC" }'


```

These can either be set in the environment or in a `.env*` file. The bot uses [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) for reading `.env*` files and [.env.local.example](.env.local.example) is an example of such a file.

To start the bot, simply run

```shell
yarn start
```

## Configuration

There are several things that can be configured in the bot.

- The Log level
- Markets to monitor. A market contains of [BASE, QUOTE]. Where BASE and QUOTE are the tokens that are traded against each other and UniFee is the fee tier on Uniswap v3.
- Kandel address. The address of the kandel instance to monitor.
- runEveryXMinutes. How often the bot should run. Exmaple: 0.5 means every 30 seconds.

### Logging

The bot uses [@mangrovedao/bot-utils] for logging. The log level can be set by setting the `LOG_LEVEL` environment variable. The log level can be one of the following: `debug`, `info`, `warn`, `error`, `fatal`.

## Run the bot on local chain

In order to test that the bot can actually run and exit correctly, you can start up the an anvil chain that forks polygon. The script `deployKandel.ts` can then be run with `yarn deployKandel`. It will deploy a new kandel instance and fund and publish offers. The script will then use the `deal` functionality to deal the maker some tokens, so that they can actually trade.

You can then start the bot, where it is configured to run against the local chain. The bot will then be running, but as the kandel instance still has bids live, it will not do anything.

You can then run the script `takeAllBids.ts` to take all bids, run it by `yarn takeAllBids`. The bot will then see that there are no bids live and will retract all asks and swap all base to quote on uniswap.

To keep track of the state of Mangrove and kandel, you can run `logMarket.ts`, by running `yarn logMarket`. It will log the state of the kandel instance and the Mangrove market.
