# mangrove-arbitrage

This is a repo for an arbitrage contract, that can execute arbitrage between Uniswap and Mangrove.
It can either do the arbitrage directly, or it can try and get the needed token, if the contract does not have enough liquidity.

## How to use

1. Clone repo
2. Do `yarn install`
3. Install foundry `curl -L https://foundry.paradigm.xyz | bash`
4. Reopen terminal and run `foundryup`
5. Make sure to have an `.env` file with at least these settings:

```yaml
POLYGON_PRIVATE_KEY=0x...
POLYGON_NODE_URL=<polygon node url>
LOCALHOST_URL=<localhost url>
MANGROVE=<mangrove address>
```

6. Run `forge test`
