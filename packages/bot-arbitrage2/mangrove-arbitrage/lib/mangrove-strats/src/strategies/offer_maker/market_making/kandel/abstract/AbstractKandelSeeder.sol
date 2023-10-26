// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {GeometricKandel} from "./GeometricKandel.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {OLKey, Local} from "@mgv/src/core/MgvLib.sol";

///@title Abstract Kandel strat deployer.
///@notice This seeder deploys Kandel strats on demand and binds them to an AAVE router if needed.
///@dev deployer of this contract will gain aave manager power on the AAVE router (power to claim rewards and enter/exit markets)
///@dev when deployer is a contract one must therefore make sure it is able to call the corresponding functions on the router
abstract contract AbstractKandelSeeder {
  ///@notice The Mangrove deployment.
  IMangrove public immutable MGV;
  ///@notice the gasreq to use for offers.
  uint public immutable KANDEL_GASREQ;

  ///@notice constructor for `AbstractKandelSeeder`.
  ///@param mgv The Mangrove deployment.
  ///@param kandelGasreq the gasreq to use for offers
  constructor(IMangrove mgv, uint kandelGasreq) {
    MGV = mgv;
    KANDEL_GASREQ = kandelGasreq;
  }

  ///@notice deploys a new Kandel contract for the given seed parameters.
  ///@param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
  ///@param liquiditySharing if true, `msg.sender` will be used to identify the shares of the deployed Kandel strat. If msg.sender deploys several instances, reserve of the strats will be shared, but this will require a transfer from router to maker contract for each taken offer, since we cannot transfer the full amount to the first maker contract hit in a market order in case later maker contracts need the funds. Still, only a single AAVE redeem will take place.
  ///@return kandel the Kandel contract.
  function sow(OLKey memory olKeyBaseQuote, bool liquiditySharing) external returns (GeometricKandel kandel) {
    // Seeder must set Kandel owner to an address that is controlled by `msg.sender` (msg.sender or Kandel's address for instance)
    // owner MUST not be freely chosen (it is immutable in Kandel) otherwise one would allow the newly deployed strat to pull from another's strat reserve
    // allowing owner to be modified by Kandel's admin would require approval from owner's address controller

    (, Local local) = MGV.config(olKeyBaseQuote);
    (, Local local_) = MGV.config(olKeyBaseQuote.flipped());

    require(local.active() && local_.active(), "KandelSeeder/inactiveMarket");

    kandel = _deployKandel(olKeyBaseQuote, liquiditySharing);
    kandel.setAdmin(msg.sender);
  }

  ///@notice deploys a new Kandel contract for the given seed parameters.
  ///@param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
  ///@param liquiditySharing if true, `msg.sender` will be used to identify the shares of the deployed Kandel strat. If msg.sender deploys several instances, reserve of the strats will be shared, but this will require a transfer from router to maker contract for each taken offer, since we cannot transfer the full amount to the first maker contract hit in a market order in case later maker contracts need the funds. Still, only a single AAVE redeem will take place.
  ///@return kandel the Kandel contract.
  function _deployKandel(OLKey memory olKeyBaseQuote, bool liquiditySharing)
    internal
    virtual
    returns (GeometricKandel kandel);
}
