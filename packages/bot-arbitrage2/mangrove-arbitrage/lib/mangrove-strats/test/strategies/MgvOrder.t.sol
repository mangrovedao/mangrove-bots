// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {StratTest, MgvReader, TestMaker, TestTaker, TestSender, console} from "@mgv-strats/test/lib/StratTest.sol";

import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MangroveOrder as MgvOrder, SimpleRouter} from "@mgv-strats/src/strategies/MangroveOrder.sol";
import {PinnedPolygonFork} from "@mgv/test/lib/forks/Polygon.sol";
import {TransferLib} from "@mgv/lib/TransferLib.sol";
import {IOrderLogic} from "@mgv-strats/src/strategies/interfaces/IOrderLogic.sol";
import {MgvLib, IERC20, OLKey, Offer, OfferDetail} from "@mgv/src/core/MgvLib.sol";
import {TestToken} from "@mgv/test/lib/tokens/TestToken.sol";
import {toFixed} from "@mgv/lib/Test2.sol";
import {TickLib} from "@mgv/lib/core/TickLib.sol";
import {MAX_TICK} from "@mgv/lib/core/Constants.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";

library TickNegator {
  function negate(Tick tick) internal pure returns (Tick) {
    return Tick.wrap(-Tick.unwrap(tick));
  }
}

contract MangroveOrder_Test is StratTest {
  using TickNegator for Tick;

  uint constant GASREQ = 82000; // see MangroveOrderGasreqBaseTest
  uint constant MID_PRICE = 2000e18;
  // to check ERC20 logging

  event Transfer(address indexed from, address indexed to, uint value);

  event MangroveOrderStart(
    bytes32 indexed olKeyHash,
    address indexed taker,
    bool fillOrKill,
    Tick tick,
    uint fillVolume,
    bool fillWants,
    bool restingOrder,
    uint offerId
  );

  event MangroveOrderComplete();

  MgvOrder internal mgo;
  TestMaker internal ask_maker;
  TestMaker internal bid_maker;

  TestTaker internal sell_taker;
  PinnedPolygonFork internal fork;

  IOrderLogic.TakerOrderResult internal cold_buyResult;
  IOrderLogic.TakerOrderResult internal cold_sellResult;

  receive() external payable {}

  function tickFromPrice_e18(uint priceE18) internal pure returns (Tick tick) {
    (uint mantissa, uint exp) = TickLib.ratioFromVolumes(priceE18, 1e18);
    tick = TickLib.tickFromRatio(mantissa, int(exp));
  }

  function makerWants(IOrderLogic.TakerOrder memory order) internal pure returns (uint) {
    return
      order.fillWants ? order.fillVolume : Tick.wrap(-Tick.unwrap(order.tick)).inboundFromOutboundUp(order.fillVolume);
  }

  function makerGives(IOrderLogic.TakerOrder memory order) internal pure returns (uint) {
    return
      order.fillWants ? Tick.wrap(-Tick.unwrap(order.tick)).outboundFromInboundUp(order.fillVolume) : order.fillVolume;
  }

  function takerWants(IOrderLogic.TakerOrder memory order) internal pure returns (uint) {
    return order.fillWants ? order.fillVolume : order.tick.outboundFromInboundUp(order.fillVolume);
  }

  function takerGives(IOrderLogic.TakerOrder memory order) internal pure returns (uint) {
    return order.fillWants ? order.tick.inboundFromOutboundUp(order.fillVolume) : order.fillVolume;
  }

  function setUp() public override {
    fork = new PinnedPolygonFork(39880000);
    fork.setUp();
    options.gasprice = 90;
    options.gasbase = 68_000;
    options.defaultFee = 30;
    mgv = setupMangrove();
    reader = new MgvReader($(mgv));
    base = TestToken(fork.get("WETH"));
    quote = TestToken(fork.get("DAI"));
    olKey = OLKey(address(base), address(quote), options.defaultTickSpacing);
    lo = olKey.flipped();
    setupMarket(olKey);

    // this contract is admin of MgvOrder and its router
    mgo = new MgvOrder(IMangrove(payable(mgv)), $(this), GASREQ);
    // mgvOrder needs to approve mangrove for inbound & outbound token transfer (inbound when acting as a taker, outbound when matched as a maker)
    IERC20[] memory tokens = new IERC20[](2);
    tokens[0] = base;
    tokens[1] = quote;
    mgo.activate(tokens);

    // `this` contract will act as `MgvOrder` user
    deal($(base), $(this), 10 ether);
    deal($(quote), $(this), 10_000 ether);

    // user approves `mgo` to pull quote or base when doing a market order
    TransferLib.approveToken(quote, $(mgo.router()), 10_000 ether);
    TransferLib.approveToken(base, $(mgo.router()), 10 ether);

    // `sell_taker` will take resting bid
    sell_taker = setupTaker(olKey, "sell-taker");
    deal($(base), $(sell_taker), 10 ether);

    // if seller wants to sell directly on mangrove
    vm.prank($(sell_taker));
    TransferLib.approveToken(base, $(mgv), 10 ether);
    // if seller wants to sell via mgo
    vm.prank($(sell_taker));
    TransferLib.approveToken(quote, $(mgv), 10 ether);

    // populating order book with offers
    ask_maker = setupMaker(olKey, "ask-maker");
    vm.deal($(ask_maker), 10 ether);

    bid_maker = setupMaker(lo, "bid-maker");
    vm.deal($(bid_maker), 10 ether);

    deal($(base), $(ask_maker), 10 ether);
    deal($(quote), $(bid_maker), 10000 ether);

    // pre populating book with cold maker offers.
    ask_maker.approveMgv(base, 10 ether);
    uint volume = 1 ether;
    ask_maker.newOfferByTickWithFunding(olKey, tickFromPrice_e18(MID_PRICE), volume, 50_000, 0, 0.1 ether);
    ask_maker.newOfferByTickWithFunding(olKey, tickFromPrice_e18(MID_PRICE + 1e18), volume, 50_000, 0, 0.1 ether);
    ask_maker.newOfferByTickWithFunding(olKey, tickFromPrice_e18(MID_PRICE + 2e18), volume, 50_000, 0, 0.1 ether);

    bid_maker.approveMgv(quote, 10000 ether);
    bid_maker.newOfferByTickWithFunding(
      lo, tickFromPrice_e18(MID_PRICE - 10e18).negate(), 2000e18, 50_000, 0, 0.1 ether
    );
    bid_maker.newOfferByTickWithFunding(
      lo, tickFromPrice_e18(MID_PRICE - 11e18).negate(), 2000e18, 50_000, 0, 0.1 ether
    );
    bid_maker.newOfferByTickWithFunding(
      lo, tickFromPrice_e18(MID_PRICE - 12e18).negate(), 2000e18, 50_000, 0, 0.1 ether
    );

    IOrderLogic.TakerOrder memory buyOrder;
    IOrderLogic.TakerOrder memory sellOrder;
    // depositing a cold MangroveOrder offer.
    buyOrder = createBuyOrderEvenLowerPriceAndLowerVolume();
    buyOrder.restingOrder = true;
    buyOrder.expiryDate = block.timestamp + 1;

    sellOrder = createSellOrderEvenLowerPriceAndLowerVolume();
    sellOrder.restingOrder = true;
    sellOrder.expiryDate = block.timestamp + 1;

    cold_buyResult = mgo.take{value: 0.1 ether}(buyOrder);
    cold_sellResult = mgo.take{value: 0.1 ether}(sellOrder);

    assertTrue(cold_buyResult.offerId * cold_sellResult.offerId > 0, "Resting offer failed to be published on mangrove");
    // mgo ask
    // 4 ┆ 1999 DAI  /  1 WETH 0xc7183455a4C133Ae270771860664b6B7ec320bB1
    // maker asks
    // 1 ┆ 2000 DAI  /  1 WETH 0x1d1499e622D69689cdf9004d05Ec547d650Ff211
    // 2 ┆ 2001 DAI  /  1 WETH 0x1d1499e622D69689cdf9004d05Ec547d650Ff211
    // 3 ┆ 2002 DAI  /  1 WETH 0x1d1499e622D69689cdf9004d05Ec547d650Ff211
    // ------------------------------------------------------------------
    // mgo bid
    // 4 ┆ 1 WETH  /  1991 0xc7183455a4C133Ae270771860664b6B7ec320bB1
    // maker bids
    // 1 ┆ 1 WETH  /  1990 DAI 0xA4AD4f68d0b91CFD19687c881e50f3A00242828c
    // 2 ┆ 1 WETH  /  1989 DAI 0xA4AD4f68d0b91CFD19687c881e50f3A00242828c
    // 3 ┆ 1 WETH  /  1988 DAI 0xA4AD4f68d0b91CFD19687c881e50f3A00242828c
  }

  function test_admin() public {
    assertEq(mgv.governance(), mgo.admin(), "Invalid admin address");
  }

  function freshTaker(uint balBase, uint balQuote) internal returns (address fresh_taker) {
    fresh_taker = freshAddress("MgvOrderTester");
    deal($(quote), fresh_taker, balQuote);
    deal($(base), fresh_taker, balBase);
    deal(fresh_taker, 1 ether);
    vm.startPrank(fresh_taker);
    quote.approve(address(mgo.router()), type(uint).max);
    base.approve(address(mgo.router()), type(uint).max);
    vm.stopPrank();
  }

  ////////////////////////
  /// Tests taker side ///
  ////////////////////////

  function createBuyOrder() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 2 ether;
    order = IOrderLogic.TakerOrder({
      olKey: olKey,
      fillOrKill: false,
      fillWants: true,
      fillVolume: fillVolume,
      tick: tickFromPrice_e18(MID_PRICE - 1e18),
      restingOrder: false,
      expiryDate: 0, //NA
      offerId: 0
    });
  }

  /// At half the volume, but same price
  function createBuyOrderHalfVolume() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 1 ether;
    order = createBuyOrder();
    order.fillVolume = fillVolume;
  }

  function createBuyOrderHigherPrice() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 2 ether;
    order = createBuyOrder();
    // A high price so as to take ask_maker's offers
    order.fillVolume = fillVolume;
    order.tick = tickFromPrice_e18(MID_PRICE + 10000e18);
  }

  /// At lower price, same volume
  function createBuyOrderLowerPrice() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 2 ether;
    order = createBuyOrder();
    order.fillVolume = fillVolume;
    order.tick = tickFromPrice_e18(MID_PRICE - 2e18);
  }

  function createBuyOrderEvenLowerPriceAndLowerVolume() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 1 ether;
    order = createBuyOrder();
    order.fillVolume = fillVolume;
    order.tick = tickFromPrice_e18(MID_PRICE - 9e18);
  }

  function createSellOrder() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 2 ether;
    order = IOrderLogic.TakerOrder({
      olKey: lo,
      fillOrKill: false,
      fillWants: false,
      tick: tickFromPrice_e18(MID_PRICE - 9e18).negate(),
      fillVolume: fillVolume,
      restingOrder: false,
      expiryDate: 0, //NA
      offerId: 0
    });
  }

  function createSellOrderLowerPrice() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 2 ether;
    order = createSellOrder();
    order.tick = tickFromPrice_e18(MID_PRICE - 8e18).negate();
    order.fillVolume = fillVolume;
  }

  function createSellOrderHalfVolume() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 1 ether;
    order = createSellOrder();
    order.tick = tickFromPrice_e18(MID_PRICE - 9e18).negate();
    order.fillVolume = fillVolume;
  }

  function createSellOrderEvenLowerPriceAndLowerVolume() internal view returns (IOrderLogic.TakerOrder memory order) {
    uint fillVolume = 1 ether;
    order = createSellOrder();
    order.tick = tickFromPrice_e18(MID_PRICE - 1e18).negate();
    order.fillVolume = fillVolume;
  }

  function test_partial_filled_buy_order_is_transferred_to_taker() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrder();
    address fresh_taker = freshTaker(0, takerGives(buyOrder) * 2);
    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);
    assertEq(res.takerGot, reader.minusFee(olKey, takerWants(buyOrder) / 2), "Incorrect partial fill of taker order");
    assertEq(res.takerGave, takerGives(buyOrder) / 2, "Incorrect partial fill of taker order");
    assertEq(base.balanceOf(fresh_taker), res.takerGot, "Funds were not transferred to taker");
  }

  function test_partial_filled_buy_order_reverts_when_FoK_enabled() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrder();
    buyOrder.fillOrKill = true;
    address fresh_taker = freshTaker(0, takerGives(buyOrder) * 2);
    vm.prank(fresh_taker);
    vm.expectRevert("mgvOrder/partialFill");
    mgo.take{value: 0.1 ether}(buyOrder);
  }

  function test_order_reverts_when_expiry_date_is_in_the_past() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrder();
    buyOrder.fillOrKill = true;
    buyOrder.expiryDate = block.timestamp - 1;
    address fresh_taker = freshTaker(0, takerGives(buyOrder) * 2);
    vm.prank(fresh_taker);
    vm.expectRevert("mgvOrder/expired");
    mgo.take{value: 0.1 ether}(buyOrder);
  }

  function test_partial_filled_returns_value_and_remaining_inbound() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrder();
    address fresh_taker = freshTaker(0, takerGives(buyOrder));
    uint balBefore = fresh_taker.balance;
    vm.prank(fresh_taker);
    mgo.take{value: 0.1 ether}(buyOrder);
    assertEq(balBefore, fresh_taker.balance, "Take function did not return value to taker");
    assertEq(
      takerGives(buyOrder) - takerGives(buyOrder) / 2,
      quote.balanceOf(fresh_taker),
      "Take did not return remainder to taker"
    );
  }

  function test_partial_filled_order_returns_bounty() public {
    ask_maker.shouldRevert(true);
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderHigherPrice();
    address fresh_taker = freshTaker(0, takerGives(buyOrder));
    uint balBefore = fresh_taker.balance;
    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);
    assertTrue(res.bounty > 0, "Bounty should not be zero");
    assertEq(balBefore + res.bounty, fresh_taker.balance, "Take function did not return bounty");
  }

  function test_filled_resting_buy_order_ignores_resting_option_and_returns_value() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderHalfVolume();
    buyOrder.restingOrder = true;
    address fresh_taker = freshTaker(0, 4000 ether);
    uint nativeBalBefore = fresh_taker.balance;
    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);
    assertEq(res.offerId, 0, "There should be no resting order");
    assertEq(quote.balanceOf(fresh_taker), 4000 ether - takerGives(buyOrder), "incorrect quote balance");
    assertEq(base.balanceOf(fresh_taker), res.takerGot, "incorrect base balance");
    assertEq(fresh_taker.balance, nativeBalBefore, "value was not returned to taker");
  }

  function test_filled_resting_buy_order_with_FoK_succeeds_and_returns_provision() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderHalfVolume();
    buyOrder.fillOrKill = true;
    address fresh_taker = freshTaker(0, takerGives(buyOrder));
    uint nativeBalBefore = fresh_taker.balance;
    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);
    assertEq(res.offerId, 0, "There should be no resting order");
    assertEq(quote.balanceOf(fresh_taker), 0, "incorrect quote balance");
    assertEq(base.balanceOf(fresh_taker), res.takerGot, "incorrect base balance");
    assertEq(fresh_taker.balance, nativeBalBefore, "value was not returned to taker");
  }

  function test_taken_resting_order_reused() public {
    // Arrange - Take resting order
    vm.prank($(sell_taker));
    mgv.marketOrderByTick(lo, Tick.wrap(MAX_TICK), 1000000 ether, true);
    assertFalse(mgv.offers(lo, cold_buyResult.offerId).isLive(), "Offer should be taken and not live");

    // Act - Create new resting order, but reuse id
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderLowerPrice();
    buyOrder.offerId = cold_buyResult.offerId;
    buyOrder.restingOrder = true;

    expectFrom($(mgo));
    logOrderData($(this), buyOrder);
    expectFrom($(mgo));
    emit MangroveOrderComplete();

    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);

    // Assert
    Offer offer = mgv.offers(lo, res.offerId);
    assertEq(res.offerId, buyOrder.offerId, "OfferId should be reused");
    assertTrue(offer.isLive(), "Offer be live");
    assertEq(offer.gives(), makerGives(buyOrder), "Incorrect offer gives");
    assertApproxEqAbs(offer.wants(), makerWants(buyOrder), 1, "Incorrect offer wants");
    assertEq(offer.tick(), buyOrder.tick.negate(), "Incorrect offer price");
  }

  function test_taken_resting_order_not_reused_if_live() public {
    // Arrange
    assertTrue(mgv.offers(lo, cold_buyResult.offerId).isLive(), "Offer should live");

    // Act - Create new resting order, but reuse id
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderLowerPrice();
    buyOrder.offerId = cold_buyResult.offerId;
    buyOrder.restingOrder = true;

    // Assert
    vm.expectRevert("mgvOrder/offerAlreadyActive");
    mgo.take{value: 0.1 ether}(buyOrder);
  }

  function test_taken_resting_order_not_reused_if_not_owned() public {
    // Arrange - Take resting order
    vm.prank($(sell_taker));
    mgv.marketOrderByTick(lo, Tick.wrap(MAX_TICK), 1000000 ether, true);
    assertFalse(mgv.offers(lo, cold_buyResult.offerId).isLive(), "Offer should be taken and not live");

    // Act/assert - Create new resting order, but reuse id
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderLowerPrice();
    buyOrder.offerId = cold_buyResult.offerId;
    buyOrder.restingOrder = true;

    address router = $(mgo.router());
    vm.prank($(sell_taker));
    TransferLib.approveToken(quote, router, takerGives(buyOrder) + makerGives(buyOrder));
    deal($(quote), $(sell_taker), takerGives(buyOrder) + makerGives(buyOrder));

    vm.expectRevert("AccessControlled/Invalid");
    // Not owner
    vm.prank($(sell_taker));
    mgo.take{value: 0.1 ether}(buyOrder);
  }

  ///////////////////////
  /// Test maker side ///
  ///////////////////////

  function logOrderData(address taker, IOrderLogic.TakerOrder memory tko) internal {
    emit MangroveOrderStart(
      tko.olKey.hash(), taker, tko.fillOrKill, tko.tick, tko.fillVolume, tko.fillWants, tko.restingOrder, tko.offerId
    );
  }

  function test_partial_fill_buy_with_resting_order_is_correctly_posted() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrder();
    buyOrder.restingOrder = true;

    IOrderLogic.TakerOrderResult memory expectedResult = IOrderLogic.TakerOrderResult({
      takerGot: reader.minusFee(lo, 1 ether),
      takerGave: takerGives(buyOrder) / 2,
      bounty: 0,
      fee: 1 ether - reader.minusFee(lo, 1 ether),
      offerId: 5,
      offerWriteData: "offer/created"
    });

    address fresh_taker = freshTaker(0, takerGives(buyOrder));
    uint nativeBalBefore = fresh_taker.balance;

    // checking log emission
    expectFrom($(mgo));
    logOrderData(fresh_taker, buyOrder);
    expectFrom($(mgo));
    emit MangroveOrderComplete();

    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);

    assertTrue(res.offerId > 0, "Offer not posted");
    assertEq(fresh_taker.balance, nativeBalBefore - 0.1 ether, "Value not deposited");
    assertEq(mgo.provisionOf(lo, res.offerId), 0.1 ether, "Offer not provisioned");
    // checking mappings
    assertEq(mgo.ownerOf(lo.hash(), res.offerId), fresh_taker, "Invalid offer owner");
    assertEq(
      quote.balanceOf(fresh_taker), takerGives(buyOrder) - expectedResult.takerGave, "Incorrect remaining quote balance"
    );
    assertEq(base.balanceOf(fresh_taker), reader.minusFee(olKey, 1 ether), "Incorrect obtained base balance");
    assertEq(res.offerWriteData, expectedResult.offerWriteData, "Incorrect offer write data");
    // checking price of offer
    Offer offer = mgv.offers(lo, res.offerId);
    OfferDetail detail = mgv.offerDetails(lo, res.offerId);
    assertEq(offer.gives(), makerGives(buyOrder) / 2, "Incorrect offer gives");
    assertEq(offer.wants(), makerWants(buyOrder) / 2 + 1, "Incorrect offer wants");
    assertEq(offer.prev(), 0, "Offer should be best of the book");
    assertEq(detail.maker(), address(mgo), "Incorrect maker");
  }

  function test_empty_fill_buy_with_resting_order_is_correctly_posted() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderLowerPrice();
    buyOrder.restingOrder = true;

    address fresh_taker = freshTaker(0, takerGives(buyOrder));
    uint nativeBalBefore = fresh_taker.balance;

    // checking log emission
    expectFrom($(mgo));
    logOrderData(fresh_taker, buyOrder);
    expectFrom($(mgo));
    emit MangroveOrderComplete();

    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(buyOrder);

    assertTrue(res.offerId > 0, "Offer not posted");
    assertEq(fresh_taker.balance, nativeBalBefore - 0.1 ether, "Value not deposited");
    assertEq(mgo.provisionOf(lo, res.offerId), 0.1 ether, "Offer not provisioned");
    // checking mappings
    assertEq(mgo.ownerOf(lo.hash(), res.offerId), fresh_taker, "Invalid offer owner");
    assertEq(quote.balanceOf(fresh_taker), takerGives(buyOrder), "Incorrect remaining quote balance");
    assertEq(base.balanceOf(fresh_taker), 0, "Incorrect obtained base balance");
    // checking price of offer
    Offer offer = mgv.offers(lo, res.offerId);
    OfferDetail detail = mgv.offerDetails(lo, res.offerId);
    assertEq(offer.gives(), makerGives(buyOrder), "Incorrect offer gives");
    assertApproxEqAbs(offer.wants(), makerWants(buyOrder), 1, "Incorrect offer wants");
    assertEq(offer.tick(), buyOrder.tick.negate(), "Incorrect offer price");
    assertEq(offer.prev(), 0, "Offer should be best of the book");
    assertEq(detail.maker(), address(mgo), "Incorrect maker");
  }

  function test_partial_fill_sell_with_resting_order_is_correctly_posted() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrder();
    sellOrder.restingOrder = true;

    IOrderLogic.TakerOrderResult memory expectedResult = IOrderLogic.TakerOrderResult({
      takerGot: reader.minusFee(lo, takerWants(sellOrder) / 2) + 1,
      takerGave: takerGives(sellOrder) / 2 + 1,
      bounty: 0,
      fee: takerWants(sellOrder) / 2 - reader.minusFee(lo, takerWants(sellOrder) / 2) - 1,
      offerId: 5,
      offerWriteData: "offer/created"
    });

    address fresh_taker = freshTaker(takerGives(sellOrder), 0);
    uint nativeBalBefore = fresh_taker.balance;

    // checking log emission
    expectFrom($(mgo));
    logOrderData(fresh_taker, sellOrder);
    expectFrom($(mgo));
    emit MangroveOrderComplete();

    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(sellOrder);

    assertTrue(res.offerId > 0, "Offer not posted");
    assertEq(fresh_taker.balance, nativeBalBefore - 0.1 ether, "Value not deposited");
    assertEq(mgo.provisionOf(olKey, res.offerId), 0.1 ether, "Offer not provisioned");
    // checking mappings
    assertEq(mgo.ownerOf(olKey.hash(), res.offerId), fresh_taker, "Invalid offer owner");
    assertEq(
      base.balanceOf(fresh_taker), takerGives(sellOrder) - expectedResult.takerGave, "Incorrect remaining base balance"
    );
    assertEq(quote.balanceOf(fresh_taker), expectedResult.takerGot, "Incorrect obtained quote balance");
    assertEq(res.offerWriteData, expectedResult.offerWriteData, "Incorrect offer write data");
    // checking price of offer
    Offer offer = mgv.offers(olKey, res.offerId);
    OfferDetail detail = mgv.offerDetails(olKey, res.offerId);
    assertEq(offer.gives(), makerGives(sellOrder) / 2 - 1, "Incorrect offer gives");

    assertApproxEqRel(offer.wants(), makerWants(sellOrder) / 2, 1e4, "Incorrect offer wants");
    assertEq(offer.prev(), 0, "Offer should be best of the book");
    assertEq(detail.maker(), address(mgo), "Incorrect maker");
  }

  function test_partial_fill_sell_with_resting_order_below_density() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrder();
    sellOrder.restingOrder = true;
    sellOrder.fillVolume = 1 ether; // the amount that will be filled, used to calculate expected taker result

    IOrderLogic.TakerOrderResult memory expectedResult = IOrderLogic.TakerOrderResult({
      takerGot: reader.minusFee(lo, takerWants(sellOrder)) + 1,
      takerGave: 1 ether,
      bounty: 0,
      fee: takerWants(sellOrder) / 2 - reader.minusFee(lo, takerWants(sellOrder) / 2) - 1,
      offerId: 5,
      offerWriteData: "mgv/writeOffer/density/tooLow"
    });

    sellOrder.fillVolume = 1 ether + 10; // ask for a tiny bit more, so the remaining too low to repost

    address fresh_taker = freshTaker(takerGives(sellOrder), 0);
    uint nativeBalBefore = fresh_taker.balance;

    // checking log emission
    expectFrom($(mgo));
    logOrderData(fresh_taker, sellOrder);
    expectFrom($(mgo));
    emit MangroveOrderComplete();

    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(sellOrder);

    assertTrue(res.offerId == 0, "Offer should not be posted");
    assertEq(res.offerWriteData, expectedResult.offerWriteData, "Incorrect offer write data");
    assertEq(fresh_taker.balance, nativeBalBefore, "No provision should be transferred");
    // checking mappings
    assertEq(
      base.balanceOf(fresh_taker),
      takerGives(sellOrder) - expectedResult.takerGave - 1,
      "Incorrect remaining base balance"
    );
    assertEq(quote.balanceOf(fresh_taker), expectedResult.takerGot, "Incorrect obtained quote balance");
  }

  function test_empty_fill_sell_with_resting_order_is_correctly_posted() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrderLowerPrice();
    sellOrder.restingOrder = true;

    address fresh_taker = freshTaker(2 ether, 0);
    uint nativeBalBefore = fresh_taker.balance;

    // checking log emission
    expectFrom($(mgo));
    logOrderData(fresh_taker, sellOrder);
    expectFrom($(mgo));
    emit MangroveOrderComplete();

    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(sellOrder);

    assertTrue(res.offerId > 0, "Offer not posted");
    assertEq(fresh_taker.balance, nativeBalBefore - 0.1 ether, "Value not deposited");
    assertEq(mgo.provisionOf(olKey, res.offerId), 0.1 ether, "Offer not provisioned");
    // checking mappings
    assertEq(mgo.ownerOf(olKey.hash(), res.offerId), fresh_taker, "Invalid offer owner");
    assertEq(base.balanceOf(fresh_taker), takerGives(sellOrder), "Incorrect remaining base balance");
    assertEq(quote.balanceOf(fresh_taker), 0, "Incorrect obtained quote balance");
    // checking price of offer
    Offer offer = mgv.offers(olKey, res.offerId);
    OfferDetail detail = mgv.offerDetails(olKey, res.offerId);
    assertEq(offer.gives(), makerGives(sellOrder), "Incorrect offer gives");
    assertEq(offer.wants(), makerWants(sellOrder), "Incorrect offer wants");
    assertEq(offer.prev(), 0, "Offer should be best of the book");
    assertEq(detail.maker(), address(mgo), "Incorrect maker");
  }

  function test_resting_order_with_expiry_date_is_correctly_posted() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrder();
    sellOrder.restingOrder = true;
    sellOrder.expiryDate = block.timestamp + 1;
    address fresh_taker = freshTaker(2 ether, 0);
    vm.prank(fresh_taker);
    IOrderLogic.TakerOrderResult memory res = mgo.take{value: 0.1 ether}(sellOrder);
    assertEq(mgo.expiring(olKey.hash(), res.offerId), block.timestamp + 1, "Incorrect expiry");
  }

  function test_resting_buy_order_for_blacklisted_reserve_for_inbound_reverts() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrderHalfVolume();
    sellOrder.restingOrder = true;
    address fresh_taker = freshTaker(1 ether, 0);
    vm.mockCall(
      $(quote),
      abi.encodeWithSelector(
        quote.transferFrom.selector, $(mgo), fresh_taker, reader.minusFee(lo, takerWants(sellOrder))
      ),
      abi.encode(false)
    );
    vm.expectRevert("mgvOrder/pushFailed");
    vm.prank(fresh_taker);
    mgo.take{value: 0.1 ether}(sellOrder);
  }

  function test_resting_buy_order_failing_to_post_returns_tokens_and_provision() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrder();
    sellOrder.restingOrder = true;
    address fresh_taker = freshTaker(2 ether, 0);
    uint oldNativeBal = fresh_taker.balance;
    // pretend new offer failed for some reason
    vm.mockCall($(mgv), abi.encodeWithSelector(mgv.newOfferByTick.selector), abi.encode(uint(0)));
    vm.prank(fresh_taker);
    mgo.take{value: 0.1 ether}(sellOrder);
    assertEq(fresh_taker.balance, oldNativeBal, "Taker's provision was not returned");
  }

  function test_restingOrder_that_fail_to_post_revert_if_no_partialFill() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrder();
    sellOrder.restingOrder = true;
    sellOrder.fillOrKill = true;
    address fresh_taker = freshTaker(2 ether, 0);
    // pretend new offer failed for some reason
    vm.mockCall($(mgv), abi.encodeWithSelector(mgv.newOfferByTick.selector), abi.encode(uint(0)));
    vm.expectRevert("mgvOrder/partialFill");
    vm.prank(fresh_taker);
    mgo.take{value: 0.1 ether}(sellOrder);
  }

  function test_taker_unable_to_receive_eth_makes_tx_throw_if_resting_order_could_not_be_posted() public {
    IOrderLogic.TakerOrder memory sellOrder = createSellOrder();
    sellOrder.restingOrder = true;
    TestSender sender = new TestSender();
    vm.deal($(sender), 1 ether);

    deal($(base), $(sender), 2 ether);
    sender.refuseNative();

    vm.startPrank($(sender));
    TransferLib.approveToken(base, $(mgo.router()), type(uint).max);
    vm.stopPrank();
    // mocking MangroveOrder failure to post resting offer
    vm.mockCall($(mgv), abi.encodeWithSelector(mgv.newOfferByTick.selector), abi.encode(uint(0)));
    /// since `sender` throws on `receive()`, this should fail.
    vm.expectRevert("mgvOrder/refundFail");
    vm.prank($(sender));
    // complete fill will not lead to a resting order
    mgo.take{value: 0.1 ether}(sellOrder);
  }

  //////////////////////////////////////
  /// Test resting order consumption ///
  //////////////////////////////////////

  function test_resting_buy_offer_can_be_partially_filled() public {
    // sniping resting sell offer: 4 ┆ 1999 DAI  /  1 WETH 0xc7183455a4C133Ae270771860664b6B7ec320bB1
    uint oldBaseBal = base.balanceOf($(this));
    uint oldQuoteBal = quote.balanceOf($(this)); // quote balance of test runner

    Offer offer = mgv.offers(lo, cold_buyResult.offerId);
    Tick tick = mgv.offers(lo, cold_buyResult.offerId).tick();

    vm.prank($(sell_taker));
    (uint takerGot, uint takerGave,, uint fee) = mgv.marketOrderByTick(lo, tick, 1000 ether, true);
    // sell_taker.takeWithInfo({takerWants: 1000 ether, offerId: cold_buyResult.offerId});

    // offer delivers
    assertEq(takerGot, 1000 ether - fee, "Incorrect received amount for seller taker");
    // inbound token forwarded to test runner
    assertEq(base.balanceOf($(this)), oldBaseBal + takerGave, "Incorrect base balance");
    // outbound taken from test runner
    assertEq(quote.balanceOf($(this)), oldQuoteBal - (takerGot + fee), "Incorrect quote balance");
    // checking residual
    Offer offer_ = mgv.offers(lo, cold_buyResult.offerId);
    assertEq(offer_.gives(), offer.gives() - (takerGot + fee), "Incorrect residual");
  }

  function test_resting_buy_offer_can_be_fully_consumed_at_minimum_approval() public {
    IOrderLogic.TakerOrder memory buyOrder = createBuyOrderLowerPrice();
    buyOrder.restingOrder = true;
    TransferLib.approveToken(quote, $(mgo.router()), takerGives(buyOrder) + makerGives(buyOrder));
    IOrderLogic.TakerOrderResult memory buyResult = mgo.take{value: 0.1 ether}(buyOrder);

    assertTrue(buyResult.offerId > 0, "Resting order should succeed");

    Tick tick = mgv.offers(lo, buyResult.offerId).tick();

    vm.prank($(sell_taker));
    (uint takerGot,,,) = mgv.marketOrderByTick(lo, tick, 40000 ether, true);

    assertTrue(takerGot > 0, "Offer should succeed");
  }

  function test_failing_resting_offer_releases_uncollected_provision() public {
    uint provision = mgo.provisionOf(lo, cold_buyResult.offerId);
    // empty quotes so that cold buy offer fails
    Tick tick = mgv.offers(lo, cold_buyResult.offerId).tick();
    deal($(quote), address(this), 0);
    _gas();
    vm.prank($(sell_taker));
    (,, uint bounty,) = mgv.marketOrderByTick(lo, tick, 1991, false);
    uint g = gas_(true);

    assertTrue(bounty > 0, "offer should be cleaned");
    assertTrue(
      provision > mgo.provisionOf(lo, cold_buyResult.offerId), "Remaining provision should be less than original"
    );
    assertTrue(mgo.provisionOf(lo, cold_buyResult.offerId) > 0, "Remaining provision should not be 0");
    assertTrue(bounty > g * mgv.global().gasprice(), "taker not compensated");
    console.log("Taker gained %s native", toFixed(bounty - g * mgv.global().gasprice(), 18));
  }

  function test_offer_succeeds_when_time_is_not_expired() public {
    mgo.setExpiry(lo.hash(), cold_buyResult.offerId, block.timestamp + 1);
    Tick tick = mgv.offers(lo, cold_buyResult.offerId).tick();
    vm.prank($(sell_taker));
    (uint takerGot,,,) = mgv.marketOrderByTick(lo, tick, 1991, true);
    assertTrue(takerGot > 0, "offer failed");
  }

  function test_offer_reneges_when_time_is_expired() public {
    mgo.setExpiry(lo.hash(), cold_buyResult.offerId, block.timestamp);
    vm.warp(block.timestamp + 1);
    Tick tick = mgv.offers(lo, cold_buyResult.offerId).tick();
    vm.prank($(sell_taker));
    (uint takerGot,,,) = mgv.marketOrderByTick(lo, tick, 1991, true);
    assertTrue(takerGot == 0, "offer should have failed");
  }
  //////////////////////////////
  /// Tests offer management ///
  //////////////////////////////

  function test_user_can_retract_resting_offer() public {
    uint userWeiBalanceOld = $(this).balance;
    uint credited = mgo.retractOffer(lo, cold_buyResult.offerId, true);
    assertEq($(this).balance, userWeiBalanceOld + credited, "Incorrect provision received");
  }

  event SetExpiry(bytes32 indexed olKeyHash, uint indexed offerId, uint date);

  function test_offer_owner_can_set_expiry() public {
    expectFrom($(mgo));
    emit SetExpiry(lo.hash(), cold_buyResult.offerId, 42);
    mgo.setExpiry(lo.hash(), cold_buyResult.offerId, 42);
    assertEq(mgo.expiring(lo.hash(), cold_buyResult.offerId), 42, "expiry date was not set");
  }

  function test_only_offer_owner_can_set_expiry() public {
    vm.expectRevert("AccessControlled/Invalid");
    vm.prank(freshAddress());
    mgo.setExpiry(lo.hash(), cold_buyResult.offerId, 42);
  }

  function test_offer_owner_can_update_offer() public {
    mgo.updateOffer(lo, Tick.wrap(100), 2000 ether, cold_buyResult.offerId);
    Offer offer = mgv.offers(lo, cold_buyResult.offerId);
    assertEq(Tick.unwrap(offer.tick()), 100, "Incorrect updated price");
    assertEq(offer.gives(), 2000 ether, "Incorrect updated gives");
    assertEq(mgo.ownerOf(lo.hash(), cold_buyResult.offerId), $(this), "Owner should not have changed");
  }

  function test_only_offer_owner_can_update_offer() public {
    vm.expectRevert("AccessControlled/Invalid");
    vm.prank(freshAddress());
    mgo.updateOffer(lo, Tick.wrap(0), 2000 ether, cold_buyResult.offerId);
  }

  //////////////////////////////
  /// Gas requirements tests ///
  //////////////////////////////

  function test_mockup_routing_gas_cost() public {
    SimpleRouter router = SimpleRouter(address(mgo.router()));
    // making quote balance hot to mock taker's transfer
    quote.transfer($(mgo), 1);

    vm.prank($(mgo));
    uint g = gasleft();
    uint pushed = router.push(quote, address(this), 1);
    uint push_cost = g - gasleft();
    assertEq(pushed, 1, "Push failed");

    vm.prank($(mgo));
    g = gasleft();
    uint pulled = router.pull(base, address(this), 1, true);
    uint pull_cost = g - gasleft();
    assertEq(pulled, 1, "Pull failed");

    console.log("Gas cost: %d (pull: %d g.u, push: %d g.u)", pull_cost + push_cost, pull_cost, push_cost);
  }

  function test_mockup_offerLogic_gas_cost() public {
    (MgvLib.SingleOrder memory sellOrder, MgvLib.OrderResult memory result) = mockPartialFillSellOrder({
      takerWants: 1991 ether / 2,
      tick: TickLib.tickFromVolumes(0.5 ether, 1991 ether / 2),
      partialFill: 2,
      _olBaseQuote: olKey,
      makerData: ""
    });
    // prank a fresh taker to avoid heating test runner balance
    vm.prank($(mgv));
    base.transferFrom(address(sell_taker), $(mgv), sellOrder.takerGives);
    vm.prank($(mgv));
    base.transfer($(mgo), sellOrder.takerGives);

    sellOrder.offerId = cold_buyResult.offerId;
    vm.prank($(mgv));
    _gas();
    mgo.makerExecute(sellOrder);
    uint exec_gas = gas_(true);
    // since offer reposts itself, making offer info, mgo credit on mangrove and mgv config hot in storage
    mgv.config(lo);
    mgv.offers(lo, sellOrder.offerId);
    mgv.offerDetails(lo, sellOrder.offerId);
    mgv.fund{value: 1}($(mgo));

    vm.prank($(mgv));
    _gas();
    mgo.makerPosthook(sellOrder, result);
    uint posthook_gas = gas_(true);
    console.log(
      "MgvOrder's logic is %d (makerExecute: %d, makerPosthook:%d)", exec_gas + posthook_gas, exec_gas, posthook_gas
    );
  }

  function test_empirical_offer_gas_cost() public {
    // resting order buys 1 ether for (MID_PRICE-9 ether) dai
    // fresh taker sells 0.5 ether for 900 dai for any gasreq
    OLKey memory _olKey = olKey;
    Tick tick = mgv.offers(lo, cold_buyResult.offerId).tick();
    vm.prank(address(sell_taker));
    _gas();
    // cannot use TestTaker functions that have additional gas cost
    // simply using sell_taker's approvals and already filled balances
    mgv.marketOrderByTick(_olKey, tick, 0.5 ether, true);
    gas_();
    assertTrue(mgv.offers(lo, cold_buyResult.offerId).gives() > 0, "Update failed");
  }
}
