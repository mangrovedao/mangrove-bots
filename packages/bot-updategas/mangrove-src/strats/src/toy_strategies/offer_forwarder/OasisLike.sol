// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import "@mgv-strats/src/toy_strategies/offer_forwarder/OfferForwarder.sol";

contract OasisLike is OfferForwarder {
  bytes32 public constant NAME = "OasisLike";

  constructor(IMangrove mgv, address deployer) OfferForwarder(mgv, deployer) {}
}
