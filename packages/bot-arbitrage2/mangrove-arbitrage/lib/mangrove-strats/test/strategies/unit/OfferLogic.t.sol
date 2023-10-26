// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {StratTest} from "@mgv-strats/test/lib/StratTest.sol";
import {GenericFork} from "@mgv/test/lib/forks/Generic.sol";
import {DirectTester} from "@mgv-strats/src/toy_strategies/offer_maker/DirectTester.sol";
import {ITesterContract as ITester} from "@mgv-strats/src/toy_strategies/interfaces/ITesterContract.sol";
import {AbstractRouter} from "@mgv-strats/src/strategies/routers/abstract/AbstractRouter.sol";
import {TestToken} from "@mgv/test/lib/tokens/TestToken.sol";
import {MgvReader} from "@mgv/src/periphery/MgvReader.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {TestSender} from "@mgv/test/lib/agents/TestSender.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";
import {MgvLib} from "@mgv/src/core/MgvLib.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";

// unit tests for (single /\ multi) user strats (i.e unit tests that are non specific to either single or multi user feature

contract OfferLogicTest is StratTest {
  TestToken weth;
  TestToken usdc;
  address payable taker;
  address payable deployer; // admin of makerContract
  address payable owner; // owner of the offers (==deployer for Direct strats)

  ITester makerContract; // can be either OfferMaker or OfferForwarder

  GenericFork fork;

  function setUp() public virtual override {
    options.base.symbol = "WETH";
    options.quote.symbol = "USDC";
    options.quote.decimals = 6;
    options.defaultFee = 30;

    // if a fork is initialized, we set it up and do a manual testing setup
    if (address(fork) != address(0)) {
      fork.setUp();
      mgv = setupMangrove();
      reader = new MgvReader($(mgv));
      weth = TestToken(fork.get("WETH"));
      usdc = TestToken(fork.get("USDC"));
      olKey = OLKey(address(weth), address(usdc), options.defaultTickSpacing);
      lo = olKey.flipped();
      setupMarket(olKey);
      // otherwise, a generic local setup works
    } else {
      // deploying mangrove and opening WETH/USDC market.
      super.setUp();
      // rename for convenience
      weth = base;
      usdc = quote;
    }
    taker = payable(new TestSender());
    vm.deal(taker, 1 ether);
    deal($(weth), taker, cash(weth, 50));
    deal($(usdc), taker, cash(usdc, 100_000));
    // letting taker take bids and asks on mangrove
    vm.startPrank(taker);
    weth.approve(address(mgv), type(uint).max);
    usdc.approve(address(mgv), type(uint).max);
    vm.stopPrank();

    // instantiates makerContract
    setupMakerContract();
    setupLiquidityRouting();
    vm.prank(deployer);
    makerContract.activate(dynamic([IERC20(weth), usdc]));
    fundStrat();
  }

  // override this to use Forwarder strats
  function setupMakerContract() internal virtual {
    deployer = payable(address(new TestSender()));
    vm.deal(deployer, 1 ether);

    vm.startPrank(deployer);
    makerContract = new DirectTester({
      mgv: IMangrove($(mgv)),
      router_: AbstractRouter(address(0)),
      deployer: deployer,
      gasreq: 80_000
    });
    weth.approve(address(makerContract), type(uint).max);
    usdc.approve(address(makerContract), type(uint).max);
    vm.stopPrank();
    owner = deployer;
  }

  // override this function to use a specific router for the strat
  function setupLiquidityRouting() internal virtual {}

  function fundStrat() internal virtual {
    deal($(weth), address(makerContract), 1 ether);
    deal($(usdc), address(makerContract), cash(usdc, 2000));
  }

  function test_checkList() public {
    vm.prank(owner);
    makerContract.checkList(dynamic([IERC20(weth), usdc]));
  }

  function test_maker_can_post_newOffer() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    assertTrue(offerId != 0);
  }

  // regression test since type(uint).max is no longer replaced by offerGasreq() automatically
  function test_posting_new_offer_with_too_high_gasreq_reverts() public {
    vm.expectRevert("mgv/writeOffer/gasreq/tooHigh");
    vm.prank(owner);
    makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: type(uint).max
    });
  }

  function test_newOffer_fails_when_provision_is_zero() public {
    uint gasreq = makerContract.offerGasreq();
    vm.expectRevert("mgv/insufficientProvision");
    vm.prank(owner);
    makerContract.newOfferByVolume{value: 0}({olKey: olKey, wants: 2000 * 10 ** 6, gives: 1 * 10 ** 18, gasreq: gasreq});
  }

  function test_provisionOf_returns_zero_if_offer_does_not_exist() public {
    assertEq(makerContract.provisionOf(olKey, 0), 0, "Invalid returned provision");
  }

  function test_maker_can_deprovision_Offer() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    uint makerBalWei = owner.balance;
    uint locked = makerContract.provisionOf(olKey, offerId);
    vm.prank(owner);
    uint deprovisioned = makerContract.retractOffer(olKey, offerId, true);
    // checking WEIs are returned to maker's account
    assertEq(owner.balance, makerBalWei + deprovisioned, "Incorrect WEI balance");
    // checking that the totality of the provisions is returned
    assertEq(deprovisioned, locked, "Deprovision was incomplete");
  }

  function test_mangrove_can_deprovision_offer() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    uint makerBalWei = owner.balance;
    uint locked = makerContract.provisionOf(olKey, offerId);
    vm.prank(address(mgv));
    // returned provision is sent to offer maker
    uint deprovisioned = makerContract.retractOffer(olKey, offerId, true);
    // checking WEIs are returned to maker's account
    assertEq(owner.balance, makerBalWei + deprovisioned, "Incorrect WEI balance");
    // checking that the totality of the provisions is returned
    assertEq(deprovisioned, locked, "Deprovision was incomplete");
  }

  function test_deprovision_twice_returns_no_fund() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    makerContract.retractOffer(olKey, offerId, true);
    uint received_wei = makerContract.retractOffer(olKey, offerId, true);
    vm.stopPrank();
    assertEq(received_wei, 0, "Unexpected received WEIs");
  }

  function test_deprovisionOffer_throws_if_wei_transfer_fails() public {
    TestSender(owner).refuseNative();
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.expectRevert("mgvOffer/weiTransferFail");
    makerContract.retractOffer(olKey, offerId, true);
    vm.stopPrank();
  }

  function test_maker_can_updateOffer() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();

    vm.startPrank(owner);
    makerContract.updateOfferByVolume({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      offerId: offerId,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
  }

  function test_only_maker_can_updateOffer() public {
    uint gasreq = makerContract.offerGasreq();
    vm.prank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: gasreq
    });
    vm.expectRevert("AccessControlled/Invalid");
    vm.prank(freshAddress());
    makerContract.updateOfferByVolume({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      offerId: offerId,
      gasreq: gasreq
    });
  }

  function test_updateOffer_fails_when_provision_is_too_low() public {
    uint gasreq = makerContract.offerGasreq();
    vm.prank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: gasreq
    });

    mgv.setGasprice((1 << 26) - 1);
    vm.expectRevert("mgv/insufficientProvision");
    vm.prank(owner);
    makerContract.updateOfferByVolume({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      offerId: offerId,
      gasreq: gasreq
    });
  }

  function performTrade(bool success) internal returns (uint takerGot, uint takerGave, uint bounty, uint fee) {
    vm.startPrank(owner);
    // ask 2000 USDC for 1 weth
    makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: 2 * makerContract.offerGasreq()
    });
    vm.stopPrank();

    // taker has approved mangrove in the setUp
    vm.startPrank(taker);
    (takerGot, takerGave, bounty, fee) =
      mgv.marketOrderByVolume({olKey: olKey, takerWants: 0.5 ether, takerGives: cash(usdc, 1000), fillWants: true});
    vm.stopPrank();
    assertTrue(!success || (bounty == 0 && takerGot > 0), "unexpected trade result");
  }

  function test_owner_balance_is_updated_when_trade_succeeds() public {
    uint balOut = makerContract.tokenBalance(weth, owner);
    uint balIn = makerContract.tokenBalance(usdc, owner);

    (uint takerGot, uint takerGave, uint bounty, uint fee) = performTrade(true);
    assertTrue(bounty == 0 && takerGot > 0, "trade failed");

    assertEq(makerContract.tokenBalance(weth, owner), balOut - (takerGot + fee), "incorrect out balance");
    assertEq(makerContract.tokenBalance(usdc, owner), balIn + takerGave, "incorrect in balance");
  }

  function test_reposting_fails_with_expected_reason_when_below_density() public {
    vm.startPrank(owner);
    uint offerGives = reader.minVolume(olKey, makerContract.offerGasreq());
    uint offerId = makerContract.newOffer{value: 0.1 ether}({
      olKey: olKey,
      tick: Tick.wrap(1),
      gives: offerGives,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    MgvLib.OrderResult memory result;
    result.mgvData = "mgv/tradeSuccess";
    MgvLib.SingleOrder memory order;
    order.olKey = olKey;
    order.offerId = offerId;
    order.takerWants = offerGives / 2;
    /* `offerDetail` is only populated when necessary. */
    order.offerDetail = mgv.offerDetails(olKey, offerId);
    order.offer = mgv.offers(olKey, offerId);
    order.takerGives = order.offer.tick().outboundFromInbound(offerGives / 2);
    (order.global, order.local) = mgv.config(olKey);

    vm.expectRevert("mgv/writeOffer/density/tooLow");
    vm.prank($(mgv));
    makerContract.makerPosthook(order, result);
  }

  function test_reposting_fails_with_expected_reason_when_under_provisioned() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    mgv.setGasprice(1000000);
    vm.startPrank(deployer);
    makerContract.withdrawFromMangrove(mgv.balanceOf(address(makerContract)), payable(deployer));
    vm.stopPrank();

    MgvLib.OrderResult memory result;
    result.mgvData = "mgv/tradeSuccess";
    MgvLib.SingleOrder memory order;
    order.olKey = olKey;
    order.offerId = offerId;
    order.takerWants = 0.5 ether;
    order.takerGives = cash(usdc, 1000);
    /* `offerDetail` is only populated when necessary. */
    order.offerDetail = mgv.offerDetails(olKey, offerId);
    order.offer = mgv.offers(olKey, offerId);
    (order.global, order.local) = mgv.config(olKey);
    vm.expectRevert("mgv/insufficientProvision");
    vm.prank($(mgv));
    makerContract.makerPosthook(order, result);
  }

  function test_reposting_fails_with_expected_reason_when_inactive() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 * 10 ** 18,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    mgv.deactivate(olKey);
    MgvLib.OrderResult memory result;
    result.mgvData = "mgv/tradeSuccess";
    MgvLib.SingleOrder memory order;
    order.olKey = olKey;
    order.offerId = offerId;
    order.takerWants = 0.5 ether;
    order.takerGives = cash(usdc, 1000);
    /* `offerDetail` is only populated when necessary. */
    order.offerDetail = mgv.offerDetails(olKey, offerId);
    order.offer = mgv.offers(olKey, offerId);
    (order.global, order.local) = mgv.config(olKey);
    vm.expectRevert("posthook/failed");
    vm.prank($(mgv));
    makerContract.makerPosthook(order, result);
  }
}
