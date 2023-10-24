// SPDX-License-Identifier: BSD-2-Clause
pragma solidity ^0.8.10;

import {MangroveTest} from "mgv_test/lib/MangroveTest.sol";

import {PinnedPolygonFork} from "mgv_test/lib/forks/Polygon.sol"; // have to use ar polygon fork on a newer block
import {TestToken} from "mgv_test/lib/tokens/TestToken.sol";
import {IERC20, OLKey} from "@mgv/src/core/MgvLib.sol";
import {IUniswapV3Pool} from "lib/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "src/MgvArbitrage.sol";

contract MgvArbitrageTest is MangroveTest {
  PinnedPolygonFork fork;
  MgvArbitrage arbStrat;
  IERC20 WETH;
  IERC20 USDC;
  IERC20 DAI;

  address payable taker;
  address payable seller;
  address payable lp;
  address payable admin;
  address payable arbitrager;

  IUniswapV3Pool uniswapV3PoolWETHUSDC3000 = IUniswapV3Pool(0x0e44cEb592AcFC5D3F09D996302eB4C499ff8c10);

  IERC20[] tokens;

  receive() external payable virtual {}

  function setUp() public override {
    // use the pinned Polygon fork
    fork = new PinnedPolygonFork(39764951); // use polygon fork to use dai, usdc and weth addresses
    fork.setUp();
    mgv = setupMangrove();
    WETH = IERC20(fork.get("WETH"));
    USDC = IERC20(fork.get("USDC"));
    DAI = IERC20(fork.get("DAI"));

    olKey = OLKey(address(WETH), address(USDC), options.defaultTickSpacing);
    lo = olKey.flipped();
    setupMarket(olKey);

    olKey = OLKey(address(DAI), address(USDC), options.defaultTickSpacing);
    lo = olKey.flipped();
    setupMarket(olKey);

    tokens = new IERC20[](3);
    tokens[0] = WETH;
    tokens[1] = USDC;
    tokens[2] = DAI;

    admin = freshAddress();
    taker = freshAddress();
    fork.set("taker", taker);
    seller = freshAddress();
    fork.set("seller", seller);
    lp = freshAddress();
    fork.set("lp", lp);
    arbitrager = admin;
    fork.set("arbitrager", arbitrager);

    deal($(USDC), lp, cash(USDC, 100000));
    deal($(DAI), lp, cash(DAI, 100000));
    deal(taker, 10 ether);
    deal(seller, 10 ether);
    deal(lp, 10 ether);

    vm.startPrank(taker);
    USDC.approve($(mgv), type(uint).max);
    WETH.approve($(mgv), type(uint).max);
    vm.stopPrank();

    vm.startPrank(seller);
    WETH.approve(address(mgv), type(uint).max);
    USDC.approve(address(mgv), type(uint).max);
    vm.stopPrank();

    vm.startPrank(arbitrager);
    WETH.approve(address(mgv), type(uint).max);
    USDC.approve(address(mgv), type(uint).max);
    vm.stopPrank();

    deployStrat();
  }

  function deployStrat() public {
    arbStrat = new MgvArbitrage({
      _mgv: IMangrove($(mgv)),
      admin: admin,
      _arbitrager: arbitrager
    });
    fork.set("MgvArbitrage", address(arbStrat));

    vm.startPrank(taker);
    WETH.approve(address(arbStrat), type(uint).max);
    vm.stopPrank();
  }

  /*
   * Offer WETH / USDC
   */
  function test_isProfitableFirstMangroveThenUniswapWETHUSDC() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(USDC), address(arbStrat), cash(USDC, 20000));
    deal($(WETH), seller, cash(WETH, 10));

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      gives: cash(WETH, 1),
      wants: cash(USDC, 1000),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: USDC,
      takerWantsToken: WETH,
      tickSpacing: 1,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: uint160(cash(USDC, 100))
    });

    uint usdcBalanceBefore = USDC.balanceOf(address(arbStrat));
    uint wethBalanceBefore = WETH.balanceOf(address(arbStrat));
    vm.prank(admin);
    arbStrat.doArbitrageFirstMangroveThenUniswap(params);
    uint usdcBalanceAfter = USDC.balanceOf(address(arbStrat));
    uint wethBalanceAfter = WETH.balanceOf(address(arbStrat));
    assertTrue(usdcBalanceAfter > usdcBalanceBefore, "Should have increased usdcBalance");
    assertTrue(wethBalanceAfter == wethBalanceBefore, "Should have the same wethBalance");
  }

  function test_isNotProfitableBecauseGainToLowFirstMangroveThenUniswapWETHUSDC() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(USDC), address(arbStrat), cash(USDC, 20000));
    deal($(WETH), seller, cash(WETH, 10));

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(USDC, 1000),
      gives: cash(WETH, 1),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: USDC,
      takerWantsToken: WETH,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: uint160(cash(USDC, 10000))
    });

    vm.prank(admin);
    vm.expectRevert("MgvArbitrage/notProfitable");
    arbStrat.doArbitrageFirstMangroveThenUniswap(params);
  }

  function test_isNotProfitableFirstMangroveThenUniswapWETHUSDC() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(USDC), address(arbStrat), cash(USDC, 20000));
    deal($(WETH), seller, cash(WETH, 10));

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(USDC, 2000),
      gives: cash(WETH, 1),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: USDC,
      takerWantsToken: WETH,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    vm.prank(admin);
    vm.expectRevert("MgvArbitrage/notProfitable");
    arbStrat.doArbitrageFirstMangroveThenUniswap(params);
  }

  function test_isProfitablePriceUniswapFirstThenMangroveWETHUSDC() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(WETH), address(arbStrat), cash(WETH, 2));
    deal($(WETH), seller, cash(WETH, 10));

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(USDC, 2000),
      gives: cash(WETH, 2),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: WETH,
      takerWantsToken: USDC,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    uint usdcBalanceBefore = USDC.balanceOf(address(arbStrat));
    uint wethBalanceBefore = WETH.balanceOf(address(arbStrat));
    vm.prank(admin);
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
    uint usdcBalanceAfter = USDC.balanceOf(address(arbStrat));
    uint wethBalanceAfter = WETH.balanceOf(address(arbStrat));

    assertTrue(usdcBalanceAfter == usdcBalanceBefore, "Should have the same usdc balance");
    assertTrue(wethBalanceAfter > wethBalanceBefore, "Should have increase weth balance");
  }

  function test_isProfitablePriceUniswapFirstThenMangroveWETHUSDCPartialFill() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(WETH), address(arbStrat), cash(WETH, 1));
    deal($(WETH), seller, cash(WETH, 10));

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(USDC, 2000),
      gives: cash(WETH, 2),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: WETH,
      takerWantsToken: USDC,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    uint usdcBalanceBefore = USDC.balanceOf(address(arbStrat));
    uint wethBalanceBefore = WETH.balanceOf(address(arbStrat));
    vm.prank(admin);
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
    uint usdcBalanceAfter = USDC.balanceOf(address(arbStrat));
    uint wethBalanceAfter = WETH.balanceOf(address(arbStrat));

    assertTrue(usdcBalanceAfter == usdcBalanceBefore, "Should have the same usdc balance");
    assertTrue(wethBalanceAfter > wethBalanceBefore, "Should have increase weth balance");
  }

  function test_isNotProfitableGainToLowPriceUniswapFirstThenMangroveWETHUSDC() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    deal($(WETH), address(arbStrat), cash(WETH, 2));
    deal($(WETH), seller, cash(WETH, 10));
    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(USDC, 2000),
      gives: cash(WETH, 2),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: WETH,
      takerWantsToken: USDC,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: uint160(cash(WETH, 3))
    });

    vm.prank(admin);
    vm.expectRevert("MgvArbitrage/notProfitable");
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
  }

  function test_isNotProfitablePriceUniswapFirstThenMangroveWETHUSDC() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    OLKey memory olKey = OLKey($(WETH), $(USDC), options.defaultTickSpacing);

    deal($(WETH), address(arbStrat), cash(WETH, 2));
    deal($(WETH), seller, cash(WETH, 10));
    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(USDC, 4000),
      gives: cash(WETH, 2),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: WETH,
      takerWantsToken: USDC,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    vm.prank(admin);
    vm.expectRevert(); // revert because taker does not have enough USDC when selling his ETH.
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
  }

  /*
   * Offer USDC / WETH
   */

  function test_isProfitableFirstMangroveThenUniswapUSDCWETH() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    OLKey memory olKey = OLKey($(USDC), $(WETH), options.defaultTickSpacing);

    deal($(WETH), address(arbStrat), cash(WETH, 10));
    deal($(USDC), seller, cash(USDC, 2000));
    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(WETH, 1),
      gives: cash(USDC, 2000),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: WETH,
      takerWantsToken: USDC,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    uint usdcBalanceBefore = USDC.balanceOf(address(arbStrat));
    uint wethBalanceBefore = WETH.balanceOf(address(arbStrat));
    vm.prank(admin);
    arbStrat.doArbitrageFirstMangroveThenUniswap(params);
    uint usdcBalanceAfter = USDC.balanceOf(address(arbStrat));
    uint wethBalanceAfter = WETH.balanceOf(address(arbStrat));
    assertTrue(usdcBalanceAfter == usdcBalanceBefore, "Should have the same usdcBalance");
    assertTrue(wethBalanceAfter > wethBalanceBefore, "Should have increase wethBalance");
  }

  function test_isNotProfitableFirstMangroveThenUniswapUSDCWETH() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    OLKey memory olKey = OLKey($(USDC), $(WETH), options.defaultTickSpacing);

    deal($(WETH), address(arbStrat), cash(WETH, 10));
    deal($(USDC), seller, cash(USDC, 2000));
    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(WETH, 1),
      gives: cash(USDC, 1000),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: WETH,
      takerWantsToken: USDC,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    vm.prank(admin);
    vm.expectRevert("MgvArbitrage/notProfitable");
    arbStrat.doArbitrageFirstMangroveThenUniswap(params);
  }

  function test_isProfitablePriceUniswapFirstThenMangroveUSDCWETH() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(USDC), address(arbStrat), cash(USDC, 1000));
    deal($(USDC), seller, cash(USDC, 2000));

    OLKey memory olKey = OLKey($(USDC), $(WETH), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(WETH, 1),
      gives: cash(USDC, 2000),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: USDC,
      takerWantsToken: WETH,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    uint usdcBalanceBefore = USDC.balanceOf(address(arbStrat));
    uint wethBalanceBefore = WETH.balanceOf(address(arbStrat));
    vm.prank(admin);
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
    uint usdcBalanceAfter = USDC.balanceOf(address(arbStrat));
    uint wethBalanceAfter = WETH.balanceOf(address(arbStrat));

    assertTrue(usdcBalanceAfter > usdcBalanceBefore, "Should have increased usdcBalance");
    assertTrue(wethBalanceAfter == wethBalanceBefore, "Should have the same wetBalance");
  }

  function test_isProfitablePriceUniswapFirstThenMangroveUSDCWETHPartialFill() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(USDC), address(arbStrat), cash(USDC, 40000));
    deal($(USDC), seller, cash(USDC, 2000));

    OLKey memory olKey = OLKey($(USDC), $(WETH), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(WETH, 1),
      gives: cash(USDC, 2000),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: USDC,
      takerWantsToken: WETH,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    uint usdcBalanceBefore = USDC.balanceOf(address(arbStrat));
    uint wethBalanceBefore = WETH.balanceOf(address(arbStrat));
    vm.prank(admin);
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
    uint usdcBalanceAfter = USDC.balanceOf(address(arbStrat));
    uint wethBalanceAfter = WETH.balanceOf(address(arbStrat));

    assertTrue(usdcBalanceAfter > usdcBalanceBefore, "Should have increased usdcBalance");
    assertTrue(wethBalanceAfter == wethBalanceBefore, "Should have the same wetBalance");
  }

  function test_isNotProfitablePriceUniswapFirstThenMangroveUSDCWETH() public {
    vm.startPrank(admin);
    arbStrat.activateTokens(tokens);
    arbStrat.setPool(address(uniswapV3PoolWETHUSDC3000), true);
    vm.stopPrank();

    deal($(USDC), address(arbStrat), cash(USDC, 40000));
    deal($(USDC), seller, cash(USDC, 2000));

    OLKey memory olKey = OLKey($(USDC), $(WETH), options.defaultTickSpacing);

    vm.prank(seller);
    mgv.newOfferByVolume{value: 1 ether}({
      olKey: olKey,
      wants: cash(WETH, 8),
      gives: cash(USDC, 2000),
      gasreq: 50_000,
      gasprice: 0
    });

    ArbParams memory params = ArbParams({
      takerGivesToken: USDC,
      takerWantsToken: WETH,
      tickSpacing: options.defaultTickSpacing,
      pool: uniswapV3PoolWETHUSDC3000,
      minimumGain: 0
    });

    vm.prank(admin);
    vm.expectRevert();
    arbStrat.doArbitrageFirstUniwapThenMangrove(params);
  }

  function test_canWithdrawNative() public {
    deal(address(arbStrat), 10 ether);
    vm.prank(seller);
    vm.expectRevert("AccessControlled/Invalid");
    arbStrat.withdrawNative(10 ether, address(seller));

    uint sellerNativeBalance = address(seller).balance;
    vm.prank(admin);
    arbStrat.withdrawNative(10 ether, address(seller));
    assertEq(address(seller).balance - sellerNativeBalance, 10 ether, "Should have withdrawn the Native");
  }

  function test_onlyAdminCanActivateTokens() public {
    vm.prank(seller);
    vm.expectRevert("AccessControlled/Invalid");
    arbStrat.activateTokens(tokens);

    vm.prank(admin);
    arbStrat.activateTokens(tokens);
  }

  function test_onlyAdminCanSetAdmin() public {
    vm.prank(seller);
    vm.expectRevert("AccessControlled/Invalid");
    arbStrat.setAdmin(seller);

    vm.prank(admin);
    arbStrat.setAdmin(seller);
    assertEq(arbStrat.admin(), seller, "Should have changed the admin");
  }

  function test_onlyAdminCanSetMgv() public {
    vm.prank(seller);
    vm.expectRevert("AccessControlled/Invalid");
    arbStrat.setMgv(IMangrove(seller));

    vm.prank(admin);
    arbStrat.setMgv(IMangrove(seller));
    assertEq(address(arbStrat.mgv()), seller, "Should have changed the mgv");
  }
}
