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

## Contract expalantion

When deploying the arbitrage contract, you'll need to pass in the following parameters:

```solidity
mgv: address of the mangrove token
admin: address of the admin
arbitrager: address of the arbitrager
```

It is only the admin address that can do:

```solidity
withdrawToken
withdrawNative
activateTokens
```

We only want the admin of the contract to be able to withdraw tokens, and activate tokens. The arbitrager should only be able to do the arbitrage.

The reason for this is, that we can keep the funds for the contract very secure, but still allow the arbitrager to do the arbitrage. The reason only the admin address can activate tokens, that this could potentionally be used to drain the contract, by activating "fake" tokens.

Be aware that you cannot update the admin, arbitrager or mgv address. Meaning if you want to change these, you'll need to deploy a new contract.
