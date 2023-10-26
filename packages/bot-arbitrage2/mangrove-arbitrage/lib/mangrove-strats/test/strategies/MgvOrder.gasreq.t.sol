// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {StratTest} from "@mgv-strats/test/lib/StratTest.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MangroveOrder} from "@mgv-strats/src/strategies/MangroveOrder.sol";
import {TransferLib} from "@mgv/lib/TransferLib.sol";
import {IOrderLogic} from "@mgv-strats/src/strategies/interfaces/IOrderLogic.sol";
import {IERC20, OLKey, Offer} from "@mgv/src/core/MgvLib.sol";
import {TickLib} from "@mgv/lib/core/TickLib.sol";
import {MAX_TICK} from "@mgv/lib/core/Constants.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";
import {OfferGasReqBaseTest} from "@mgv/test/lib/gas/OfferGasReqBase.t.sol";

///@notice Can be used to measure gasreq for MangroveOrder. Use `yarn gas-measurement` for better output.
///@dev Remember to use same optimization options for core and strats when comparing with gas-measurement in core.
///@dev For instance, as of writing, if `yarn gas-measurement` is executed, then for the generic case on A/B tokens with default foundry.toml (no optimization):
///@dev MangroveOrder's most expensive case is 148451 (c.f. test/strategies/MgvOrder.gasreq.t.sol:MangroveOrderGasreqTest_Generic_A_B:test_gasreq_repost_on_now_empty_offer_list_with_expiry_base_quote_success())
///@dev SimpleRouter is hardcoded to 70000 gas (c.f. src/strategies/routers/SimpleRouter.sol),
///@dev so gasreq for MangroveOrder should be 148451-70000=78451.
///@dev This is assuming, that the code in this test hits the worst case. However, looking at core runs that is not entirely the case.
///@dev  - 19675 is the comparable case for core (c.f. test/core/gas/UpdateOfferSameOfferList.t.sol:PosthookSuccessUpdateOfferSameList_WithNoOtherOffersGasTest:test_ExistingBin() (Updating an offer in posthook for now empty offer list but where new offer has varying closeness to taken offer - Case: Existing bin))
///@dev  - 22841 would be if an offer existed in the same bin as the reposted offer (c.f. test/core/gas/UpdateOfferSameOfferList.t.sol:PosthookSuccessUpdateOfferSameList_WithOtherOfferGasTest:test_ExistingBin() (Updating an offer in posthook for offer list with other offer at same bin as taken but where new offer has varying closeness to taken offer - Case: Existing bin))
///@dev The difference is just above 3000, so we add that and round up to get 82000. This is then used in MangroveOrderDeployer.
///@dev Note that for instance for polygon with WETH/DAI the numbers are lower due to the A/B test tokens being expensive contracts, so it should cover that, especially with optimization.
///@dev In addition, wrt density then gasbase is 271276 (c.f. test/strategies/CoreOfferGasbase.gasreq.t.sol:OfferGasBaseTest_Generic_A_B:test_gasbase_to_empty_book_base_quote_success())
abstract contract MangroveOrderGasreqBaseTest is StratTest, OfferGasReqBaseTest {
  MangroveOrder internal mangroveOrder;
  IOrderLogic.TakerOrderResult internal buyResult;
  IOrderLogic.TakerOrderResult internal sellResult;

  function setUpTokens(string memory baseToken, string memory quoteToken) public virtual override {
    super.setUpTokens(baseToken, quoteToken);
    mangroveOrder = new MangroveOrder(IMangrove(payable(mgv)), $(this), 400_000);
    mangroveOrder.activate(dynamic([IERC20(base), IERC20(quote)]));

    // We approve both base and quote to be able to test both tokens.
    // We should approve 2*volume but do not in order to allow failure to deliver
    deal($(quote), $(this), 10 ether);
    TransferLib.approveToken(quote, $(mangroveOrder.router()), 1.5 ether);

    deal($(base), $(this), 10 ether);
    TransferLib.approveToken(base, $(mangroveOrder.router()), 1.5 ether);

    // A buy
    IOrderLogic.TakerOrder memory buyOrder = IOrderLogic.TakerOrder({
      olKey: olKey,
      fillOrKill: false,
      fillWants: false,
      fillVolume: 1 ether,
      tick: Tick.wrap(10),
      restingOrder: true,
      expiryDate: block.timestamp + 10000,
      offerId: 0
    });

    // Post everything as resting order since offer list is empty with plenty of provision
    buyResult = mangroveOrder.take{value: 1 ether}(buyOrder);

    assertGt(buyResult.offerId, 0, "Resting offer failed to be published on mangrove");

    // A sell
    IOrderLogic.TakerOrder memory sellOrder = IOrderLogic.TakerOrder({
      olKey: lo,
      fillOrKill: false,
      fillWants: false,
      fillVolume: 1 ether,
      tick: Tick.wrap(-20),
      restingOrder: true,
      expiryDate: block.timestamp + 10000,
      offerId: 0
    });

    // Post everything as resting order since offer list is empty with plenty of provision
    sellResult = mangroveOrder.take{value: 1 ether}(sellOrder);

    assertGt(sellResult.offerId, 0, "Resting offer failed to be published on mangrove");

    description = string.concat(description, " - MangroveOrder");

    // Set gasprice a bit higher to (attempt) to cause provision events during offer update
    // However, this has no effect since if the gas price is actually more than allowed by the offer being reposted,
    // then the offer will fail to repost due to Forwarder.sol _updateOffer checking whether derived gasprice is above global gasprice.
    setGasprice(mgv.global().gasprice() + 1);
  }

  function test_gasreq_repost_on_now_empty_offer_list_with_expiry(OLKey memory _olKey, bool failure) internal {
    // note: we do not test failure in posthook as it is not supposed to fail for MangroveOrder.
    // we take more than approval to make makerExecute fail
    // this is more expensive than expiry which fails earlier.
    uint volume = failure ? type(uint96).max : 1;

    (IMangrove _mgv,,,) = getStored();
    prankTaker(_olKey);
    (uint takerGot,, uint bounty,) = _mgv.marketOrderByTick(_olKey, Tick.wrap(MAX_TICK), volume, true);

    // Measurement 0 is from setUp().
    logGasreqAsGasUsed(0);
    // Verify there are no additional measurements, so we are measuring the right one.
    vm.expectRevert();
    getMeasuredGasused(1);

    assertEq(takerGot == 0, failure, "taker should get some of the offer if not failure");
    assertEq(mgv.best(_olKey), failure ? 0 : buyResult.offerId, "offer should be reposted if not failure");
    assertEq(bounty != 0, failure, "bounty should be paid for failure");
  }

  function test_gasreq_repost_on_now_empty_offer_list_with_expiry_base_quote_success() public {
    test_gasreq_repost_on_now_empty_offer_list_with_expiry(olKey, false);
    printDescription(" - Case: base/quote gasreq for taking single offer and repost to now empty book");
  }

  function test_gasreq_repost_on_now_empty_offer_list_with_expiry_quote_base_success() public {
    test_gasreq_repost_on_now_empty_offer_list_with_expiry(lo, false);
    printDescription(" - Case: quote/base gasreq for taking single offer and repost to now empty book");
  }

  function test_gasreq_repost_on_now_empty_offer_list_with_expiry_base_quote_failure() public {
    test_gasreq_repost_on_now_empty_offer_list_with_expiry(olKey, true);
    printDescription(" - Case: base/quote gasreq for taking single failing offer on now empty book so not reposted");
  }

  function test_gasreq_repost_on_now_empty_offer_list_with_expiry_quote_base_failure() public {
    test_gasreq_repost_on_now_empty_offer_list_with_expiry(lo, true);
    printDescription(" - Case: quote/base gasreq for taking single failing offer on now empty book so not reposted");
  }
}

contract MangroveOrderGasreqTest_Generic_A_B is MangroveOrderGasreqBaseTest {
  function setUp() public override {
    super.setUpGeneric();
    this.setUpTokens(options.base.symbol, options.quote.symbol);
  }
}

contract MangroveOrderGasreqTest_Polygon_WETH_DAI is MangroveOrderGasreqBaseTest {
  function setUp() public override {
    super.setUpPolygon();
    this.setUpTokens("WETH", "DAI");
  }
}
