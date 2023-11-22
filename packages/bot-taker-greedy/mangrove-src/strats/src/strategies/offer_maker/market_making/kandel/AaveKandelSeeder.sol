// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {AaveKandel, AavePooledRouter} from "./AaveKandel.sol";
import {GeometricKandel} from "./abstract/GeometricKandel.sol";
import {AbstractKandelSeeder} from "./abstract/AbstractKandelSeeder.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";

///@title AaveKandel strat deployer.
contract AaveKandelSeeder is AbstractKandelSeeder {
  ///@notice a new Kandel with pooled AAVE router has been deployed.
  ///@param owner the owner of the strat. This is indexed so that RPC calls can filter on it.
  ///@param baseQuoteOlKeyHash the hash of the base/quote offer list key. This is indexed so that RPC calls can filter on it.
  ///@param quoteBaseOlKeyHash the hash of the quote/base offer list key. This is indexed so that RPC calls can filter on it.
  ///@param aaveKandel the address of the deployed strat.
  ///@param reserveId the reserve identifier used for the router.
  ///@notice By emitting this data, an indexer will be able to keep track of what Kandel strats are deployed, what market its deployed on, who the owner is and what reserve they use.
  event NewAaveKandel(
    address indexed owner,
    bytes32 indexed baseQuoteOlKeyHash,
    bytes32 indexed quoteBaseOlKeyHash,
    address aaveKandel,
    address reserveId
  );

  ///@notice the Aave router.
  AavePooledRouter public immutable AAVE_ROUTER;

  ///@notice constructor for `AaveKandelSeeder`. Initializes an `AavePooledRouter` with this seeder as manager.
  ///@param mgv The Mangrove deployment.
  ///@param addressesProvider address of AAVE's address provider
  ///@param aaveKandelGasreq the total gasreq to use for executing a kandel offer
  constructor(IMangrove mgv, address addressesProvider, uint aaveKandelGasreq)
    AbstractKandelSeeder(mgv, aaveKandelGasreq)
  {
    AavePooledRouter router = new AavePooledRouter(addressesProvider);
    AAVE_ROUTER = router;
    router.setAaveManager(msg.sender);
  }

  ///@inheritdoc AbstractKandelSeeder
  function _deployKandel(OLKey memory olKeyBaseQuote, bool liquiditySharing)
    internal
    override
    returns (GeometricKandel kandel)
  {
    // Seeder must set Kandel owner to an address that is controlled by `msg.sender` (msg.sender or Kandel's address for instance)
    // owner MUST not be freely chosen (it is immutable in Kandel) otherwise one would allow the newly deployed strat to pull from another's strat reserve
    // allowing owner to be modified by Kandel's admin would require approval from owner's address controller
    address owner = liquiditySharing ? msg.sender : address(0);

    kandel = new AaveKandel(MGV, olKeyBaseQuote, owner);
    // Allowing newly deployed Kandel to bind to the AaveRouter
    AAVE_ROUTER.bind(address(kandel));
    // Setting AaveRouter as Kandel's router and activating router on BASE and QUOTE ERC20
    AaveKandel(payable(kandel)).initialize(AAVE_ROUTER, KANDEL_GASREQ);
    emit NewAaveKandel(msg.sender, olKeyBaseQuote.hash(), olKeyBaseQuote.flipped().hash(), address(kandel), owner);
  }
}
