// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {Script, console2 as console} from "@mgv/forge-std/Script.sol";
import {Kandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/Kandel.sol";
import {IERC20} from "@mgv/lib/IERC20.sol";
import {CoreKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/CoreKandel.sol";
import {GeometricKandel} from "@mgv-strats/src/strategies/offer_maker/market_making/kandel/abstract/GeometricKandel.sol";
import {MgvReader} from "@mgv/src/periphery/MgvReader.sol";
import {Deployer} from "@mgv/script/lib/Deployer.sol";
import {toFixed} from "@mgv/lib/Test2.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";
import {TickLib, Tick} from "@mgv/lib/core/TickLib.sol";

/**
 * @notice Populates Kandel's distribution on Mangrove
 */

/*
  KANDEL=Kandel_WETH_USDC FROM=0 TO=100 FIRST_ASK_INDEX=50 PRICE_POINTS=100\
     [RATIO=10100] [TICK_OFFSET=769] STEP_SIZE=1 INIT_QUOTE=$(cast ff 6 100) VOLUME=$(cast ff 18 0.1)\
     forge script KandelPopulate --fork-url $LOCALHOST_URL --private-key $MUMBAI_PRIVATE_KEY --broadcast
 */

contract KandelPopulate is Deployer {
  function run() public {
    GeometricKandel kdl = Kandel(envAddressOrName("KANDEL"));
    Kandel.Params memory params;
    uint24 tickOffset;
    if (envHas("TICK_OFFSET")) {
      tickOffset = uint24(vm.envUint("TICK_OFFSET"));
      require(tickOffset == vm.envUint("TICK_OFFSET"), "Invalid TICK_OFFSET");
    }
    if (envHas("RATIO")) {
      require(tickOffset == 0, "Only RATIO or TICK_OFFSET");
      int _tickOffset = Tick.unwrap(TickLib.tickFromVolumes(1 ether * uint(vm.envUint("RATIO")) / (100000), 1 ether));
      tickOffset = uint24(uint(int(_tickOffset)));
      require(tickOffset == uint(_tickOffset), "Invalid ratio");
    }
    params.pricePoints = uint32(vm.envUint("PRICE_POINTS"));
    require(params.pricePoints == vm.envUint("PRICE_POINTS"), "Invalid PRICE_POINTS");
    params.stepSize = uint32(vm.envUint("STEP_SIZE"));
    require(params.stepSize == vm.envUint("STEP_SIZE"), "Invalid STEP_SIZE");

    innerRun(
      HeapArgs({
        from: vm.envUint("FROM"),
        to: vm.envUint("TO"),
        firstAskIndex: vm.envUint("FIRST_ASK_INDEX"),
        tickOffset: tickOffset,
        params: params,
        initQuote: vm.envUint("INIT_QUOTE"),
        volume: vm.envUint("VOLUME"),
        kdl: kdl,
        mgvReader: MgvReader(envAddressOrName("MGV_READER", "MgvReader"))
      })
    );
  }

  ///@notice Arguments for innerRun
  ///@param initQuote the amount of quote tokens that Kandel must want/give at `from` index
  ///@param firstAskIndex the (inclusive) index after which offer should be an ask.
  ///@param provBid the amount of provision (in native tokens) that are required to post a fresh bid
  ///@param provAsk the amount of provision (in native tokens) that are required to post a fresh ask
  ///@param kdl the Kandel instance
  ///@param mgv is kdl.MGV()
  ///@param base is kdl.BASE()
  ///@param quote is kdl.QUOTE()
  ///@param mgvReader the MgvReader

  struct HeapArgs {
    uint from;
    uint to;
    uint firstAskIndex;
    uint24 tickOffset;
    Kandel.Params params;
    uint initQuote;
    uint volume;
    GeometricKandel kdl;
    MgvReader mgvReader;
  }

  struct HeapVars {
    CoreKandel.Distribution distribution;
    uint baseAmountRequired;
    uint quoteAmountRequired;
    bool bidding;
    uint snapshotId;
    uint lastOfferId;
    uint gasreq;
    uint gasprice;
    MgvReader mgvReader;
    IERC20 BASE;
    IERC20 QUOTE;
    uint provAsk;
    uint provBid;
  }

  function innerRun(HeapArgs memory args) public {
    HeapVars memory vars;

    vars.mgvReader = args.mgvReader;
    vars.BASE = args.kdl.BASE();
    vars.QUOTE = args.kdl.QUOTE();
    (vars.gasprice, vars.gasreq,,) = args.kdl.params();

    OLKey memory olKeyBaseQuote =
      OLKey({outbound_tkn: address(vars.BASE), inbound_tkn: address(vars.QUOTE), tickSpacing: args.kdl.TICK_SPACING()});
    vars.provAsk = vars.mgvReader.getProvision(olKeyBaseQuote, vars.gasreq, vars.gasprice);
    vars.provBid = vars.mgvReader.getProvision(olKeyBaseQuote.flipped(), vars.gasreq, vars.gasprice);
    uint funds = (vars.provAsk + vars.provBid) * (args.to - args.from);
    if (broadcaster().balance < funds) {
      console.log(
        "Broadcaster does not have enough funds to provision offers. Missing",
        toFixed(funds - broadcaster().balance, 18),
        "native tokens"
      );
      require(false, "Not enough funds");
    }

    prettyLog("Calculating base and quote...");
    vars.distribution = calculateBaseQuote(args);

    prettyLog("Evaluating required collateral...");
    evaluateAmountsRequired(vars);
    // after the above call, `vars.base/quoteAmountRequired` are filled
    uint baseDecimals = vars.BASE.decimals();
    uint quoteDecimals = vars.QUOTE.decimals();
    prettyLog(
      string.concat(
        "Required collateral of base is ",
        toFixed(vars.baseAmountRequired, baseDecimals),
        " and quote is ",
        toFixed(vars.quoteAmountRequired, quoteDecimals)
      )
    );

    string memory deficit;

    if (vars.BASE.balanceOf(broadcaster()) < vars.baseAmountRequired) {
      deficit = string.concat(
        "Not enough base (",
        vm.toString(address(vars.BASE)),
        "). Deficit: ",
        toFixed(vars.baseAmountRequired - vars.BASE.balanceOf(broadcaster()), baseDecimals)
      );
    }
    if (vars.QUOTE.balanceOf(broadcaster()) < vars.quoteAmountRequired) {
      deficit = string.concat(
        bytes(deficit).length > 0 ? string.concat(deficit, ". ") : "",
        "Not enough quote (",
        vm.toString(address(vars.QUOTE)),
        "). Deficit: ",
        toFixed(vars.quoteAmountRequired - vars.QUOTE.balanceOf(broadcaster()), quoteDecimals)
      );
    }
    if (bytes(deficit).length > 0) {
      deficit = string.concat("broadcaster: ", vm.toString(broadcaster()), " ", deficit);
      prettyLog(deficit);
      revert(deficit);
    }

    prettyLog("Approving base and quote...");
    broadcast();
    vars.BASE.approve(address(args.kdl), vars.baseAmountRequired);
    broadcast();
    vars.QUOTE.approve(address(args.kdl), vars.quoteAmountRequired);

    prettyLog("Populating Mangrove...");

    broadcast();

    args.kdl.populate{value: funds}(vars.distribution, args.params, vars.baseAmountRequired, vars.quoteAmountRequired);
    console.log(toFixed(funds, 18), "native tokens used as provision");
  }

  function calculateBaseQuote(HeapArgs memory args) public pure returns (CoreKandel.Distribution memory distribution) {
    Tick baseQuoteTickIndex0 = TickLib.tickFromVolumes(args.initQuote, args.volume);
    distribution = args.kdl.createDistribution(
      args.from,
      args.to,
      baseQuoteTickIndex0,
      args.tickOffset,
      args.firstAskIndex,
      type(uint).max,
      args.volume,
      args.params.pricePoints,
      args.params.stepSize
    );
  }

  ///@notice evaluates required amounts that need to be published on Mangrove
  ///@dev we use foundry cheats to revert all changes to the local node in order to prevent inconsistent tests.
  function evaluateAmountsRequired(HeapVars memory vars) public pure {
    for (uint i = 0; i < vars.distribution.bids.length; ++i) {
      vars.quoteAmountRequired += vars.distribution.bids[i].gives;
    }
    for (uint i = 0; i < vars.distribution.asks.length; ++i) {
      vars.baseAmountRequired += vars.distribution.asks[i].gives;
    }
  }
}
