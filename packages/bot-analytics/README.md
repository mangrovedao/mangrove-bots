A simple configurable analytics bot for the Mangrove.

# Installation

First, clone the repo and install the prerequisites for the monorepo described in the root [README.md](../../README.md).

Next, run the following commands:

```shell
$ cd <Mangrove monorepo>/packages/bot-updategas
$ yarn install   # Sets up the Mangrove monorepo and installs dependencies
$ yarn build     # Builds the gas update bot and its dependencies
```

# Usage

The JSON-RPC endpoint and private key that the bot should use must be specified in the following environment variables:

```yaml
# The URL for an Ethereum-compatible JSON-RPC endpoint
RPC_HTTP_PROVIDER=<URL>
# example:
RPC_HTTP_PROVIDER=https://eth-mainnet.alchemyapi.io/v2/abcd-12345679
```

These can either be set in the environment or in a `.env*` file. The bot uses [dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) for reading `.env*` files and [.env.local.example](.env.local.example) is an example of such a file.

To start the bot, simply run

```shell
$ yarn start
```

## Configuration

The bot has a number of configurable settings (which are currently read and used at startup, so bot needs to be restarted to change configuration).

Here's an example configuration file with instances of all possible configuration values:

```json
{
  "logLevel": "debug",
  "runEveryXHours": 12,
  "databaseUrl": "postgresql://postgres:postgres@localhost:5432/postgres?schema=mangrove",
  "startingBlock": 43091275,
  "estimatedBlockTimeMs": 2000,
  "blockFinality": 200,
  "chains": [
    {
      "number": 137,
      "name": "matic"
    }
  ]
}
```

- `logLevel`: Sets the logging level - the bot employs @mangrovedao/bot-utils, and it's default log-levels.
- `runEveryXHours`: Schedule bot to run with an interval of this many hours.
- `databaseUrl`: Url to postgres databse.
- `startingBlock`: Block number which will be use to start indexing from. Every interaction that happen before this block number will be ignored.
- `estimatedBlockTimeMs`: The estiamted block time of the chain you're running on.
- `blockFinality`: Count of block buffer between latest block and latest analysed block.
- `chains`: An array with chains number and name.

It is possible to override parts of the configuration with environment variables. This is controlled by [./config/custom-environment-variables.json](./config/custom-environment-variables.json). The structure of this file mirrors the configuration structure but with names of environment variables in the places where these can override a part of the configuration.

# Logging

The bot logs to `console.log` using [@mangrovedao/bot-utils].
