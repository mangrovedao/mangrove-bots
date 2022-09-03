// SPDX-License-Identifier:	BSD-2-Clause

// Mango.sol

// Copyright (c) 2021 Giry SAS. All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
pragma solidity ^0.8.10;
pragma abicoder v2;
import "./MangoStorage.sol";
import "./MangoImplementation.sol";
import "../../abstract/Persistent.sol";
import "../../../routers/AbstractRouter.sol";
import "../../../routers/SimpleRouter.sol";

/** Discrete automated market making strat */
/** This AMM is headless (no price model) and market makes on `NSLOTS` price ranges*/
/** current `Pmin` is the price of an offer at position `0`, current `Pmax` is the price of an offer at position `NSLOTS-1`*/
/** Initially `Pmin = P(0) = QUOTE_0/BASE_0` and the general term is P(i) = __quote_progression__(i)/BASE_0 */
/** NB `__quote_progression__` is a hook that defines how price increases with positions and is by default an arithmetic progression, i.e __quote_progression__(i) = QUOTE_0 + `delta`*i */
/** When one of its offer is matched on Mangrove, the headless strat does the following: */
/** Each time this strat receives b `BASE` tokens (bid was taken) at price position i, it increases the offered (`BASE`) volume of the ask at position i+1 of 'b'*/
/** Each time this strat receives q `QUOTE` tokens (ask was taken) at price position i, it increases the offered (`QUOTE`) volume of the bid at position i-1 of 'q'*/
/** In case of a partial fill of an offer at position i, the offer residual is reposted (see `Persistent` strat class)*/

contract Mango is Persistent {
  // emitted when init function has been called and AMM becomes active
  event Initialized(uint from, uint to);

  address private immutable IMPLEMENTATION;

  uint public immutable NSLOTS;
  IERC20 public immutable BASE;
  IERC20 public immutable QUOTE;

  // Asks and bids offer Ids are stored in `ASKS` and `BIDS` arrays respectively.

  constructor(
    IMangrove mgv,
    IERC20 base,
    IERC20 quote,
    uint base_0,
    uint quote_0,
    uint nslots,
    uint price_incr,
    address deployer
  )
    Persistent(
      mgv,
      250_000, // gas cost for trade execution (w/o taking routing specific gas cost)
      new SimpleRouter() // routes liqudity from (to) reserve to (from) this contract
    )
  {
    MangoStorage.Layout storage mStr = MangoStorage.get_storage();
    // sanity check
    require(
      nslots > 0 &&
        address(mgv) != address(0) &&
        uint16(nslots) == nslots &&
        uint96(base_0) == base_0 &&
        uint96(quote_0) == quote_0,
      "Mango/constructor/invalidArguments"
    );

    NSLOTS = nslots;

    // implementation should have correct immutables
    IMPLEMENTATION = address(
      new MangoImplementation(
        mgv,
        base,
        quote,
        uint96(base_0),
        uint96(quote_0),
        nslots
      )
    );
    BASE = base;
    QUOTE = quote;
    // setting local storage
    mStr.asks = new uint[](nslots);
    mStr.bids = new uint[](nslots);
    mStr.delta = price_incr;
    // logs `BID/ASKatMin/MaxPosition` events when only 1 slot remains
    mStr.min_buffer = 1;

    // activates Mango on `quote` and `base`
    __activate__(base);
    __activate__(quote);

    // in order to let deployer's EOA have control over liquidity
    set_reserve(deployer);

    // `this` deployed the router, letting admin take control over it.
    router().set_admin(deployer);

    // setting admin of contract if a static address deployment was used
    if (deployer != msg.sender) {
      set_admin(deployer);
    }
  }

  // populate mangrove order book with bids or/and asks in the price range R = [`from`, `to`[
  // tokenAmounts are always expressed `gives`units, i.e in BASE when asking and in QUOTE when bidding
  function initialize(
    bool reset,
    uint lastBidPosition, // if `lastBidPosition` is in R, then all offers before `lastBidPosition` (included) will be bids, offers strictly after will be asks.
    uint from, // first price position to be populated
    uint to, // last price position to be populated
    uint[][2] calldata pivotIds, // `pivotIds[0][i]` ith pivots for bids, `pivotIds[1][i]` ith pivot for asks
    uint[] calldata tokenAmounts // `tokenAmounts[i]` is the amount of `BASE` or `QUOTE` tokens (dePENDING on `withBase` flag) that is used to fixed one parameter of the price at position `from+i`.
  ) public mgvOrAdmin {
    // making sure a router has been defined between deployment and initialization
    require(address(router()) != address(0), "Mango/initialize/0xRouter");

    (bool success, bytes memory retdata) = IMPLEMENTATION.delegatecall(
      abi.encodeWithSelector(
        MangoImplementation.$initialize.selector,
        reset,
        lastBidPosition,
        from,
        to,
        pivotIds,
        tokenAmounts,
        ofr_gasreq()
      )
    );
    if (!success) {
      MangoStorage.revertWithData(retdata);
    } else {
      emit Initialized({from: from, to: to});
    }
  }

  function reset_pending() external onlyAdmin {
    MangoStorage.Layout storage mStr = MangoStorage.get_storage();
    mStr.pending_base = 0;
    mStr.pending_quote = 0;
  }

  /** Setters and getters */
  function delta() external view onlyAdmin returns (uint) {
    return MangoStorage.get_storage().delta;
  }

  function set_delta(uint _delta) public mgvOrAdmin {
    MangoStorage.get_storage().delta = _delta;
  }

  function shift() external view onlyAdmin returns (int) {
    return MangoStorage.get_storage().shift;
  }

  function pending() external view onlyAdmin returns (uint[2] memory) {
    MangoStorage.Layout storage mStr = MangoStorage.get_storage();
    return [mStr.pending_base, mStr.pending_quote];
  }

  // with ba=0:bids only, ba=1: asks only ba>1 all
  function retractOffers(
    uint ba,
    uint from,
    uint to
  ) external onlyAdmin returns (uint collected) {
    // with ba=0:bids only, ba=1: asks only ba>1 all
    MangoStorage.Layout storage mStr = MangoStorage.get_storage();
    for (uint i = from; i < to; i++) {
      if (ba > 0) {
        // asks or bids+asks
        collected += mStr.asks[i] > 0
          ? retractOffer(BASE, QUOTE, mStr.asks[i], true)
          : 0;
      }
      if (ba == 0 || ba > 1) {
        // bids or bids + asks
        collected += mStr.bids[i] > 0
          ? retractOffer(QUOTE, BASE, mStr.bids[i], true)
          : 0;
      }
    }
  }

  /** Shift the price (induced by quote amount) of n slots down or up */
  /** price at position i will be shifted (up or down dePENDING on the sign of `shift`) */
  /** New positions 0<= i < s are initialized with amount[i] in base tokens if `withBase`. In quote tokens otherwise*/
  function set_shift(
    int s,
    bool withBase,
    uint[] calldata amounts
  ) public mgvOrAdmin {
    (bool success, bytes memory retdata) = IMPLEMENTATION.delegatecall(
      abi.encodeWithSelector(
        MangoImplementation.$set_shift.selector,
        s,
        withBase,
        amounts,
        ofr_gasreq()
      )
    );
    if (!success) {
      MangoStorage.revertWithData(retdata);
    }
  }

  function set_min_offer_type(uint m) external mgvOrAdmin {
    MangoStorage.get_storage().min_buffer = m;
  }

  function _staticdelegatecall(bytes calldata data)
    external
    onlyCaller(address(this))
  {
    (bool success, bytes memory retdata) = IMPLEMENTATION.delegatecall(data);
    if (!success) {
      MangoStorage.revertWithData(retdata);
    }
    assembly {
      return(add(retdata, 32), returndatasize())
    }
  }

  // return Mango offer Ids on Mangrove. If `liveOnly` will only return offer Ids that are live (0 otherwise).
  function get_offers(bool liveOnly)
    external
    view
    returns (uint[][2] memory offers)
  {
    (bool success, bytes memory retdata) = address(this).staticcall(
      abi.encodeWithSelector(
        this._staticdelegatecall.selector,
        abi.encodeWithSelector(
          MangoImplementation.$get_offers.selector,
          liveOnly
        )
      )
    );
    if (!success) {
      MangoStorage.revertWithData(retdata);
    } else {
      return abi.decode(retdata, (uint[][2]));
    }
  }

  // starts reneging all offers
  // NB reneged offers will not be reposted
  function pause() public mgvOrAdmin {
    MangoStorage.get_storage().paused = true;
  }

  function restart() external onlyAdmin {
    MangoStorage.get_storage().paused = false;
  }

  function is_paused() external view returns (bool) {
    return MangoStorage.get_storage().paused;
  }

  // this overrides is read during `makerExecute` call (see `MangroveOffer`)
  function __lastLook__(ML.SingleOrder calldata order)
    internal
    virtual
    override
    returns (bool proceed)
  {
    order; //shh
    proceed = !MangoStorage.get_storage().paused;
  }

  // residual gives is default (i.e offer.gives - order.wants) + PENDING
  // this overrides the corresponding function in `Persistent`
  function __residualGives__(ML.SingleOrder calldata order)
    internal
    virtual
    override
    returns (uint)
  {
    MangoStorage.Layout storage mStr = MangoStorage.get_storage();
    if (order.outbound_tkn == address(BASE)) {
      // Ask offer
      return super.__residualGives__(order) + mStr.pending_base;
    } else {
      // Bid offer
      return super.__residualGives__(order) + mStr.pending_quote;
    }
  }

  // for reposting partial filled offers one always gives the residual (default behavior)
  // and adapts wants to the new price (if different).
  // this overrides the corresponding function in `Persistent`
  function __residualWants__(ML.SingleOrder calldata order)
    internal
    virtual
    override
    returns (uint)
  {
    uint residual = __residualGives__(order);
    if (residual == 0) {
      return 0;
    }
    (bool success, bytes memory retdata) = IMPLEMENTATION.delegatecall(
      abi.encodeWithSelector(
        MangoImplementation.$residualWants.selector,
        order,
        residual
      )
    );
    if (!success) {
      MangoStorage.revertWithData(retdata);
    } else {
      return abi.decode(retdata, (uint));
    }
  }

  function __posthookSuccess__(ML.SingleOrder calldata order)
    internal
    virtual
    override
    returns (bool)
  {
    MangoStorage.Layout storage mStr = MangoStorage.get_storage();
    bool reposted = super.__posthookSuccess__(order);

    if (order.outbound_tkn == address(BASE)) {
      if (!reposted) {
        // residual could not be reposted --either below density or Mango went out of provision on Mangrove
        mStr.pending_base = __residualGives__(order); // this includes previous `pending_base`
      } else {
        mStr.pending_base = 0;
      }
    } else {
      if (!reposted) {
        // residual could not be reposted --either below density or Mango went out of provision on Mangrove
        mStr.pending_quote = __residualGives__(order); // this includes previous `pending_base`
      } else {
        mStr.pending_quote = 0;
      }
    }

    (bool success, bytes memory retdata) = IMPLEMENTATION.delegatecall(
      abi.encodeWithSelector(
        MangoImplementation.$postDualOffer.selector,
        order,
        ofr_gasreq()
      )
    );
    if (!success) {
      MangoStorage.revertWithData(retdata);
    } else {
      return abi.decode(retdata, (bool));
    }
  }
}
