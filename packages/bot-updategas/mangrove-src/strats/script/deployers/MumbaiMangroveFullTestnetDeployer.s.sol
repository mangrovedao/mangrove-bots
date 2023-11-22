// SPDX-License-Identifier:	AGPL-3.0
pragma solidity ^0.8.13;

import {ToyENS} from "@mgv/lib/ToyENS.sol";

import {Deployer} from "@mgv/script/lib/Deployer.sol";

import {MumbaiMangroveDeployer} from "@mgv/script/core/deployers/MumbaiMangroveDeployer.s.sol";
import {MumbaiMangroveOrderDeployer} from
  "@mgv-strats/script/strategies/mangroveOrder/deployers/MumbaiMangroveOrderDeployer.s.sol";
import {
  MumbaiKandelSeederDeployer,
  KandelSeeder,
  AaveKandelSeeder
} from "@mgv-strats/script/strategies/kandel/deployers/MumbaiKandelSeederDeployer.s.sol";

import {Market, ActivateMarket, IERC20} from "@mgv/script/core/ActivateMarket.s.sol";
import {
  ActivateMangroveOrder, MangroveOrder
} from "@mgv-strats/script/strategies/mangroveOrder/ActivateMangroveOrder.s.sol";
import {KandelSower} from "@mgv-strats/script/strategies/kandel/KandelSower.s.sol";
import {IPoolAddressesProvider} from "@mgv-strats/src/strategies/vendor/aave/v3/IPoolAddressesProvider.sol";
import {IPriceOracleGetter} from "@mgv-strats/src/strategies/vendor/aave/v3/IPriceOracleGetter.sol";
import {IMangrove} from "@mgv/src/IMangrove.sol";
import {MgvReader} from "@mgv/src/periphery/MgvReader.sol";
import {OLKey} from "@mgv/src/core/MgvLib.sol";

/**
 * Deploy and configure a complete Mangrove testnet deployment:
 * - Mangrove and periphery contracts
 * - MangroveOrder
 * - KandelSeeder and AaveKandelSeeder
 * - open markets using own tokens and AAVE tokens:
 *   - AAVE tokens: WBTC/DAI, CRV/WBTC
 *   - Own tokens: WMATIC/USDT, USDC/USDT, WETH/USDT
 * - prices for AAVE tokens is given by an oracle in USD/TOKEN (in human readable numbers) with 8 decimals of precision.
 *      Script will throw if oracle uses ETH as base currency instead of USD (as oracle contract permits).
 * - prices for own tokens are hard-coded in USD with 8 decimals of precision.
 */
contract MumbaiMangroveFullTestnetDeployer is Deployer {
  function run() public {
    runWithChainSpecificParams();
    outputDeployment();
  }

  function toMweiOfMatic(uint price, uint maticPrice) internal pure returns (uint) {
    return (price * 10 ** 12) / maticPrice;
  }

  struct TokenAndPrice {
    IERC20 token;
    // Prices are in USD/TOKEN (in human readable numbers) with 8 decimals of precision
    uint price;
  }

  // Placing tokens in a struct to avoid stack too deep error
  struct Tokens {
    // AAVE tokens:
    TokenAndPrice dai;
    TokenAndPrice crv;
    TokenAndPrice wbtc;
    // Mangrove deployed tokens:
    TokenAndPrice usdc;
    TokenAndPrice usdt;
    TokenAndPrice weth;
    TokenAndPrice wmatic;
  }

  struct MarketToOpen {
    TokenAndPrice tkn1;
    TokenAndPrice tkn2;
    uint tickSpacing;
  }

  function runWithChainSpecificParams() public {
    // Deploy Mangrove
    new MumbaiMangroveDeployer().runWithChainSpecificParams();
    IMangrove mgv = IMangrove(fork.get("Mangrove"));
    MgvReader reader = MgvReader(fork.get("MgvReader"));
    // NB: The oracle only works for AAVE tokens
    IPriceOracleGetter priceOracle =
      IPriceOracleGetter(IPoolAddressesProvider(fork.get("AaveAddressProvider")).getAddress("PRICE_ORACLE"));
    require(priceOracle.BASE_CURRENCY() == address(0), "script assumes base currency is in USD");

    // Deploy MangroveOrder
    new MumbaiMangroveOrderDeployer().runWithChainSpecificParams();
    MangroveOrder mangroveOrder = MangroveOrder(fork.get("MangroveOrder"));

    // Deploy KandelSeeder & AaveKandelSeeder
    (KandelSeeder seeder, AaveKandelSeeder aaveSeeder) = new MumbaiKandelSeederDeployer().runWithChainSpecificParams();

    // Activate markets
    Tokens memory tokens;
    // AAVE tokens:
    tokens.dai.token = IERC20(fork.get("DAI"));
    tokens.crv.token = IERC20(fork.get("CRV"));
    tokens.wbtc.token = IERC20(fork.get("WBTC"));
    // Mangrove deployed tokens:
    tokens.usdc.token = IERC20(fork.get("USDC"));
    tokens.usdt.token = IERC20(fork.get("USDT"));
    tokens.weth.token = IERC20(fork.get("WETH"));
    tokens.wmatic.token = IERC20(fork.get("WMATIC"));

    // Get prices for AAVE tokens
    uint[] memory prices = priceOracle.getAssetsPrices(
      dynamic([address(tokens.dai.token), address(tokens.crv.token), address(tokens.wbtc.token)])
    );
    tokens.dai.price = prices[0];
    tokens.crv.price = prices[1];
    tokens.wbtc.price = prices[2];
    // There is no oracle for Mangrove deployed tokens, so we hard-code the prices
    tokens.usdc.price = 1 * 10 ** 8;
    tokens.usdt.price = 1 * 10 ** 8;
    tokens.weth.price = 1846 * 10 ** 8;
    tokens.wmatic.price = 65 * 10 ** 6;

    MarketToOpen[] memory markets = new MarketToOpen[](5);
    // AAVE token markets
    markets[0] = MarketToOpen({tkn1: tokens.wbtc, tkn2: tokens.dai, tickSpacing: 1}); // Using 1 bps tick size like popular CEX.
    markets[1] = MarketToOpen({tkn1: tokens.crv, tkn2: tokens.wbtc, tickSpacing: 1});
    // Mangrove deployed token markets
    markets[2] = MarketToOpen({tkn1: tokens.wmatic, tkn2: tokens.usdt, tickSpacing: 1});
    markets[3] = MarketToOpen({tkn1: tokens.usdc, tkn2: tokens.usdt, tickSpacing: 1}); //Stable/stable ticks should be as small as possible, so using tick spacing 1
    markets[4] = MarketToOpen({tkn1: tokens.weth, tkn2: tokens.usdt, tickSpacing: 1}); // Using 1 bps tick size like popular CEX.

    for (uint i = 0; i < markets.length; i++) {
      // 1 token_i = (price_i / 10**8) USD
      // 1 USD = (10**8 / maticPrice) Matic
      // 1 token_i = (price_i * 10**12 / maticPrice) gwei of Matic
      new ActivateMarket().innerRun({
        mgv: mgv,
        gaspriceOverride: 140, // this overrides Mangrove's gasprice for the computation of market's density
        reader: reader,
        market: Market({tkn0: address(markets[i].tkn1.token), tkn1: address(markets[i].tkn2.token), tickSpacing: 1}),
        tkn1_in_Mwei: toMweiOfMatic(markets[i].tkn1.price, tokens.wmatic.price),
        tkn2_in_Mwei: toMweiOfMatic(markets[i].tkn2.price, tokens.wmatic.price),
        fee: 0
      });
    }

    // Activate MangroveOrder on markets
    IERC20[] memory iercs = new IERC20[](7);
    iercs[0] = tokens.dai.token;
    iercs[1] = tokens.crv.token;
    iercs[2] = tokens.wbtc.token;
    iercs[3] = tokens.usdc.token;
    iercs[4] = tokens.usdt.token;
    iercs[5] = tokens.weth.token;
    iercs[6] = tokens.wmatic.token;
    new ActivateMangroveOrder().innerRun({
      mgvOrder: mangroveOrder,
      iercs: iercs
    });

    // Deploy Kandel instance via KandelSeeder to get the Kandel contract verified
    new KandelSower().innerRun({
      kandelSeeder: seeder,
      olKeyBaseQuote: OLKey(address(markets[0].tkn1.token), address(markets[0].tkn2.token), markets[0].tickSpacing),
      sharing: false,
      onAave: false,
      registerNameOnFork: false,
      name: ""
    });

    // Deploy AaveKandel instance via AaveKandelSeeder to get the AaveKandel contract verified
    new KandelSower().innerRun({
      kandelSeeder: aaveSeeder,
      olKeyBaseQuote: OLKey(address(markets[1].tkn1.token), address(markets[1].tkn2.token), markets[1].tickSpacing),
      sharing: false,
      onAave: true,
      registerNameOnFork: false,
      name: ""
    });
  }
}
