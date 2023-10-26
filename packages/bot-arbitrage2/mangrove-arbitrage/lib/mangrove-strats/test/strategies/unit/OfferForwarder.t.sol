// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {SimpleRouter} from "@mgv-strats/src/strategies/routers/SimpleRouter.sol";
import {OfferLogicTest} from "@mgv-strats/test/strategies/unit/OfferLogic.t.sol";
import {
  ForwarderTester,
  ITesterContract as ITester
} from "@mgv-strats/src/toy_strategies/offer_forwarder/ForwarderTester.sol";
import {IForwarder, IMangrove, IERC20} from "@mgv-strats/src/strategies/offer_forwarder/abstract/Forwarder.sol";
import {MgvLib} from "@mgv/src/core/MgvLib.sol";
import {TestSender} from "@mgv/test/lib/agents/TestSender.sol";
import "@mgv/lib/Debug.sol";

contract OfferForwarderTest is OfferLogicTest {
  IForwarder forwarder;

  function setUp() public virtual override {
    deployer = freshAddress("deployer");
    vm.deal(deployer, 10 ether);
    super.setUp();
  }

  event NewOwnedOffer(bytes32 indexed olKeyHash, uint indexed offerId, address indexed owner);

  function setupMakerContract() internal virtual override {
    deployer = freshAddress("deployer");
    vm.deal(deployer, 10 ether);

    vm.prank(deployer);
    forwarder = new ForwarderTester({
      mgv: IMangrove($(mgv)),
      deployer: deployer
    });
    owner = payable(address(new TestSender()));
    vm.deal(owner, 10 ether);

    makerContract = ITester(address(forwarder)); // to use for all non `IForwarder` specific tests.
    // reserve (which is maker here) approves contract's router
    vm.startPrank(owner);
    usdc.approve(address(makerContract.router()), type(uint).max);
    weth.approve(address(makerContract.router()), type(uint).max);
    vm.stopPrank();
  }

  function fundStrat() internal virtual override {
    deal($(weth), owner, 1 ether);
    deal($(usdc), owner, cash(usdc, 2000));
  }

  function test_checkList_fails_if_caller_has_not_approved_router() public {
    vm.expectRevert("SimpleRouter/NotApprovedByOwner");
    vm.prank(freshAddress());
    makerContract.checkList(dynamic([IERC20(usdc), weth]));
  }

  function test_derived_gasprice_is_accurate_enough(uint fund) public {
    vm.assume(fund >= reader.getProvision(olKey, makerContract.offerGasreq(), 0));
    vm.assume(fund < 5 ether); // too high provision would yield a gasprice overflow
    uint contractOldBalance = mgv.balanceOf(address(makerContract));
    vm.prank(owner);
    uint offerId = makerContract.newOfferByVolume{value: fund}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    uint derived_gp = mgv.offerDetails(olKey, offerId).gasprice();
    uint gasbase = mgv.offerDetails(olKey, offerId).offer_gasbase();
    uint gasreq = makerContract.offerGasreq();
    uint locked = derived_gp * (gasbase + gasreq) * 1e6;
    uint leftover = fund - locked;
    assertEq(mgv.balanceOf(address(makerContract)), contractOldBalance + leftover, "Invalid contract balance");
    console.log("counterexample:", locked, fund, (locked * 1000) / fund);
    assertTrue((locked * 10) / fund >= 9, "rounding exceeds admissible error");
  }

  function test_updateOffer_with_funds_updates_gasprice() public {
    vm.prank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    uint old_gasprice = mgv.offerDetails(olKey, offerId).gasprice();
    vm.prank(owner);
    makerContract.updateOfferByVolume{value: 0.2 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      offerId: offerId,
      gasreq: makerContract.offerGasreq()
    });
    assertTrue(old_gasprice < mgv.offerDetails(olKey, offerId).gasprice(), "Gasprice not updated as expected");
  }

  function test_failed_offer_reaches_posthookFallback() public {
    MgvLib.SingleOrder memory order;
    MgvLib.OrderResult memory result;
    vm.prank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    result.mgvData = "anythingButSuccess";
    result.makerData = "failReason";
    order.offerId = offerId;
    order.olKey = olKey;
    order.offer = mgv.offers(olKey, offerId);
    order.offerDetail = mgv.offerDetails(olKey, offerId);
    // this should reach the posthookFallback and computes released provision, assuming offer has failed for half gasreq
    // as a result the amount of provision that can be redeemed by retracting offerId should increase.
    vm.startPrank($(mgv));
    makerContract.makerPosthook{gas: makerContract.offerGasreq() / 2}(order, result);
    vm.stopPrank();
    assertTrue(makerContract.provisionOf(olKey, offerId) > 1 ether, "fallback was not reached");
  }

  function test_failed_offer_credits_maker(uint fund) public {
    vm.assume(fund >= reader.getProvision(olKey, makerContract.offerGasreq(), 0));
    vm.assume(fund < 5 ether);
    vm.prank(owner);
    uint offerId = makerContract.newOfferByVolume{value: fund}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    // revoking Mangrove's approvals to make `offerId` fail
    vm.prank(deployer);
    makerContract.approve(weth, address(mgv), 0);
    uint provision = makerContract.provisionOf(olKey, offerId);
    console.log("provision before fail:", provision);

    // taker has approved mangrove in the setUp
    vm.startPrank(taker);
    (uint takerGot,, uint bounty,) =
      mgv.marketOrderByVolume({olKey: olKey, takerWants: 0.5 ether, takerGives: cash(usdc, 1000), fillWants: true});
    vm.stopPrank();
    assertTrue(bounty > 0 && takerGot == 0, "trade should have failed");
    uint provision_after_fail = makerContract.provisionOf(olKey, offerId);
    console.log("provision after fail:", provision_after_fail);
    console.log("bounty", bounty);
    // checking that approx is small in front a storage write (approx < write_cost / 10)
    uint approx_bounty = provision - provision_after_fail;
    assertTrue((approx_bounty * 10000) / bounty > 9990, "Approximation of offer maker's credit is too coarse");
    assertTrue(provision_after_fail < mgv.balanceOf(address(makerContract)), "Incorrect approx");
  }

  function test_maker_ownership() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    assertEq(forwarder.ownerOf(olKey.hash(), offerId), owner, "Invalid maker ownership relation");
  }

  function test_NewOwnedOffer_logging() public {
    (, Local local) = mgv.config(olKey);
    uint next_id = local.last() + 1;
    vm.expectEmit(true, true, true, false, address(forwarder));
    emit NewOwnedOffer(olKey.hash(), next_id, owner);

    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    assertEq(next_id, offerId, "Unexpected offer id");
  }

  function test_provision_too_high_reverts() public {
    uint gasreq = makerContract.offerGasreq();
    vm.deal(owner, 20 ether);
    vm.expectRevert("Forwarder/provisionTooHigh");
    vm.prank(owner);
    makerContract.newOfferByVolume{value: 20 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: gasreq
    });
  }

  function test_updateOffer_with_no_funds_preserves_gasprice() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    OfferDetail detail = mgv.offerDetails(olKey, offerId);
    uint old_gasprice = detail.gasprice();

    vm.startPrank(owner);
    makerContract.updateOfferByVolume({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1.1 ether,
      offerId: offerId,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    detail = mgv.offerDetails(olKey, offerId);
    assertEq(old_gasprice, detail.gasprice(), "Gas price was changed");
  }

  function test_updateOffer_with_funds_increases_gasprice() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    OfferDetail detail = mgv.offerDetails(olKey, offerId);
    uint old_gasprice = detail.gasprice();
    vm.startPrank(owner);
    makerContract.updateOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1.1 ether,
      offerId: offerId,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    detail = mgv.offerDetails(olKey, offerId);
    assertTrue(old_gasprice < detail.gasprice(), "Gas price was not increased");
  }

  function test_different_maker_can_post_offers() public {
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    address new_maker = freshAddress("New maker");
    vm.deal(new_maker, 1 ether);
    vm.startPrank(new_maker);
    uint offerId_ = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    vm.stopPrank();
    assertEq(forwarder.ownerOf(olKey.hash(), offerId_), new_maker, "Incorrect maker");
    assertEq(forwarder.ownerOf(olKey.hash(), offerId), owner, "Incorrect maker");
  }

  function test_put_fail_reverts_with_expected_reason() public {
    MgvLib.SingleOrder memory order;
    vm.startPrank(owner);
    uint offerId = makerContract.newOfferByVolume{value: 0.1 ether}({
      olKey: olKey,
      wants: 2000 * 10 ** 6,
      gives: 1 ether,
      gasreq: makerContract.offerGasreq()
    });
    usdc.approve($(makerContract.router()), 0);
    vm.stopPrank();

    order.olKey = olKey;
    order.takerGives = 10 ** 6;
    order.offerId = offerId;
    vm.expectRevert("mgvOffer/abort/putFailed");
    vm.prank($(mgv));
    makerContract.makerExecute(order);
  }
}
