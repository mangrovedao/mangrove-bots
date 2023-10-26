# Contracts in scope for the audit

Changes since Audit March 2023:

- Split out into [Mangrove strats repo](https://github.com/mangrovedao/mangrove-strats) from Mangrove-core. No code changes except core parts deleted.
- Uptake of new core protocol. This has lots of mechanical, cross-cutting changes not mentioned for specific contracts below, and also for contracts not specifically mentioned due to only having these changes.
  - `(outbound_tkn, inbound_tkn)` changed to `OLKey` in parameters.
  - `[outbound_tkn][inbound_tkn]` changed to `OLKey.hash()` in events and mappings.
  - `(gives, wants)` changed to `(gives, tick)` in maker perspective (MangroveOrder and Kandel)
  - Events changed to use `OLKey` and streamlined.
  - `pivotId` removed completely.
  - `gasprice` is now 26 bits in Mwei.
- Strat library
  - MangroveOffer: `residualGives` and `residualWants` removed. Replaced with `residualValues` which by default keeps price (`tick`) and calculates remaining `gives` like before.
  - TransferLib moved to core.
  - SimpleRouter now inherits from a MonoRouter to specify that it only has a single-sourcing perspective.
- Mangrove Order strategy
  - `(gives, wants)` changed to `(fillVolume, tick)` in taker perspective given by `TakerOrder`.
  - Manipulation of `gives` and the implicit `wants` follows the same pattern as the core protocol during a market order.
  - The resting order is posted via the inverse price, which is now simpler than before, since it is just the negative tick.
  - The ability to reuse an old, owned offer id is added.
- Kandel strategy
  - Conceptual change: Do not calculate price of offers and create them on the fly in the posthook, instead allocate all offers up front, and set their price.
  - Cross-cutting: Refactoring to reduce bytecode size, deduplicating some functions.
  - GeometricKandel:
    - Moved all code which is agnostic to the geometric price progression to upstream classes; CoreKandel for Kandel-specific code, and DirectWithBidsAndAsksDistribution for Kandel-agnostic, but bids/asks-distribution-specific code.
    - Reduced complexity significantly by removing compounding parameter and initializing all Kandel offers up front with their price (tick) stored in the core protocol
      - It is now an invariant that an offer and its dual are both created at the same time, since posthook never creates offers, only updates.
    - Previously price of dual offer had to be calculated based on ratio, spread, and current price (in the now deleted `dualWantsGivesOfOffer`). Now the price (tick) stays put, and only volume is moved between offers - and this is now independent of the price distribution and moved to CoreKandel. This also removes rounding errors when updating the dual offer.
    - Forwards calls to generate the offer distribution to populate a geometric Kandel instance to the new KandelLib which has a `createGeometricDistribution`. This on-chain generation function in KandelLib is introduced to reduce call data size for L2s. A library is used to reduce contract size.
    - Introduced a `baseQuoteTickOffset` to replace the old `ratio` parameter. Since prices in the core protocol follow a geometric progression, we offset via adding a tick offset, instead of multiplying by a ratio. All other parameters moved to CoreKandel.
    - Reduced complexity, and using offsets for price differences means we can support much larger price differences.
  - KandelLib:
    - Received a cut-paste of the now simplified version of the `transportDestination` from GeometricKandel.
    - Introduces the `createGeometricDistribution` function mentioned above.
  - CoreKandel:
    - Received code from GeometricKandel
    - Increased range of constants due to decreased complexity of calculations and removal of overflow scenarios.
    - Spread renamed to step size.
  - DirectWithBidsAndAskDistribution
    - Distribution struct changed to containing structs instead of arrays to reduce bytecode size and save gas.
    - `populate` and `populateIndex` changed to be able to "reserve" offers on the offer list by creating and retracting offers up front if `gives` in the offer distribution is 0 for said offer. This is to avoid having to create offers during `posthook` since it is expensive and complicates logic. Note, since the core protocol does not accept 0 gives, we have to use a minimum gives based on the density requirements of the core protocol.
  - AaveKandel: Removed explicit check of initialization on router usage to save gas and bytecode.
  - IHasTokenPairOfOfferType: Renamed to IHasOfferListOfOfferType due to OLKey.
  - AbstractKandel: Removed, merged into CoreKandel.
  - KandelSeeder: moved event to specific seeder to reduce bytecode size.

With respect to files to audit, then `src/strategies/offer_maker/market_making/kandel/abstract/AbstractKandel.sol` has been removed and `src/strategies/offer_maker/market_making/kandel/abstract/KandelLib.sol` and `src/strategies/routers/abstract/MonoRouter.sol` have been added.

The following diagram shows an overview of components making up the Kandel AMM contract.
![SVG Kandel overview](./kandel.drawio.svg)

# Changes audited as part of the audit March 2023

Audit March 2023: 3bff09efba82a6d55d19eeb807654833339785f1

Kandel makes use of the same building blocks as MangroveOrder which was previously audited. MangroveOffer was a Forwarder strat - multiple accounts could interact with it. Kandel is a Direct strat and is managed by a single account. The green components are new for Kandel. The blue are not specific to Kandel, but changed and used by Kandel. Kandel can use AAVE via a router. The components making up the router are purple. Finally, the orange components make up the seeder contracts which are used to deploy Kandel contracts in a permissionless manner, but still bound to the router. The boxes with rounded corners are deployed while the others are abstract.

## Kandel and AAVE router

### src/strategies/offer_maker/market_making/kandel/Kandel.sol

The direct Kandel AMM contract without a router.

### src/strategies/routers/integrations/AavePooledRouter.sol

A new type of router able to deposit and withdraw funds on AAVE v3. This router is pooling liquidity of all the maker contracts that are bound to it. Balance of each maker is maintained by means of share balances. Shares are not transferable.

### src/strategies/offer_maker/market_making/kandel/AaveKandel.sol

The AavePooledRouter version of the Kandel contract.

### src/strategies/offer_maker/market_making/kandel/KandelSeeder.sol

A contract to do permissionless deploy the Kandel contract.

### src/strategies/offer_maker/market_making/kandel/AaveKandelSeeder.sol

A contract to do permissionless deploy the AaveKandel contract and bind to a shared router

### src/strategies/offer_maker/market_making/kandel/abstract/AbstractKandelSeeder.sol

An abstract contract for the two seeders above.

### Dependencies

Kandel type strategies and Aave router have the following dependencies:

- AbstractKandel: Core abstract functions offered by Kandel strats
- GeometricKandel: Implements the geometric price progression used in the Kandel strat without storing the actual prices
- CoreKandel: Implements the core of the Kandel strat which updates a dual offer whenever an offer is taken, but is agnostic to the actual price distribution.
- TradesBaseQuotePair: Implements helper functions for trading a base, quote pair of tokens using bid and ask terminology.
- HasIndexedBidsAndAsks: Implements the ability to have a [0..length] indexed set of offers on Mangrove for both bids and asks
- DirectWithBidsAndAskDistribution: Adorns the Direct strat with indexed bids and asks and allows the offers to be populated according to a given base and quote distribution.
- AbstractRouter: the root contract for routers (already audited, see changes below)
- AaveV3Lender: a module that implements AAVE v3 interaction capacities.
- Direct: the basic strat building block for private maker contracts (as opposed to Forwarder contracts)
- MangroveOffer: the root contract for strats (already audited, see changes below)
- AccessControlled: admin management (already audited, see changes below)

## Minor changes to already audited code

### src/strategies/utils/AccessControlled.sol

- Separate storage removed
- new modifier `adminOrCaller` that tests caller first to optimize gas during offer logic execution

### src/strategies/MangroveOffer.sol

- external storage contract is removed. It was planned for future extension of the strat that would yield a too large code, but it was detrimental to gas efficiency.
- cosmetic changes of variables and constant names
- `logRepostStatus` is called at the end of `__posthookSuccess__` in order to log unexpected failure to repost
- `__reserve__` hook was removed (no clear use case and potentially bug prone). As a consequence offer owner in Forwarder strats (such as MangroveOrder) no longer have strat ready remapping of their address. Direct strats use a different scheme (reserve id).
- `checkList` is no longer calling router's checklist. This will is done in the ad hoc hooks in Direct and Forwarder.
- `withdrawFromMangrove` is made public to allow offer logic to withdraw funds if needed

### src/strategies/MangroveOrder.sol

- A public implementation of `_retractOffer` is now provided (see changes in IOfferLogic and Forwarder)
- Since the `__reserve__` hook was removed, references to `reserve(msg.sender)` have been replaced by `msg.sender`
- We adapted the call to `_newOffer` in order to ignore the returned `bytes32`.

### src/strategies/interfaces/IOfferLogic.sol

- `retractOffer` is no longer a public function required by the IOfferLogic interface. Internal `_retractOffer` is provided both for `Forwarder` and `Direct` strats and needs to be exposed (see `MangroveOrder` changes).

### src/strategies/offer_forwarder/Forwarder.sol

- `_newOffer`'s computation of new gasprice is factored out for clarity in `deriveAndCheckGasprice`. The computation is unchanged. Function now returns both the `offerId` assigned by Mangrove to the new offer and a byte32 which is non empty when Mangrove reverted with a reason, and `noRevert` argument was set to `true`.
- giving `max(uint).type` in the `gasreq` argument of both `_updateOffer` and `_newOffer` is no longer interpreted as requiring `offerGasreq()`.
- `retractOffer` is no longer a public function of Forwarder. An internal `_retractOffer` is provided for Forwarder starts (in accordance to the IOfferLogic interface change above).
- Offer owner can no longer be mapped to another address via the `__reserve__` hook that has disappeared (see `MangroveOffer` change). It has no impact on `MangroveOrder` which was not using this hook.

### src/strategies/routers/AbstractRouter.sol

- external storage contract is removed (see MangroveOffer).
- Cosmetic changes in naming. In particular auth error messages are made uniform. `reserve` has been replaced by `reserveId` to take into account the fact that routers interpret this field differently (SimpleRouter forwards liquidity to this address, AavePooledRouter just use the address to label shares of the pool). `reserveBalance` is now called `balanceOfReserve` and requires `reserveId` argument.
- Log emission when binding/unbinding to a maker contract.
- router's checklist has been simplified and can be called from an arbitrary address.

### src/strategies/routers/SimpleRouter.sol

- propagating naming scheme changes from AbstractRouter. We use `owner` instead of `reserveId` in simple router to reflect the fact that funds are transferred to offer owners.

### src/strategies/utils/TransferLib.sol

- `transferTokensFrom` and `transferTokens` where added as plural implementation of `transferToken` and `transferTokenFrom` of the same library (in order to allow multiple transfers in the same call).
- note that these function do not return success but revert on failure (to avoid returning an unwieldy array of booleans).
