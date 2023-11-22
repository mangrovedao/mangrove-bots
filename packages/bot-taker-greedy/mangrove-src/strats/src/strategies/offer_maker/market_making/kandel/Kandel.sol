// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveOffer} from "@mgv-strats/src/strategies/MangroveOffer.sol";
import {GeometricKandel} from "./abstract/GeometricKandel.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MgvLib, OLKey} from "@mgv/src/core/MgvLib.sol";

///@title The Kandel strat with geometric price progression.
contract Kandel is GeometricKandel {
  ///@notice Constructor
  ///@param mgv The Mangrove deployment.
  ///@param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
  ///@param gasreq the gasreq to use for offers
  ///@param reserveId identifier of this contract's reserve when using a router.
  constructor(IMangrove mgv, OLKey memory olKeyBaseQuote, uint gasreq, address reserveId)
    GeometricKandel(mgv, olKeyBaseQuote, reserveId)
  {
    // since we won't add a router later, we can activate the strat now.  We call __activate__ instead of activate just to save gas.
    __activate__(BASE);
    __activate__(QUOTE);
    setGasreq(gasreq);
  }

  ///@inheritdoc MangroveOffer
  function __posthookSuccess__(MgvLib.SingleOrder calldata order, bytes32 makerData)
    internal
    virtual
    override
    returns (bytes32 repostStatus)
  {
    transportSuccessfulOrder(order);
    repostStatus = super.__posthookSuccess__(order, makerData);
  }
}
