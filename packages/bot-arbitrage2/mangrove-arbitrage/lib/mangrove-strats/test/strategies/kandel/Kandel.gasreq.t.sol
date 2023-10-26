// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.10;

import {StratTest} from "@mgv-strats/test/lib/StratTest.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {TransferLib} from "@mgv/lib/TransferLib.sol";
import {OLKey, Offer} from "@mgv/src/core/MgvLib.sol";
import {TickLib} from "@mgv/lib/core/TickLib.sol";
import {MAX_TICK} from "@mgv/lib/core/Constants.sol";
import {Tick} from "@mgv/lib/core/TickLib.sol";
import {OfferGasReqBaseTest} from "@mgv/test/lib/gas/OfferGasReqBase.t.sol";
import {Kandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/Kandel.sol";
import {GeometricKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/GeometricKandel.sol";
import {AavePooledRouter} from "@mgv-strats/src/strategies/routers/integrations/AavePooledRouter.sol";
import {AaveKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/AaveKandel.sol";
import {PoolAddressProviderMock} from "@mgv-strats/script/toy/AaveMock.sol";

///@notice Can be used to test gasreq for Kandel. Use `yarn gas-measurement` for better output.
///@dev Remember to use same optimization options for core and strats when comparing.
///@dev For instance, as of writing, if `yarn gas-measurement` is executed, then for the generic case on A/B tokens with default foundry.toml (no optimization):
///@dev Kandel's most expensive case is 121413 (c.f. test/strategies/kandel/Kandel.gasreq.t.sol:NoRouterKandelGasreqBaseTest_Generic_A_B:test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_base_quote_repost_both())
///@dev This is assuming, that the code in this test hits the worst case. However, looking at core runs that is not entirely the case. For the dual:
///@dev  - 44339 is the comparable case for core for updating the dual (c.f. test/core/gas/UpdateOfferOtherOfferList.t.sol:ExternalUpdateOfferOtherOfferList_WithNoOtherOffersGasTest:test_single_gas())
///@dev  - 45090 would be if another offer existed on the dual offer's bin (c.f. test/core/gas/UpdateOfferOtherOfferList.t.sol:ExternalUpdateOfferOtherOfferList_WithOtherOfferGasTest:test_ExistingBin())
///@dev The difference is below 1000.
///@dev Similarly for the primary offer:
///@dev  - 19675 is the comparable case for core (c.f. test/core/gas/UpdateOfferSameOfferList.t.sol:PosthookSuccessUpdateOfferSameList_WithNoOtherOffersGasTest:test_ExistingBin() (Updating an offer in posthook for now empty offer list but where new offer has varying closeness to taken offer - Case: Existing bin))
///@dev  - 22841 would be if an offer existed in the same bin as the reposted offer (c.f. test/core/gas/UpdateOfferSameOfferList.t.sol:PosthookSuccessUpdateOfferSameList_WithOtherOfferGasTest:test_ExistingBin() (Updating an offer in posthook for offer list with other offer at same bin as taken but where new offer has varying closeness to taken offer - Case: Existing bin))
///@dev The difference is just above 3000, so we add both (4000) and round up to get 126000.
///@dev This is then used in MangroveJs.s.sol and tests. For deployments we need to inspect token measurements and optimization options, or let this un-optimized, expensive token measurement be an upper bound.
///@dev In addition, wrt density then gasbase is 271276 (c.f. test/strategies/CoreOfferGasbase.gasreq.t.sol:OfferGasBaseTest_Generic_A_B:test_gasbase_to_empty_book_base_quote_success())

///@dev Similarly, for AaveKandel, the most expensive case is 553326 (c.f. test/strategies/kandel/Kandel.gasreq.t.sol:AaveKandelGasreqBaseTest_Generic_A_B:test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_base_quote_repost_both())
///@dev However, that measurement is for a mocked aave, so a better measurement is 624677 (c.f. for test/strategies/kandel/Kandel.gasreq.t.sol:AaveKandelGasreqBaseTest_Polygon_WETH_DAI:test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_quote_base_repost_both())
///@dev but that is with a specific pair of tokens, so not an upper bound.
///@dev With the additional 4000, and rounding up we get 629000.
///@dev This is then used in MangroveJs.s.sol and tests. For deployments we need to inspect token measurements and optimization options, or let this un-optimized, expensive token measurement be an upper bound.

abstract contract CoreKandelGasreqBaseTest is StratTest, OfferGasReqBaseTest {
  GeometricKandel internal kandel;

  event LogIncident(bytes32 indexed olKeyHash, uint indexed offerId, bytes32 makerData, bytes32 mgvData);

  bytes32 internal expectedFirOfferMakerData = 0;

  function createKandel() public virtual returns (GeometricKandel);

  function populateKandel() public virtual {
    deal($(this), 10 ether);
    TransferLib.approveToken(base, address(kandel), type(uint).max);
    TransferLib.approveToken(quote, address(kandel), type(uint).max);
    deal($(quote), $(this), 10 ether);
    deal($(base), $(this), 10 ether);

    GeometricKandel.Params memory params;
    params.stepSize = 1;
    params.pricePoints = 2;
    kandel.populateFromOffset{value: 1 ether}({
      from: 0,
      to: params.pricePoints,
      baseQuoteTickIndex0: Tick.wrap(1),
      _baseQuoteTickOffset: 1,
      firstAskIndex: 1,
      bidGives: 1 ether,
      askGives: 1 ether,
      parameters: params,
      baseAmount: 2 ether,
      quoteAmount: 2 ether
    });

    // Make dual live
    TransferLib.approveToken(base, address(mgv), type(uint).max);
    TransferLib.approveToken(quote, address(mgv), type(uint).max);
    mgv.marketOrderByTick(olKey, Tick.wrap(MAX_TICK), 0.5 ether, true);

    // Set gasprice a bit higher to cause provision events during offer update
    setGasprice(mgv.global().gasprice() + 1);

    // Testing the base/quote side with the quote/base offer retracted: kandel.retractOffers(0,1); - yields lower gas consumption and since it requires an extra test contract for cool setup we leave it out.
  }

  function setUpTokens(string memory baseToken, string memory quoteToken) public virtual override {
    super.setUpTokens(baseToken, quoteToken);

    kandel = createKandel();
    populateKandel();
  }

  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(
    OLKey memory _olKey,
    bool failure,
    uint volume,
    bool expectRepostSelf,
    bool expectLiveDual
  ) internal {
    if (failure) {
      vm.prank(address(kandel));
      TransferLib.approveToken(base, $(mgv), 0);
      TransferLib.approveToken(quote, $(mgv), 0);
    }

    (IMangrove _mgv,,,) = getStored();
    prankTaker(_olKey);
    (uint takerGot,, uint bounty,) = _mgv.marketOrderByTick(_olKey, Tick.wrap(MAX_TICK), volume, true);
    // Measurement 0 is from setUp().
    logGasreqAsGasUsed(1);
    // Verify there are no additional measurements, so we are measuring the right one.
    vm.expectRevert();
    getMeasuredGasused(2);
    assertEq(takerGot == 0, failure, "taker should get some of the offer if not failure");
    if (expectRepostSelf) {
      assertGt(mgv.best(_olKey), 0, "offer should be reposted");
    } else {
      assertEq(mgv.best(_olKey), 0, "offer should not be reposted");
    }
    if (expectLiveDual) {
      assertGt(mgv.best(_olKey.flipped()), 0, "dual offer should be live");
    } else {
      assertEq(mgv.best(_olKey.flipped()), 0, "dual offer should not be live");
    }
    assertEq(bounty != 0, failure, "bounty should be paid for failure");
  }

  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_base_quote_repost_both() public {
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(olKey, false, 0.25 ether, true, true);
    printDescription(" - Case: base/quote gasreq for taking offer repost self and dual to now empty book");
  }

  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_quote_base_repost_both() public {
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(lo, false, 0.25 ether, true, true);
    printDescription(" - Case: quote/base gasreq for taking offer repost self and dual to now empty book");
  }

  // Compare this to the non-setGasprice version to see the delta caused by hot hotness. This should be then added to tests that need to set gasprice to change scenario.
  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_base_quote_repost_both_setGasprice()
    public
  {
    setGasprice(mgv.global().gasprice());
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(olKey, false, 0.25 ether, true, true);
    printDescription(
      " - Case: base/quote gasreq for taking offer repost self and dual to now empty book + setGasPrice prior"
    );
  }

  // Compare this to the non-setAllowances version to see the delta caused by hotness. This should be then added to tests that need to set allowances to change scenario.
  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_base_quote_repost_both_setAllowances()
    public
  {
    vm.prank(address(kandel));
    TransferLib.approveToken(base, address(mgv), type(uint).max - 42);
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(olKey, false, 0.25 ether, true, true);
    printDescription(
      " - Case: base/quote gasreq for taking offer repost self and dual to now empty book + set allowance prior"
    );
  }

  // Compare this to the non-setAllowances version to see the delta caused by hotness. This should be then added to tests that need to set allowances to change scenario.
  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_quote_base_repost_both_setAllowances()
    public
  {
    vm.prank(address(kandel));
    TransferLib.approveToken(quote, address(mgv), type(uint).max - 42);
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(lo, false, 0.25 ether, true, true);
    printDescription(
      " - Case: quote/base gasreq for taking offer repost self and dual to now empty book + set allowance prior"
    );
  }

  ///@notice fail to repost and update due to high gasprice, remember to add delta for hotness of gasprice. Note: Dual keeps being live as update fails it keeps old values.
  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_base_quote_repost_both_fails_due_to_gasprice(
  ) public {
    setGasprice(2 ** 26 - 1);
    expectFrom(address(kandel));
    emit LogIncident(lo.hash(), 1, "Kandel/updateOfferFailed", "mgv/insufficientProvision");
    expectFrom(address(kandel));
    emit LogIncident(olKey.hash(), 1, expectedFirOfferMakerData, "mgv/insufficientProvision");
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(olKey, false, 0.25 ether, false, true);
    printDescription(
      " - Case: base/quote gasreq for taking offer which fails repost self and dual to now empty book due to gasprice"
    );
  }

  ///@notice fail to repost and update due to high gasprice, remember to add delta for hotness of gasprice. Note: Dual keeps being live as update fails it keeps old values.
  function test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list_quote_base_repost_both_fails_due_to_gasprice(
  ) public {
    setGasprice(2 ** 26 - 1);
    expectFrom(address(kandel));
    emit LogIncident(olKey.hash(), 1, "Kandel/updateOfferFailed", "mgv/insufficientProvision");
    expectFrom(address(kandel));
    emit LogIncident(lo.hash(), 1, expectedFirOfferMakerData, "mgv/insufficientProvision");
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(lo, false, 0.25 ether, false, true);
    printDescription(
      " - Case: quote/base gasreq for taking offer which fails repost self and dual to now empty book due to gasprice"
    );
  }

  ///@notice fail to deliver (and therefore fail to repost and post dual) due to missing allowance, remember to add delta for hotness of allowance.
  function test_gasreq_delivery_failure_due_to_allowance_base_quote() public {
    vm.prank(address(kandel));
    TransferLib.approveToken(base, address(mgv), 0);
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(olKey, true, 0.25 ether, false, true);
    printDescription(
      " - Case: base/quote gasreq for taking offer which fails to deliver and thus repost, leaves dual as is"
    );
  }

  ///@notice fail to deliver (and therefore fail to repost and post dual) due to missing allowance, remember to add delta for hotness of allowance.
  function test_gasreq_delivery_failure_due_to_allowance_quote_base() public {
    vm.prank(address(kandel));
    TransferLib.approveToken(quote, address(mgv), 0);
    test_gasreq_repost_and_post_dual_first_offer_now_empty_offer_list(lo, true, 0.25 ether, false, true);
    printDescription(
      " - Case: quote/base gasreq for taking offer which fails to deliver and thus repost, leaves dual as is"
    );
  }
}

abstract contract NoRouterKandelGasreqBaseTest is CoreKandelGasreqBaseTest {
  function createKandel() public virtual override returns (GeometricKandel) {
    description = string.concat(description, " - Kandel");
    return new Kandel({
        mgv: mgv,
        olKeyBaseQuote: olKey,
        gasreq: 500_000,
        reserveId: address(0)
      });
  }
}

abstract contract AaveKandelGasreqBaseTest is CoreKandelGasreqBaseTest {
  function createKandel() public virtual override returns (GeometricKandel) {
    description = string.concat(description, " - AaveKandel");
    expectedFirOfferMakerData = "IS_FIRST_PULLER";

    address aave = fork.get("Aave");
    AavePooledRouter router = new AavePooledRouter(aave, 500_000);
    AaveKandel aaveKandel = new AaveKandel({
      mgv: mgv,
      olKeyBaseQuote: olKey,
      gasreq: 500_000,
      reserveId: $(this)
    });

    router.bind(address(aaveKandel));
    aaveKandel.initialize(router);

    return aaveKandel;
  }
}

contract NoRouterKandelGasreqBaseTest_Generic_A_B is NoRouterKandelGasreqBaseTest {
  function setUp() public override {
    super.setUpGeneric();
    this.setUpTokens(options.base.symbol, options.quote.symbol);
  }
}

contract NoRouterKandelGasreqBaseTest_Polygon_WETH_DAI is NoRouterKandelGasreqBaseTest {
  function setUp() public override {
    super.setUpPolygon();
    this.setUpTokens("WETH", "DAI");
  }
}

contract AaveKandelGasreqBaseTest_Polygon_WETH_DAI is AaveKandelGasreqBaseTest {
  function setUp() public override {
    super.setUpPolygon();
    this.setUpTokens("WETH", "DAI");
  }
}

contract AaveKandelGasreqBaseTest_Generic_A_B is AaveKandelGasreqBaseTest {
  function setUp() public override {
    super.setUpGeneric();
    address aave = address(new PoolAddressProviderMock(dynamic([address(base), address(quote)])));
    fork.set("Aave", aave);
    this.setUpTokens(options.base.symbol, options.quote.symbol);
  }
}
