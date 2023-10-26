// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {IERC20} from "@mgv/lib/IERC20.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MgvLib, OLKey, Offer, Global} from "@mgv/src/core/MgvLib.sol";
import {OfferType} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/TradesBaseQuotePair.sol";
import {
  CoreKandel, TransferLib
} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/CoreKandel.sol";
import {GeometricKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/GeometricKandel.sol";
import {console} from "@mgv/forge-std/Test.sol";
import {StratTest, MangroveTest} from "@mgv-strats/test/lib/StratTest.sol";
import {MgvReader} from "@mgv/src/periphery/MgvReader.sol";
import {toFixed} from "@mgv/lib/Test2.sol";
import {Tick, TickLib} from "@mgv/lib/core/TickLib.sol";
import {DirectWithBidsAndAsksDistribution} from
  "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/DirectWithBidsAndAsksDistribution.sol";

abstract contract KandelTest is StratTest {
  address payable maker;
  address payable taker;
  GeometricKandel kdl;
  uint8 constant STEP_SIZE = 1;
  uint initQuote;
  uint initBase = 0.1 ether;
  uint globalGasprice;
  uint bufferedGasprice;
  // A ratio of ~108% can be converted to a tick offset of ~769 via
  // uint tickOffset = TickLib.tickFromVolumes(1 ether * uint(108000) / (100000), 1 ether);
  uint tickOffset = 769;
  // and vice versa with
  // ratio = uint24(Tick.wrap(tickOffset).inboundFromOutbound(1 ether) * 100000 / Tick.wrap(0).inboundFromOutbound(1 ether)

  OfferType constant Ask = OfferType.Ask;
  OfferType constant Bid = OfferType.Bid;

  event Mgv(IMangrove mgv);
  event OfferListKey(bytes32 olKeyHash);
  event NewKandel(
    address indexed owner, bytes32 indexed baseQuoteOlKeyHash, bytes32 indexed quoteBaseOlKeyHash, address kandel
  );
  event SetStepSize(uint value);
  event SetLength(uint value);
  event SetGasreq(uint value);
  event Credit(IERC20 indexed token, uint amount);
  event Debit(IERC20 indexed token, uint amount);
  event PopulateStart();
  event PopulateEnd();
  event RetractStart();
  event RetractEnd();
  event LogIncident(bytes32 indexed olKeyHash, uint indexed offerId, bytes32 makerData, bytes32 mgvData);
  event SetBaseQuoteTickOffset(uint value);

  // sets environment default is local node with fake base and quote
  function __setForkEnvironment__() internal virtual {
    // no fork
    options.base.symbol = "WETH";
    options.quote.symbol = "USDC";
    options.quote.decimals = 6;
    options.defaultFee = 30;
    options.gasprice = 40;

    MangroveTest.setUp();
  }

  // defines how to deploy a Kandel strat
  function __deployKandel__(address deployer, address reserveId) internal virtual returns (GeometricKandel kdl_);

  function precisionForAssert() internal pure virtual returns (uint) {
    return 0;
  }

  function getAbiPath() internal pure virtual returns (string memory) {
    return "/out/Kandel.sol/Kandel.json";
  }

  function setUp() public virtual override {
    /// sets base, quote, opens a market (base,quote) on Mangrove
    __setForkEnvironment__();
    require(reader != MgvReader(address(0)), "Could not get reader");

    initQuote = cash(quote, 100); // quote given/wanted at index from

    maker = freshAddress("maker");
    taker = freshAddress("taker");
    deal($(base), taker, cash(base, 50));
    deal($(quote), taker, cash(quote, 70_000));

    // taker approves mangrove to be able to take offers
    vm.prank(taker);
    TransferLib.approveToken(base, $(mgv), type(uint).max);
    vm.prank(taker);
    TransferLib.approveToken(quote, $(mgv), type(uint).max);

    // deploy and activate
    (Global global,) = mgv.config(OLKey(address(0), address(0), 0));
    globalGasprice = global.gasprice();
    bufferedGasprice = globalGasprice * 10; // covering 10 times Mangrove's gasprice at deploy time

    kdl = __deployKandel__(maker, maker);

    // funding Kandel on Mangrove
    uint provAsk = reader.getProvision(olKey, kdl.offerGasreq(), bufferedGasprice);
    uint provBid = reader.getProvision(lo, kdl.offerGasreq(), bufferedGasprice);
    deal(maker, (provAsk + provBid) * 10 ether);

    // maker approves Kandel to be able to deposit funds on it
    vm.prank(maker);
    TransferLib.approveToken(base, address(kdl), type(uint).max);
    vm.prank(maker);
    TransferLib.approveToken(quote, address(kdl), type(uint).max);

    uint firstAskIndex = 5;

    GeometricKandel.Params memory params;
    params.stepSize = STEP_SIZE;
    params.pricePoints = 10;
    Tick baseQuoteTickIndex0 = TickLib.tickFromVolumes(initQuote, initBase);

    vm.prank(maker);
    kdl.populateFromOffset{value: (provAsk + provBid) * 10}({
      from: 0,
      to: 5,
      baseQuoteTickIndex0: baseQuoteTickIndex0,
      _baseQuoteTickOffset: tickOffset,
      firstAskIndex: firstAskIndex,
      bidGives: type(uint).max,
      askGives: initBase,
      parameters: params,
      baseAmount: 0,
      quoteAmount: 0
    });
    vm.prank(maker);
    kdl.populateChunkFromOffset({
      from: 5,
      to: 10,
      baseQuoteTickIndex0: baseQuoteTickIndex0,
      firstAskIndex: firstAskIndex,
      bidGives: type(uint).max,
      askGives: initBase
    });
    uint pendingBase = uint(-kdl.pending(Ask));
    uint pendingQuote = uint(-kdl.pending(Bid));
    deal($(base), maker, pendingBase);
    deal($(quote), maker, pendingQuote);

    expectFrom($(kdl));
    emit Credit(base, pendingBase);
    expectFrom($(kdl));
    emit Credit(quote, pendingQuote);
    vm.prank(maker);
    kdl.depositFunds(pendingBase, pendingQuote);
  }

  function buyFromBestAs(address taker_, uint amount) public returns (uint, uint, uint, uint) {
    (, Offer best) = getBestOffers();
    vm.prank(taker_);
    return mgv.marketOrderByTick(olKey, best.tick(), best.gives() >= amount ? amount : best.gives(), true);
  }

  function sellToBestAs(address taker_, uint amount) internal returns (uint, uint, uint, uint) {
    (Offer best,) = getBestOffers();
    vm.prank(taker_);
    return mgv.marketOrderByTick(lo, best.tick(), best.wants() >= amount ? amount : best.wants(), false);
  }

  function cleanBuyBestAs(address taker_, uint amount) public returns (uint, uint) {
    (, Offer best) = getBestOffers();
    uint offerId = mgv.best(olKey);
    vm.prank(taker_);
    return
      mgv.cleanByImpersonation(olKey, wrap_dynamic(MgvLib.CleanTarget(offerId, best.tick(), 1_000_000, amount)), taker_);
  }

  function cleanSellBestAs(address taker_, uint amount) internal returns (uint, uint) {
    (Offer best,) = getBestOffers();
    uint offerId = mgv.best(lo);
    vm.prank(taker_);
    return
      mgv.cleanByImpersonation(lo, wrap_dynamic(MgvLib.CleanTarget(offerId, best.tick(), 1_000_000, amount)), taker_);
  }

  function getParams(GeometricKandel aKandel) internal view returns (GeometricKandel.Params memory params) {
    (uint32 gasprice, uint24 gasreq, uint88 stepSize, uint112 pricePoints) = aKandel.params();

    params.gasprice = gasprice;
    params.gasreq = gasreq;
    params.stepSize = stepSize;
    params.pricePoints = pricePoints;
  }

  enum OfferStatus {
    Dead, // both dead
    Bid, // live bid
    Ask, // live ask
    Crossed // both live
  }

  struct IndexStatus {
    Offer bid;
    Offer ask;
    OfferStatus status;
  }

  function getStatus(uint index) internal view returns (IndexStatus memory idx) {
    idx.bid = kdl.getOffer(Bid, index);
    idx.ask = kdl.getOffer(Ask, index);
    if (idx.bid.gives() > 0 && idx.ask.gives() > 0) {
      idx.status = OfferStatus.Crossed;
    } else {
      if (idx.bid.gives() > 0) {
        idx.status = OfferStatus.Bid;
      } else {
        if (idx.ask.gives() > 0) {
          idx.status = OfferStatus.Ask;
        } else {
          idx.status = OfferStatus.Dead;
        }
      }
    }
  }

  ///@notice asserts status of index.
  function assertStatus(uint index, OfferStatus status) internal {
    assertStatus(index, status, type(uint).max, type(uint).max);
  }

  ///@notice asserts status of index and verifies price based on geometric progressing quote.
  function assertStatus(uint index, OfferStatus status, uint q, uint b) internal {
    Offer bid = kdl.getOffer(Bid, index);
    Offer ask = kdl.getOffer(Ask, index);
    bool bidLive = bid.isLive();
    bool askLive = ask.isLive();

    if (status == OfferStatus.Dead) {
      assertTrue(!bidLive && !askLive, "offer at index is live");
    } else {
      if (status == OfferStatus.Bid) {
        assertTrue(bidLive && !askLive, "Kandel not bidding at index");
        if (q != type(uint).max) {
          assertApproxEqRel(
            bid.gives() * b, q * bid.wants(), 1e14, "Bid price does not follow distribution within 0.00001%"
          );
        }
      } else {
        if (status == OfferStatus.Ask) {
          assertTrue(!bidLive && askLive, "Kandel is not asking at index");
          if (q != type(uint).max) {
            assertApproxEqRel(
              ask.wants() * b, q * ask.gives(), 1e14, "Ask price does not follow distribution within 0.00001%"
            );
          }
        } else {
          assertTrue(bidLive && askLive, "Kandel is not crossed at index");
        }
      }
    }
  }

  function assertStatus(
    uint[] memory offerStatuses // 1:bid 2:ask 3:crossed 0:dead - see OfferStatus
  ) internal {
    assertStatus(offerStatuses, initQuote, initBase);
  }

  function assertStatus(
    uint[] memory offerStatuses, // 1:bid 2:ask 3:crossed 0:dead - see OfferStatus
    uint q, // initial quote at first price point, type(uint).max to ignore in verification
    uint b // initial base at first price point, type(uint).max to ignore in verification
  ) internal {
    assertStatus(offerStatuses, q, b, tickOffset);
  }

  function assertStatus(
    uint[] memory offerStatuses, // 1:bid 2:ask 3:crossed 0:dead - see OfferStatus
    uint q, // initial quote at first price point, type(uint).max to ignore in verification
    uint b, // initial base at first price point, type(uint).max to ignore in verification
    uint _tickOffset
  ) internal {
    uint expectedBids = 0;
    uint expectedAsks = 0;
    for (uint i = 0; i < offerStatuses.length; i++) {
      // `price = quote / initBase` used in assertApproxEqRel below
      OfferStatus offerStatus = OfferStatus(offerStatuses[i]);
      assertStatus(i, offerStatus, q, b);
      if (q != type(uint).max) {
        q = (q * Tick.wrap(int(_tickOffset)).inboundFromOutbound(1 ether)) / 1 ether;
      }
      if (offerStatus == OfferStatus.Ask) {
        expectedAsks++;
      } else if (offerStatus == OfferStatus.Bid) {
        expectedBids++;
      } else if (offerStatus == OfferStatus.Crossed) {
        expectedAsks++;
        expectedBids++;
      }
    }

    (, uint[] memory bidIds,,) = reader.offerList(lo, 0, 1000);
    (, uint[] memory askIds,,) = reader.offerList(olKey, 0, 1000);
    assertEq(expectedBids, bidIds.length, "Unexpected number of live bids on book");
    assertEq(expectedAsks, askIds.length, "Unexpected number of live asks on book");
  }

  enum ExpectedChange {
    Same,
    Increase,
    Decrease
  }

  function assertChange(ExpectedChange expectedChange, uint expected, uint actual, string memory descriptor) internal {
    if (expectedChange == ExpectedChange.Same) {
      assertApproxEqRel(expected, actual, 1e15, string.concat(descriptor, " should be unchanged to within 0.1%"));
    } else if (expectedChange == ExpectedChange.Decrease) {
      assertGt(expected, actual, string.concat(descriptor, " should have decreased"));
    } else {
      assertLt(expected, actual, string.concat(descriptor, " should have increased"));
    }
  }

  function printDistribution(CoreKandel.DistributionOffer[] memory offers) internal view {
    for (uint i; i < offers.length; ++i) {
      console.log(
        "Index: %s tick: %s Gives: %s", offers[i].index, vm.toString(Tick.unwrap(offers[i].tick)), offers[i].gives
      );
    }
  }

  function printDistributions(CoreKandel.Distribution memory distribution) internal view {
    console.log("Bids:");
    printDistribution(distribution.bids);
    console.log("Asks:");
    printDistribution(distribution.asks);
  }

  function printOB() internal view {
    printOfferList(olKey);
    printOfferList(lo);
    uint pendingBase = uint(kdl.pending(Ask));
    uint pendingQuote = uint(kdl.pending(Bid));

    console.log("-------", toFixed(pendingBase, 18), toFixed(pendingQuote, 6), "-------");
  }

  function emptyDist() internal pure returns (CoreKandel.Distribution memory) {
    CoreKandel.Distribution memory emptyDist_;
    return emptyDist_;
  }

  function populateSingle(
    GeometricKandel kandel,
    uint index,
    uint base,
    uint quote,
    uint firstAskIndex,
    bytes memory expectRevert
  ) internal {
    GeometricKandel.Params memory params = getParams(kdl);
    populateSingle(kandel, index, base, quote, firstAskIndex, params.pricePoints, params.stepSize, expectRevert);
  }

  function populateSingle(
    GeometricKandel kandel,
    uint index,
    uint base,
    uint quote,
    uint firstAskIndex,
    uint pricePoints,
    uint stepSize,
    bytes memory expectRevert
  ) internal {
    CoreKandel.Distribution memory distribution;

    if (index < firstAskIndex) {
      distribution.bids = new CoreKandel.DistributionOffer[](1);
      // tick API should set a meaningful price, for now, just set price to 1.
      distribution.bids[0] = DirectWithBidsAndAsksDistribution.DistributionOffer({
        index: index,
        tick: base == 0 || quote == 0 ? Tick.wrap(0) : TickLib.tickFromVolumes(base, quote),
        gives: quote
      });
    } else {
      distribution.asks = new CoreKandel.DistributionOffer[](1);
      // tick API should set a meaningful tick, for now, just set price to 1.
      distribution.asks[0] = DirectWithBidsAndAsksDistribution.DistributionOffer({
        index: index,
        tick: base == 0 || quote == 0 ? Tick.wrap(0) : TickLib.tickFromVolumes(quote, base),
        gives: base
      });
    }

    vm.prank(maker);
    if (expectRevert.length > 0) {
      vm.expectRevert(expectRevert);
    }
    GeometricKandel.Params memory params;
    params.pricePoints = uint112(pricePoints);
    params.stepSize = uint88(stepSize);

    kandel.populate{value: 0.1 ether}(distribution, params, 0, 0);
  }

  function populateConstantDistribution(uint size) internal returns (uint baseAmount, uint quoteAmount) {
    GeometricKandel.Params memory params = getParams(kdl);
    uint firstAskIndex = size / 2;
    CoreKandel.Distribution memory distribution = kdl.createDistribution(
      0,
      size,
      TickLib.tickFromVolumes(initQuote, initBase),
      0,
      firstAskIndex,
      1500 * 10 ** 6,
      1 ether,
      size,
      params.stepSize
    );

    vm.prank(maker);
    kdl.populate{value: maker.balance}(distribution, params, 0, 0);

    for (uint i; i < distribution.bids.length; i++) {
      quoteAmount += distribution.bids[i].gives;
    }
    for (uint i; i < distribution.asks.length; i++) {
      baseAmount += distribution.asks[i].gives;
    }
  }

  function getBestOffers() internal view returns (Offer bestBid, Offer bestAsk) {
    uint bestAskId = mgv.best(olKey);
    uint bestBidId = mgv.best(lo);
    bestBid = mgv.offers(lo, bestBidId);
    bestAsk = mgv.offers(olKey, bestAskId);
  }

  function getMidPrice() internal view returns (uint midWants, uint midGives) {
    (Offer bestBid, Offer bestAsk) = getBestOffers();

    midWants = bestBid.wants() * bestAsk.wants() + bestBid.gives() * bestAsk.gives();
    midGives = bestAsk.gives() * bestBid.wants() * 2;
  }

  function getDeadOffers(uint midGives, uint midWants)
    internal
    view
    returns (uint[] memory indices, uint[] memory quoteAtIndex, uint numBids)
  {
    GeometricKandel.Params memory params = getParams(kdl);

    uint[] memory indicesPre = new uint[](params.pricePoints);
    quoteAtIndex = new uint[](params.pricePoints);
    numBids = 0;

    uint quote = initQuote;

    uint firstAskIndex = type(uint).max;
    for (uint i = 0; i < params.pricePoints; i++) {
      // Decide on bid/ask via mid
      OfferType ba = quote * midGives <= initBase * midWants ? Bid : Ask;
      if (ba == Ask && firstAskIndex == type(uint).max) {
        firstAskIndex = i;
      }
      quoteAtIndex[i] = quote;
      quote = (quote * Tick.wrap(int(uint(tickOffset))).inboundFromOutbound(1 ether)) / 1 ether;
    }

    // find missing offers
    uint numDead = 0;
    for (uint i = 0; i < params.pricePoints; i++) {
      Offer offer = kdl.getOffer(i < firstAskIndex ? Bid : Ask, i);
      if (!offer.isLive()) {
        bool unexpectedDead = false;
        if (i < firstAskIndex) {
          if (i < firstAskIndex - params.stepSize / 2 - params.stepSize % 2) {
            numBids++;
            unexpectedDead = true;
          }
        } else {
          if (i >= firstAskIndex + params.stepSize / 2) {
            unexpectedDead = true;
          }
        }
        if (unexpectedDead) {
          indicesPre[numDead] = i;
          numDead++;
        }
      }
    }

    // truncate indices - cannot do push to memory array
    indices = new uint[](numDead);
    for (uint i = 0; i < numDead; i++) {
      indices[i] = indicesPre[i];
    }
  }
}
