# Mangrove.js tests

Tests in mangrove.js must use the `ToyENS.sol` and `DeployScript.sol` files from `mangrove-core`. The `src/util/node.ts` file contains what is required to:

- start an `anvil` server
- run a solidity script with `forge script`

The script should inherit `Deployer` to get acces to a copy of the currently forked chain as `fork`. Every newly created contract should be followed by `fork.set(string contractName, address contractAddress)`.

After a successful `node.ts` spawn&deploy, mangrove.js tests use the `ToyENS` contract to cache _all_ its mappings locally. This contract got its mapping from the `Deployer` contract's `outputDeployment` function.

### Rationale

The purpose of this is ease-of-life. With this setup, users can just query the Toy ENS.

In addition, this may lay the groundwork for a true onchain `AddressProvider`, and it is dynamic: contract generation during tests could then query the ENS for those contracts.

### Alternatives

- **File-based, with manual file generation** (a file containing name->address mappings, the former method), main drawbacks:
  1. Updates to deployments must be followed by an update to the mapping file -- forget it and the tests fail. You can wrap the entire process in a command, but that's one more thing to learn and to remember (in addition to the base 'compile' and 'test' commands).
  2. Updates to deployments changes an additional file that must be committed to git, which adds noise to commit contents.
- **File-based, with file generation handled by deploy script** there was such an attempt in `feature/anviltests`, using forge's `writeFile` cheatcode. Still too clunky, leaves files around that must be ignored, updated, etc. Note: could still be the best solution in overall speed (additional forge script broadcast txs take more time).

Useful env variables you can set:

- `MGV_NODE_DEBUG` (default false): log all ethers.js requsts to the rpc node
- `MGV_NODE_USE_CACHE` (default false): 1) create a `state.dump` file containing the state after deploying contracts for testing. 2) if a `state.dump` file is present, directly load it in anvil it instead of compiling/deploying a .sol script. It speeds up testing a lot. TODO: auto-invalidate cache.
- `MGV_NODE_SPAWN` (default true): do not create an `anvil` process during testing, instead connect to an existing one (see `node.ts` for more info).
- `MGV_NODE_DEPLOY` (default true): do not deploy Mangrove & other contracts when starting an anvil process (see `node.ts` for more info).
