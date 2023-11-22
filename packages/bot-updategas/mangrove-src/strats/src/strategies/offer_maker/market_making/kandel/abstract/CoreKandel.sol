// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {MgvLib, OLKey, Offer} from "@mgv/src/core/MgvLib.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {OfferType} from "./TradesBaseQuotePair.sol";
import {DirectWithBidsAndAsksDistribution} from "./DirectWithBidsAndAsksDistribution.sol";
import {TradesBaseQuotePair} from "./TradesBaseQuotePair.sol";
import {TransferLib} from "@mgv/lib/TransferLib.sol";
import {KandelLib} from "./KandelLib.sol";
import {MAX_SAFE_VOLUME} from "@mgv/lib/core/Constants.sol";

///@title the core of Kandel strategies which creates or updates a dual offer whenever an offer is taken.
///@notice `CoreKandel` is agnostic to the chosen price distribution.
abstract contract CoreKandel is DirectWithBidsAndAsksDistribution, TradesBaseQuotePair {
  ///@notice the gasprice has been set.
  ///@param value the gasprice for offers.
  ///@notice By emitting this data, an indexer will be able to keep track of what gasprice is used.
  event SetGasprice(uint value);

  ///@notice the gasreq has been set.
  ///@param value the gasreq (including router's gasreq) for offers
  ///@notice By emitting this data, an indexer will be able to keep track of what gasreq is used.
  event SetGasreq(uint value);

  ///@notice the step size has been set.
  ///@param value the step size in amount of price points to jump for posting dual offer
  event SetStepSize(uint value);

  ///@notice the Kandel instance is credited of `amount` by its owner.
  ///@param token the asset. This is indexed so that RPC calls can filter on it.
  ///@param amount the amount.
  ///@notice By emitting this data, an indexer will be able to keep track of what credits are made.
  event Credit(IERC20 indexed token, uint amount);

  ///@notice the Kandel instance is debited of `amount` by its owner.
  ///@param token the asset. This is indexed so that RPC calls can filter on it.
  ///@param amount the amount.
  ///@notice By emitting this data, an indexer will be able to keep track of what debits are made.
  event Debit(IERC20 indexed token, uint amount);

  ///@notice Core Kandel parameters
  ///@param gasprice the gasprice to use for offers. Must hold on 26 bits.
  ///@param gasreq the gasreq to use for offers
  ///@param stepSize in amount of price points to jump for posting dual offer.
  ///@param pricePoints the number of price points for the Kandel instance.
  struct Params {
    uint32 gasprice;
    uint24 gasreq;
    uint32 stepSize;
    uint32 pricePoints;
  }

  ///@notice Storage of the parameters for the strat.
  Params public params;

  ///@notice sets the step size
  ///@param stepSize the step size.
  function setStepSize(uint stepSize) public onlyAdmin {
    uint32 stepSize_ = uint32(stepSize);
    require(stepSize > 0, "Kandel/stepSizeTooLow");
    require(stepSize_ == stepSize && stepSize < params.pricePoints, "Kandel/stepSizeTooHigh");
    params.stepSize = stepSize_;
    emit SetStepSize(stepSize);
  }

  ///@notice sets the gasprice for offers
  ///@param gasprice the gasprice.
  function setGasprice(uint gasprice) public onlyAdmin {
    require(gasprice < 1 << 26, "Kandel/gaspriceTooHigh");
    params.gasprice = uint32(gasprice);
    emit SetGasprice(gasprice);
  }

  ///@notice sets the gasreq (including router's gasreq) for offers
  ///@param gasreq the gasreq.
  function setGasreq(uint gasreq) public onlyAdmin {
    uint24 gasreq_ = uint24(gasreq);
    require(gasreq_ == gasreq, "Kandel/gasreqTooHigh");
    params.gasreq = gasreq_;
    emit SetGasreq(gasreq_);
  }

  /// @notice Updates the params to new values.
  /// @param newParams the new params to set.
  function setParams(Params calldata newParams) internal {
    Params memory oldParams = params;

    if (oldParams.pricePoints != newParams.pricePoints) {
      uint32 pricePoints_ = uint32(newParams.pricePoints);
      require(pricePoints_ == newParams.pricePoints && pricePoints_ >= 2, "Kandel/invalidPricePoints");
      setLength(pricePoints_);
      params.pricePoints = pricePoints_;
    }

    if (oldParams.stepSize != newParams.stepSize) {
      setStepSize(newParams.stepSize);
    }

    if (newParams.gasprice != 0 && newParams.gasprice != oldParams.gasprice) {
      setGasprice(newParams.gasprice);
    }

    if (newParams.gasreq != 0 && newParams.gasreq != oldParams.gasreq) {
      setGasreq(newParams.gasreq);
    }
  }

  ///@notice Constructor
  ///@param mgv The Mangrove deployment.
  ///@param olKeyBaseQuote The OLKey for the outbound_tkn base and inbound_tkn quote offer list Kandel will act on, the flipped OLKey is used for the opposite offer list.
  ///@param reserveId identifier of this contract's reserve when using a router.
  constructor(IMangrove mgv, OLKey memory olKeyBaseQuote, address reserveId)
    TradesBaseQuotePair(olKeyBaseQuote)
    DirectWithBidsAndAsksDistribution(mgv, reserveId)
  {}

  ///@notice publishes bids/asks for the distribution in the `indices`. Care must be taken to publish offers in meaningful chunks. For Kandel an offer and its dual should be published in the same chunk (one being optionally initially dead).
  ///@param distribution the distribution of bids and asks to populate
  ///@param parameters the parameters for Kandel. Only changed parameters will cause updates. Set `gasreq` and `gasprice` to 0 to keep existing values.
  ///@param baseAmount base amount to deposit
  ///@param quoteAmount quote amount to deposit
  ///@dev This function is used at initialization and can fund with provision for the offers.
  ///@dev Use `populateChunk` to split up initialization or re-initialization with same parameters, as this function will emit.
  ///@dev If this function is invoked with different pricePoints or stepSize, then first retract all offers.
  ///@dev msg.value must be enough to provision all posted offers (for chunked initialization only one call needs to send native tokens).
  function populate(Distribution memory distribution, Params calldata parameters, uint baseAmount, uint quoteAmount)
    public
    payable
    onlyAdmin
  {
    if (msg.value > 0) {
      MGV.fund{value: msg.value}();
    }
    setParams(parameters);

    depositFunds(baseAmount, quoteAmount);

    populateChunkInternal(distribution, params.gasreq, params.gasprice);
  }

  ///@notice Publishes bids/asks for the distribution in the `indices`. Care must be taken to publish offers in meaningful chunks. For Kandel an offer and its dual should be published in the same chunk (one being optionally initially dead).
  ///@notice This function is used externally after `populate` to reinitialize some indices or if multiple transactions are needed to split initialization due to gas cost.
  ///@notice This function is not payable, use `populate` to fund along with populate.
  ///@param distribution the distribution of bids and asks to populate
  function populateChunk(Distribution calldata distribution) external onlyAdmin {
    Params memory parameters = params;
    populateChunkInternal(distribution, parameters.gasreq, parameters.gasprice);
  }

  ///@notice the total balance available for the strat of the offered token for the given offer type.
  ///@param ba the offer type.
  ///@return balance the balance of the token.
  function reserveBalance(OfferType ba) public view virtual returns (uint balance) {
    IERC20 token = outboundOfOfferType(ba);
    return token.balanceOf(address(this));
  }

  ///@notice takes care of status for updating dual and logging of potential issues.
  ///@param offerId the Mangrove offer id.
  ///@param args the arguments of the offer.
  ///@param updateOfferStatus the status returned from the `_updateOffer` function.
  function logUpdateOfferStatus(uint offerId, OfferArgs memory args, bytes32 updateOfferStatus) internal {
    if (updateOfferStatus == REPOST_SUCCESS || updateOfferStatus == "mgv/writeOffer/density/tooLow") {
      // Low density will mean some amount is not posted and will be available for withdrawal or later posting via populate.
      return;
    }
    emit LogIncident(args.olKey.hash(), offerId, "Kandel/updateOfferFailed", updateOfferStatus);
  }

  ///@notice update or create dual offer according to transport logic
  ///@param order is a recall of the taker order that is at the origin of the current trade.
  function transportSuccessfulOrder(MgvLib.SingleOrder calldata order) internal {
    OfferType ba = offerTypeOfOutbound(IERC20(order.olKey.outbound_tkn));

    // adds any unpublished liquidity to pending[Base/Quote]
    // preparing arguments for the dual offer
    (uint offerId, OfferArgs memory args) = transportLogic(ba, order);

    // All offers are created up front (see populateChunk), so here we update to set new gives.
    bytes32 updateOfferStatus = _updateOffer(args, offerId);
    logUpdateOfferStatus(offerId, args, updateOfferStatus);
  }

  ///@notice transport logic followed by Kandel
  ///@param ba whether the offer that was executed is a bid or an ask
  ///@param order a recap of the taker order (order.offer is the executed offer)
  ///@return dualOfferId the offer id of the dual offer
  ///@return args the argument for updating an offer
  function transportLogic(OfferType ba, MgvLib.SingleOrder calldata order)
    internal
    virtual
    returns (uint dualOfferId, OfferArgs memory args)
  {
    uint index = indexOfOfferId(ba, order.offerId);
    Params memory memoryParams = params;
    OfferType baDual = dual(ba);

    uint dualIndex = KandelLib.transportDestination(baDual, index, memoryParams.stepSize, memoryParams.pricePoints);

    dualOfferId = offerIdOfIndex(baDual, dualIndex);
    args.olKey = offerListOfOfferType(baDual);
    Offer dualOffer = MGV.offers(args.olKey, dualOfferId);

    // gives from order.takerGives:127 dualOffer.gives():127, so args.gives:128
    args.gives = order.takerGives + dualOffer.gives();
    if (args.gives > MAX_SAFE_VOLUME) {
      // this should not be reached under normal circumstances unless strat is posting on top of an existing offer with an abnormal volume
      // to prevent gives to be too high, we let the surplus become "pending" (unpublished liquidity)
      args.gives = MAX_SAFE_VOLUME;
      // There is no similar limit to dualOffer.wants() for allowed ticks and gives.
    }

    // keep existing price of offer
    args.tick = dualOffer.tick();

    // args.fund = 0; the offers are already provisioned
    // posthook should not fail if unable to post offers, we capture the error as incidents
    args.noRevert = true;
    // use newest gasreq and gasprice
    args.gasprice = memoryParams.gasprice;
    args.gasreq = memoryParams.gasreq;
  }

  /// @notice gets pending liquidity for base (ask) or quote (bid). Will be negative if funds are not enough to cover all offer's promises.
  /// @param ba offer type.
  /// @return the pending amount
  /// @dev Gas costly function, better suited for off chain calls.
  function pending(OfferType ba) external view returns (int) {
    return int(reserveBalance(ba)) - int(offeredVolume(ba));
  }

  ///@notice Deposits funds to the contract's reserve
  ///@param baseAmount the amount of base tokens to deposit.
  ///@param quoteAmount the amount of quote tokens to deposit.
  function depositFunds(uint baseAmount, uint quoteAmount) public virtual {
    require(TransferLib.transferTokenFrom(BASE, msg.sender, address(this), baseAmount), "Kandel/baseTransferFail");
    emit Credit(BASE, baseAmount);
    require(TransferLib.transferTokenFrom(QUOTE, msg.sender, address(this), quoteAmount), "Kandel/quoteTransferFail");
    emit Credit(QUOTE, quoteAmount);
  }

  ///@notice withdraws funds from the contract's reserve
  ///@param baseAmount the amount of base tokens to withdraw. Use type(uint).max to denote the entire reserve balance.
  ///@param quoteAmount the amount of quote tokens to withdraw. Use type(uint).max to denote the entire reserve balance.
  ///@param recipient the address to which the withdrawn funds should be sent to.
  ///@dev it is up to the caller to make sure there are still enough funds for live offers.
  function withdrawFunds(uint baseAmount, uint quoteAmount, address recipient) public virtual onlyAdmin {
    withdrawFundsForToken(BASE, baseAmount, recipient);
    withdrawFundsForToken(QUOTE, quoteAmount, recipient);
  }

  ///@notice withdraws funds from the contract's reserve for the given token
  ///@param token the token to withdraw.
  ///@param amount the amount of tokens to withdraw. Use type(uint).max to denote the entire reserve balance.
  ///@param recipient the address to which the withdrawn funds should be sent to.
  function withdrawFundsForToken(IERC20 token, uint amount, address recipient) internal virtual {
    if (amount == type(uint).max) {
      amount = token.balanceOf(address(this));
    }
    require(TransferLib.transferToken(token, recipient, amount), "Kandel/transferFail");
    emit Debit(token, amount);
  }

  ///@notice Retracts offers, withdraws funds, and withdraws free wei from Mangrove.
  ///@param from retract offers starting from this index.
  ///@param to retract offers until this index.
  ///@param baseAmount the amount of base tokens to withdraw. Use type(uint).max to denote the entire reserve balance.
  ///@param quoteAmount the amount of quote tokens to withdraw. Use type(uint).max to denote the entire reserve balance.
  ///@param freeWei the amount of wei to withdraw from Mangrove. Use type(uint).max to withdraw entire available balance.
  ///@param recipient the recipient of the funds.
  function retractAndWithdraw(
    uint from,
    uint to,
    uint baseAmount,
    uint quoteAmount,
    uint freeWei,
    address payable recipient
  ) external onlyAdmin {
    retractOffers(from, to);
    withdrawFunds(baseAmount, quoteAmount, recipient);
    withdrawFromMangrove(freeWei, recipient);
  }
}
