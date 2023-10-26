// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {Kandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/Kandel.sol";
import {GeometricKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/GeometricKandel.sol";
import {CoreKandelTest} from "./abstract/CoreKandel.t.sol";
import {CoreKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/CoreKandel.sol";
import {OfferType} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/TradesBaseQuotePair.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

///@title Tests for Kandel without a router, and router agnostic functions.
contract NoRouterKandelTest is CoreKandelTest {
  function __deployKandel__(address deployer, address reserveId) internal override returns (GeometricKandel kdl_) {
    uint GASREQ = 126000;
    OLKey memory olKey = OLKey(address(base), address(quote), options.defaultTickSpacing);

    vm.expectEmit(true, true, true, true);
    emit Mgv(mgv);
    vm.expectEmit(true, true, true, true);
    emit OfferListKey(olKey.hash());
    vm.expectEmit(true, true, true, true);
    emit SetGasreq(GASREQ);
    vm.prank(deployer);
    kdl_ = new Kandel({
      mgv: mgv,
      olKeyBaseQuote: olKey,
      gasreq: GASREQ,
      reserveId: reserveId
    });
  }

  function validateDistribution(
    CoreKandel.DistributionOffer[] memory distributionOffers,
    uint baseQuoteTickOffset,
    Tick baseQuoteTickIndex0,
    OfferType ba,
    uint gives,
    uint dualGives
  ) internal returns (uint zeroes) {
    bool constantGives = gives != type(uint).max;
    for (uint i = 0; i < distributionOffers.length; ++i) {
      CoreKandel.DistributionOffer memory offer = distributionOffers[i];
      uint index = offer.index;
      assertTrue(!seenOffers[ba][index], string.concat("index ", vm.toString(index), " seen twice"));
      seenOffers[ba][index] = true;

      int absoluteTickAtIndex = Tick.unwrap(baseQuoteTickIndex0) + int(index) * int(baseQuoteTickOffset);
      if (ba == Bid) {
        assertEq(Tick.unwrap(offer.tick), -absoluteTickAtIndex);
      } else {
        assertEq(Tick.unwrap(offer.tick), absoluteTickAtIndex);
      }
      // can be a dual
      if (offer.gives > 0) {
        if (constantGives) {
          assertEq(offer.gives, gives, "givesDist should be constant");
        } else {
          uint wants = offer.tick.inboundFromOutbound(offer.gives);
          assertApproxEqRel(wants, dualGives, 1e10, "wants should be approximately constant");
        }
      } else {
        zeroes++;
      }
    }
  }

  mapping(OfferType ba => mapping(uint index => bool seen)) internal seenOffers;

  struct SimpleDistributionHeapArgs {
    Tick baseQuoteTickIndex0;
    uint baseQuoteTickOffset;
    uint firstAskIndex;
    uint askGives;
    uint bidGives;
    uint pricePoints;
    uint stepSize;
  }

  function test_createDistributionSimple_constantAskBidGives(uint firstAskIndex, uint bidGives, uint askGives) internal {
    test_createDistributionSimple_constantAskBidGives(firstAskIndex, bidGives, askGives, 1);
  }

  function test_createDistributionSimple_constantAskBidGives(
    uint firstAskIndex,
    uint bidGives,
    uint askGives,
    uint stepSize
  ) internal {
    SimpleDistributionHeapArgs memory args;
    args.firstAskIndex = firstAskIndex;
    args.askGives = askGives;
    args.bidGives = bidGives;
    args.pricePoints = 5;
    args.stepSize = stepSize;
    args.baseQuoteTickIndex0 = Tick.wrap(500);
    args.baseQuoteTickOffset = 1000;
    test_createDistributionSimple_constantAskBidGives(args, dynamic([uint(2), 4]));
  }

  function test_createDistributionSimple_constantAskBidGives_fuzz(uint seed) public {
    SimpleDistributionHeapArgs memory args;
    uint r = 0;
    args.pricePoints = uint(keccak256(abi.encodePacked(seed, ++r))) % 20;
    if (args.pricePoints < 2) {
      args.pricePoints = 2;
    }
    args.firstAskIndex = uint(keccak256(abi.encodePacked(seed, ++r))) % (args.pricePoints + 1);
    args.stepSize = uint(keccak256(abi.encodePacked(seed, ++r))) % args.pricePoints;
    if (args.stepSize == 0) {
      args.stepSize = 1;
    }
    if (uint(keccak256(abi.encodePacked(seed, ++r))) % 2 == 0) {
      args.askGives = 1 ether;
      if (uint(keccak256(abi.encodePacked(seed, ++r))) % 2 == 0) {
        args.bidGives = 3 ether;
      } else {
        args.bidGives = type(uint).max;
      }
    } else {
      args.askGives = type(uint).max;
      args.bidGives = 2 ether;
    }
    args.baseQuoteTickIndex0 = Tick.wrap(500);
    args.baseQuoteTickOffset = 1000;
    uint[] memory cuts = new uint[](uint(keccak256(abi.encodePacked(seed, ++r))) % args.pricePoints);
    if (cuts.length == 0) {
      cuts = new uint[](1);
    }
    for (uint i = 0; i < cuts.length; ++i) {
      cuts[i] =
        (i > 0 ? cuts[i - 1] : 0) + (args.pricePoints / cuts.length + uint(keccak256(abi.encodePacked(seed, ++r))) % 3);
      if (cuts[i] > args.pricePoints) {
        cuts[i] = args.pricePoints;
      }
    }
    test_createDistributionSimple_constantAskBidGives(args, cuts);
  }

  function test_createDistributionSimple_constantAskBidGives(SimpleDistributionHeapArgs memory args, uint[] memory cuts)
    internal
  {
    CoreKandel.Distribution[] memory distribution = new CoreKandel.Distribution[](cuts.length+1);

    for (uint i = 0; i < cuts.length; i++) {
      distribution[i] = kdl.createDistribution({
        from: i > 0 ? cuts[i - 1] : 0,
        to: i < cuts.length - 1 ? cuts[i] : args.pricePoints,
        baseQuoteTickIndex0: args.baseQuoteTickIndex0,
        _baseQuoteTickOffset: args.baseQuoteTickOffset,
        firstAskIndex: args.firstAskIndex,
        askGives: args.askGives,
        bidGives: args.bidGives,
        pricePoints: args.pricePoints,
        stepSize: args.stepSize
      });
    }

    uint totalIndices = 0;
    uint totalZeros = 0;
    for (uint i = 0; i < distribution.length; i++) {
      totalIndices += distribution[i].bids.length + distribution[i].asks.length;
      totalZeros += validateDistribution(
        distribution[i].bids,
        args.baseQuoteTickOffset,
        args.baseQuoteTickIndex0,
        OfferType.Bid,
        args.bidGives,
        args.askGives
      );
      totalZeros += validateDistribution(
        distribution[i].asks,
        args.baseQuoteTickOffset,
        args.baseQuoteTickIndex0,
        OfferType.Ask,
        args.askGives,
        args.bidGives
      );
    }

    for (uint i = 0; i < args.pricePoints; ++i) {
      if (i < args.stepSize) {
        if (i < args.pricePoints - args.stepSize) {
          assertTrue(seenOffers[Bid][i], string.concat("bid not seen at index ", vm.toString(i)));
        } else {
          assertFalse(
            seenOffers[Bid][i],
            string.concat("bid seen too close to end for dual ask to be possible at index ", vm.toString(i))
          );
        }
        assertFalse(
          seenOffers[Ask][i], string.concat("ask seen at index in stepSize hole at low index ", vm.toString(i))
        );
      } else if (i >= args.pricePoints - args.stepSize) {
        assertFalse(
          seenOffers[Bid][i], string.concat("bid seen at index in stepSize hole at high index ", vm.toString(i))
        );
        assertTrue(seenOffers[Ask][i], string.concat("ask not seen at index ", vm.toString(i)));
      } else {
        assertTrue(seenOffers[Bid][i], string.concat("bid not seen at index ", vm.toString(i)));
        assertTrue(seenOffers[Ask][i], string.concat("ask not seen at index ", vm.toString(i)));
      }
      // Reset to allow multiple tests in one function.
      seenOffers[Bid][i] = false;
      seenOffers[Ask][i] = false;
    }

    assertEq(totalIndices, 2 * (args.pricePoints - args.stepSize), "an offer and its dual, except near end");
    if (args.bidGives != 0 && args.askGives != 0) {
      assertEq(totalZeros, args.pricePoints - args.stepSize);
    }
  }

  function test_createDistribution_constantAskGives() public {
    test_createDistributionSimple_constantAskBidGives(0, type(uint).max, 2 ether);
    test_createDistributionSimple_constantAskBidGives(1, type(uint).max, 2 ether);
    test_createDistributionSimple_constantAskBidGives(2, type(uint).max, 2 ether);
    test_createDistributionSimple_constantAskBidGives(3, type(uint).max, 2 ether);
    test_createDistributionSimple_constantAskBidGives(4, type(uint).max, 2 ether);
    test_createDistributionSimple_constantAskBidGives(5, type(uint).max, 2 ether, 4);
    test_createDistributionSimple_constantAskBidGives(0, type(uint).max, 2 ether, 4);
    test_createDistributionSimple_constantAskBidGives(3, type(uint).max, 2 ether, 2);
    test_createDistributionSimple_constantAskBidGives(2, type(uint).max, 2 ether, 2);
  }

  function test_createDistribution_constantBidGives() public {
    test_createDistributionSimple_constantAskBidGives(0, 2 ether, type(uint).max);
    test_createDistributionSimple_constantAskBidGives(1, 2 ether, type(uint).max);
    test_createDistributionSimple_constantAskBidGives(2, 2 ether, type(uint).max);
    test_createDistributionSimple_constantAskBidGives(3, 2 ether, type(uint).max);
  }

  function test_createDistribution_constantGives() public {
    test_createDistributionSimple_constantAskBidGives(1, 2 ether, 4 ether);
  }

  function test_createDistribution_constantGives_0() public {
    test_createDistributionSimple_constantAskBidGives(2, 0, 0);
  }

  function test_createDistribution_bothVariable() public {
    vm.expectRevert("Kandel/bothGivesVariable");
    kdl.createDistribution({
      from: 0,
      to: 2,
      baseQuoteTickIndex0: Tick.wrap(0),
      _baseQuoteTickOffset: 0,
      firstAskIndex: 1,
      askGives: type(uint).max,
      bidGives: type(uint).max,
      pricePoints: 10,
      stepSize: 1
    });
  }
}
