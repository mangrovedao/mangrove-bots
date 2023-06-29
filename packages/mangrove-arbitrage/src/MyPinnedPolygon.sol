// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {GenericFork} from "mgv_test/lib/forks/Generic.sol";

contract PolygonFork is GenericFork {
  constructor() {
    CHAIN_ID = 137;
    NAME = "polygon"; // must be id used in foundry.toml for rpc_endpoint & etherscan
    NETWORK = "matic"; // must be network name inferred by ethers.js
  }
}

contract PinnedPolygonFork is PolygonFork {
  constructor() {
    BLOCK_NUMBER = 39764951;
  }
}
