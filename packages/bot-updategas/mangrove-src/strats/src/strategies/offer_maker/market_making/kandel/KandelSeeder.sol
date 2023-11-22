// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {Kandel} from "./Kandel.sol";
import {GeometricKandel} from "./abstract/GeometricKandel.sol";
import {AbstractKandelSeeder} from "./abstract/AbstractKandelSeeder.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";

///@title Kandel strat deployer.
contract KandelSeeder is AbstractKandelSeeder {
  ///@notice a new Kandel has been deployed.
  ///@param owner the owner of the strat. This is indexed so that RPC calls can filter on it.
  ///@param baseQuoteOlKeyHash the hash of the base/quote offer list key. This is indexed so that RPC calls can filter on it.
  ///@param quoteBaseOlKeyHash the hash of the quote/base offer list key. This is indexed so that RPC calls can filter on it.
  ///@param kandel the address of the deployed strat.
  ///@notice By emitting this data, an indexer will be able to keep track of what Kandel strats are deployed, what market its deployed on and who the owner is.
  event NewKandel(
    address indexed owner, bytes32 indexed baseQuoteOlKeyHash, bytes32 indexed quoteBaseOlKeyHash, address kandel
  );

  ///@notice constructor for `KandelSeeder`.
  ///@param mgv The Mangrove deployment.
  ///@param kandelGasreq the gasreq to use for offers.
  constructor(IMangrove mgv, uint kandelGasreq) AbstractKandelSeeder(mgv, kandelGasreq) {}

  ///@inheritdoc AbstractKandelSeeder
  function _deployKandel(OLKey memory olKeyBaseQuote, bool) internal override returns (GeometricKandel kandel) {
    kandel = new Kandel(MGV, olKeyBaseQuote, KANDEL_GASREQ, address(0));
    emit NewKandel(msg.sender, olKeyBaseQuote.hash(), olKeyBaseQuote.flipped().hash(), address(kandel));
  }
}
