// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity >=0.8.10;

import {IOfferLogic} from "./IOfferLogic.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

///@title Completes IOfferLogic to provide an ABI for LiquidityProvider class of Mangrove's SDK

interface ILiquidityProvider is IOfferLogic {
  ///@notice creates a new offer on Mangrove with an override for gas requirement
  ///@param olKey the offer list key.
  ///@param tick the tick
  ///@param gives the amount of inbound tokens the offer maker gives for a complete fill
  ///@param gasreq the gas required by the offer logic
  ///@return offerId the Mangrove offer id.
  function newOffer(OLKey memory olKey, Tick tick, uint gives, uint gasreq) external payable returns (uint offerId);

  ///@notice updates an offer existing on Mangrove (not necessarily live) with an override for gas requirement
  ///@param olKey the offer list key.
  ///@param tick the tick
  ///@param gives the new amount of inbound tokens the offer maker gives for a complete fill
  ///@param offerId the id of the offer in the offer list.
  ///@param gasreq the gas required by the offer logic
  function updateOffer(OLKey memory olKey, Tick tick, uint gives, uint offerId, uint gasreq) external payable;

  ///@notice Retracts an offer from an Offer List of Mangrove.
  ///@param olKey the offer list key.
  ///@param offerId the identifier of the offer in the offer list
  ///@param deprovision if set to `true` if offer owner wishes to redeem the offer's provision.
  ///@return freeWei the amount of native tokens (in WEI) that have been retrieved by retracting the offer.
  ///@dev An offer that is retracted without `deprovision` is retracted from the offer list, but still has its provisions locked by Mangrove.
  ///@dev Calling this function, with the `deprovision` flag, on an offer that is already retracted must be used to retrieve the locked provisions.
  function retractOffer(OLKey memory olKey, uint offerId, bool deprovision) external returns (uint freeWei);
}
