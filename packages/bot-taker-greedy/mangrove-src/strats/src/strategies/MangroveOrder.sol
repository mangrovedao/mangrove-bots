// SPDX-License-Identifier:	BSD-2-Clause
pragma solidity ^0.8.10;

import {IMangrove} from "@mgv/src/IMangrove.sol";
import {Forwarder, MangroveOffer} from "@mgv-strats/src/strategies/offer_forwarder/abstract/Forwarder.sol";
import {IOrderLogic} from "@mgv-strats/src/strategies/interfaces/IOrderLogic.sol";
import {SimpleRouter} from "@mgv-strats/src/strategies/routers/SimpleRouter.sol";
import {MgvLib, IERC20, OLKey} from "@mgv/src/core/MgvLib.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

///@title MangroveOrder. A periphery contract to Mangrove protocol that implements "Good till cancelled" (GTC) orders as well as "Fill or kill" (FOK) orders.
///@notice A GTC order is a buy (sell) limit order complemented by a bid (ask) limit order, called a resting order, that occurs when the buy (sell) order was partially filled.
/// If the GTC is for some amount $a_goal$ at a price $p$, and the corresponding limit order was partially filled for $a_now < a_goal$,
/// the resting order should be posted for an amount $a_later = a_goal - a_now$ at price $p$.
///@notice A FOK order is simply a buy or sell limit order that is either completely filled or cancelled. No resting order is posted.
///@dev requiring no partial fill *and* a resting order is interpreted here as an instruction to revert if the resting order fails to be posted (e.g., if below density).

contract MangroveOrder is Forwarder, IOrderLogic {
  ///@notice `expiring[olKey.hash()][offerId]` gives timestamp beyond which `offerId` on the `olKey.(outbound_tkn, inbound_tkn, tickSpacing)` offer list should renege on trade.
  ///@notice if the order tx is included after the expiry date, it reverts.
  ///@dev 0 means no expiry.
  mapping(bytes32 olKeyHash => mapping(uint offerId => uint expiry)) public expiring;

  ///@notice MangroveOrder is a Forwarder logic with a simple router.
  ///@param mgv The mangrove contract on which this logic will run taker and maker orders.
  ///@param deployer The address of the admin of `this` at the end of deployment
  constructor(IMangrove mgv, address deployer) Forwarder(mgv, new SimpleRouter()) {
    // adding `this` contract to authorized makers of the router before setting admin rights of the router to deployer
    router().bind(address(this));
    router().setAdmin(deployer);
    // if `msg.sender` is not `deployer`, setting admin of `this` to `deployer`.
    // `deployer` will thus be able to call `activate` on `this` to enable trading on particular assets.
    if (msg.sender != deployer) {
      setAdmin(deployer);
    }
  }

  ///@inheritdoc IOrderLogic
  ///@dev We also allow Mangrove to call this so that it can part of an offer logic.
  function setExpiry(bytes32 olKeyHash, uint offerId, uint date) public mgvOrOwner(olKeyHash, offerId) {
    expiring[olKeyHash][offerId] = date;
    emit SetExpiry(olKeyHash, offerId, date);
  }

  ///@notice updates an offer on Mangrove
  ///@dev this can be used to update price of the resting order
  ///@param olKey the offer list key.
  ///@param tick the tick
  ///@param gives new amount of `olKey.outbound_tkn` offer owner gives
  ///@param gasreq new gas req for the restingOrder
  ///@param offerId the id of the offer to be updated
  function updateOffer(OLKey memory olKey, Tick tick, uint gives, uint gasreq, uint offerId)
    external
    payable
    onlyOwner(olKey.hash(), offerId)
  {
    OfferArgs memory args;

    // funds to compute new gasprice is msg.value. Will use old gasprice if no funds are given
    args.fund = msg.value;
    args.olKey = olKey;
    args.tick = tick;
    args.gives = gives;
    args.gasreq = gasreq;
    args.noRevert = false; // will throw if Mangrove reverts
    _updateOffer(args, offerId);
  }

  ///@notice Retracts an offer from an Offer List of Mangrove.
  ///@param olKey the offer list key.
  ///@param offerId the identifier of the offer in the offer list
  ///@param deprovision if set to `true` if offer owner wishes to redeem the offer's provision.
  ///@return freeWei the amount of native tokens (in WEI) that have been retrieved by retracting the offer.
  ///@dev An offer that is retracted without `deprovision` is retracted from the offer list, but still has its provisions locked by Mangrove.
  ///@dev Calling this function, with the `deprovision` flag, on an offer that is already retracted must be used to retrieve the locked provisions.
  function retractOffer(OLKey memory olKey, uint offerId, bool deprovision)
    public
    mgvOrOwner(olKey.hash(), offerId)
    returns (uint freeWei)
  {
    return _retractOffer(olKey, offerId, deprovision);
  }

  ///Checks the current timestamps and reneges on trade (by reverting) if the offer has expired.
  ///@inheritdoc MangroveOffer
  function __lastLook__(MgvLib.SingleOrder calldata order) internal virtual override returns (bytes32) {
    uint exp = expiring[order.olKey.hash()][order.offerId];
    require(exp == 0 || block.timestamp <= exp, "mgvOrder/expired");
    return super.__lastLook__(order);
  }

  ///@notice compares a taker order with a market order result and checks whether the order was entirely filled
  ///@param tko the taker order
  ///@param res the market order result
  ///@return true if the order was entirely filled, false otherwise.
  function checkCompleteness(TakerOrder calldata tko, TakerOrderResult memory res) internal pure returns (bool) {
    // The order can be incomplete if the price becomes too high or the end of the book is reached.
    if (tko.fillWants) {
      // when fillWants is true, the market order stops when `fillVolume` units of `outbound_tkn` have been obtained (minus potential fees);
      return res.takerGot + res.fee >= tko.fillVolume;
    } else {
      // otherwise, the market order stops when `fillVolume` units of `tko.olKey.inbound_tkn` have been sold.
      return res.takerGave >= tko.fillVolume;
    }
  }

  ///@inheritdoc IOrderLogic
  function take(TakerOrder calldata tko) external payable returns (TakerOrderResult memory res) {
    // Checking whether order is expired
    require(tko.expiryDate == 0 || block.timestamp <= tko.expiryDate, "mgvOrder/expired");

    // Notations:
    // NAT_USER: initial value of `msg.sender.balance` (native balance of user)
    // OUT/IN_USER: initial value of `tko.[out|in]bound_tkn.balanceOf(reserve(msg.sender))` (user's reserve balance of tokens)
    // NAT_THIS: initial value of `address(this).balance` (native balance of `this`)
    // OUT/IN_THIS: initial value of `tko.[out|in]bound_tkn.balanceOf(address(this))` (`this` balance of tokens)

    // PRE:
    // * User balances: (NAT_USER -`msg.value`, OUT_USER, IN_USER)
    // * `this` balances: (NAT_THIS +`msg.value`, OUT_THIS, IN_THIS)

    // Pulling funds from `msg.sender`'s reserve
    // `takerGives` is derived via same function as in `execute` of core protocol to ensure same behavior.
    uint takerGives = tko.fillWants ? tko.tick.inboundFromOutboundUp(tko.fillVolume) : tko.fillVolume;
    uint pulled = router().pull(IERC20(tko.olKey.inbound_tkn), msg.sender, takerGives, true);
    require(pulled == takerGives, "mgvOrder/transferInFail");

    // POST:
    // * (NAT_USER-`msg.value`, OUT_USER, IN_USER-`takerGives`)
    // * (NAT_THIS+`msg.value`, OUT_THIS, IN_THIS+`takerGives`)
    logOrderData(tko);

    (res.takerGot, res.takerGave, res.bounty, res.fee) =
      MGV.marketOrderByTick({olKey: tko.olKey, maxTick: tko.tick, fillVolume: tko.fillVolume, fillWants: tko.fillWants});

    // POST:
    // * (NAT_USER-`msg.value`, OUT_USER, IN_USER-`takerGives`)
    // * (NAT_THIS+`msg.value`+`res.bounty`, OUT_THIS+`res.takerGot`, IN_THIS+`takerGives`-`res.takerGave`)

    bool isComplete = checkCompleteness(tko, res);
    // when `!restingOrder` this implements FOK. When `restingOrder` the `postRestingOrder` function reverts if resting order fails to be posted and `fillOrKill`.
    // therefore we require `fillOrKill => (isComplete \/ restingOrder)`
    require(!tko.fillOrKill || isComplete || tko.restingOrder, "mgvOrder/partialFill");

    // sending inbound tokens to `msg.sender`'s reserve and sending back remaining outbound tokens
    if (res.takerGot > 0) {
      require(
        router().push(IERC20(tko.olKey.outbound_tkn), msg.sender, res.takerGot) == res.takerGot, "mgvOrder/pushFailed"
      );
    }
    uint inboundLeft = takerGives - res.takerGave;
    if (inboundLeft > 0) {
      require(
        router().push(IERC20(tko.olKey.inbound_tkn), msg.sender, inboundLeft) == inboundLeft, "mgvOrder/pushFailed"
      );
    }
    // POST:
    // * (NAT_USER-`msg.value`, OUT_USER+`res.takerGot`, IN_USER-`res.takerGave`)
    // * (NAT_THIS+`msg.value`+`res.bounty`, OUT_THIS, IN_THIS)

    ///@dev collected bounty compensates gas consumption for the failed offer, but could be lower than the cost of an additional native token transfer
    /// instead of sending the bounty back to `msg.sender` we recycle it into the resting order's provision (so `msg.sender` can retrieve it when deprovisioning).
    /// corner case: if the bounty is large enough, this will make posting of the resting order fail because of `gasprice` overflow.
    /// The funds will then be sent back to `msg.sender` (see below).
    uint fund = msg.value + res.bounty;

    if ( // resting order is:
      tko.restingOrder // required
        && !isComplete // needed
    ) {
      // When posting a resting order `msg.sender` becomes a maker.
      // For maker orders, outbound tokens are what makers send. Here `msg.sender` sends `tko.olKey.inbound_tkn`.
      // The offer list on which this contract must post `msg.sender`'s resting order is thus `(tko.olKey)`
      // the call below will fill the memory data `res`.
      fund = postRestingOrder({tko: tko, olKey: tko.olKey.flipped(), res: res, fund: fund});
      // POST (case `postRestingOrder` succeeded):
      // * (NAT_USER-`msg.value`, OUT_USER+`res.takerGot`, IN_USER-`res.takerGave`)
      // * (NAT_THIS, OUT_THIS, IN_THIS)
      // * `fund == 0`
      // * `ownerData[tko.olKey.flipped().hash()][res.offerId].owner == msg.sender`.
      // * Mangrove emitted an `OfferWrite` log whose `maker` field is `address(this)` and `offerId` is `res.offerId`.

      // POST (case `postRestingOrder` failed):
      // * (NAT_USER-`msg.value`, OUT_USER+`res.takerGot`, IN_USER-`res.takerGave`)
      // * (NAT_THIS+`msg.value`+`res.bounty`, OUT_THIS, IN_THIS)
      // * `fund == msg.value + res.bounty`.
      // * `res.offerId == 0`
    }

    if (fund > 0) {
      // NB this calls gives reentrancy power to callee, but OK since:
      // 1. callee is `msg.sender` so no griefing risk of making this call fail for out of gas
      // 2. w.r.t reentrancy for profit:
      // * from POST above a reentrant call would entail either:
      //   - `fund == 0` (no additional funds transferred)
      //   - or `fund == msg.value + res.bounty` with `msg.value` being from reentrant call and `res.bounty` from a second resting order.
      // Thus no additional fund can be redeemed by caller using reentrancy.
      (bool noRevert,) = msg.sender.call{value: fund}("");
      require(noRevert, "mgvOrder/refundFail");
    }
    // POST (case `postRestingOrder` succeeded)
    // * (NAT_USER, OUT_USER+`res.takerGot`, IN_USER-`res.takerGave`)
    // * (NAT_THIS, OUT_THIS, IN_THIS)
    // POST (else)
    // * (NAT_USER+`res.bounty`, OUT_USER+`res.takerGot`, IN_USER-`res.takerGave`)
    // * (NAT_THIS, OUT_THIS, IN_THIS)
    emit MangroveOrderComplete();
    return res;
  }

  ///@notice logs `MangroveOrderStart`
  ///@param tko the arguments in memory of the taker order
  ///@dev this function avoids loading too many variables on the stack
  function logOrderData(TakerOrder memory tko) internal {
    emit MangroveOrderStart({
      olKeyHash: tko.olKey.hash(),
      taker: msg.sender,
      fillOrKill: tko.fillOrKill,
      tick: tko.tick,
      fillVolume: tko.fillVolume,
      fillWants: tko.fillWants,
      restingOrder: tko.restingOrder,
      offerId: tko.offerId
    });
  }

  ///@notice posts a maker order on the (`olKey`) offer list.
  ///@param tko the arguments in memory of the taker order
  ///@param olKey the offer list key.
  ///@param fund amount of WEIs used to cover for the offer bounty (covered gasprice is derived from `fund`).
  ///@param res the result of the taker order.
  ///@return refund the amount to refund to the taker of the fund.
  ///@dev if relative limit price of taker order is `ratio` in the (outbound_tkn, inbound_tkn) offer list (represented by `tick=log_{1.0001}(ratio)` )
  ///@dev then entailed relative price for resting order must be `1/ratio` (relative price on the (inbound_tkn, outbound_tkn) offer list)
  ///@dev so with ticks that is `-log(ratio)`, or -tick.
  ///@dev the price of the resting order should be the same as for the max price for the market order.
  function postRestingOrder(TakerOrder calldata tko, OLKey memory olKey, TakerOrderResult memory res, uint fund)
    internal
    returns (uint refund)
  {
    Tick residualTick = Tick.wrap(-Tick.unwrap(tko.tick));
    uint residualGives;
    if (tko.fillWants) {
      // partialFill => tko.fillVolume > res.takerGot + res.fee
      uint residualWants = tko.fillVolume - (res.takerGot + res.fee);
      // adapting residualGives to match relative limit price chosen by the taker
      residualGives = residualTick.outboundFromInboundUp(residualWants);
    } else {
      // partialFill => tko.fillVolume > res.takerGave
      residualGives = tko.fillVolume - res.takerGave;
    }
    OfferArgs memory args = OfferArgs({
      olKey: olKey,
      tick: residualTick,
      gives: residualGives,
      gasreq: tko.restingOrderGasreq,
      gasprice: 0, // ignored
      fund: fund,
      noRevert: true // returns 0 when MGV reverts
    });
    if (tko.offerId == 0) {
      (res.offerId, res.offerWriteData) = _newOffer(args, msg.sender);
    } else {
      uint offerId = tko.offerId;
      require(ownerData[olKey.hash()][offerId].owner == msg.sender, "AccessControlled/Invalid");
      require(!MGV.offers(olKey, offerId).isLive(), "mgvOrder/offerAlreadyActive");
      bytes32 repostData = _updateOffer(args, offerId);
      res.offerWriteData = repostData;
      if (repostData == REPOST_SUCCESS) {
        res.offerId = offerId;
      } else {
        res.offerId = 0;
      }
    }
    if (res.offerId == 0) {
      // either:
      // - residualGives is below current density
      // - `fund` is too low and would yield a gasprice that is lower than Mangrove's
      // - `fund` is too high and would yield a gasprice overflow
      // - offer list is not active (Mangrove is not dead otherwise market order would have reverted)
      // reverting when partial fill is not an option
      require(!tko.fillOrKill, "mgvOrder/partialFill");
      // `fund` is no longer needed so sending it back to `msg.sender`
      refund = fund;
    } else {
      // offer was successfully posted
      // `fund` was used and we leave `refund` at 0.

      // setting expiry date for the resting order
      if (tko.expiryDate > 0) {
        setExpiry(olKey.hash(), res.offerId, tko.expiryDate);
      }
    }
  }
}
