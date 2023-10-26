# Next version

- Upgraded to new major version of mangrove-core.
- `(gives, wants)` changed to `(gives, tick)` in maker perspective (MangroveOrder and Kandel)
- `(gives, wants)` changed to `(fillVolume, tick)` in taker perspective given by `TakerOrder`.
- Events changed to use `OLKey` and streamlined.
- `pivotId` removed completely.
- `gasprice` is now 26 bits in Mwei.
- MangroveOffer: `residualGives` and `residualWants` removed. Replaced with `residualValues` which by default keeps price (`tick`) and calculates remaining `gives` like before.
- TransferLib moved to core.
- SimpleRouter now inherits from a MonoRouter to specify that it only has a single-sourcing perspective.
- Mangrove Order strategy: The ability to reuse an old, owned offer id is added.
- Kandel strategy
  - Conceptual change: Do not calculate price of offers and create them on the fly in the posthook, instead allocate all offers up front, and set their price.
  - Cross-cutting: Refactoring to reduce bytecode size, deduplicating some functions.
  - Reduced complexity significantly by removing compounding parameter and initializing all Kandel offers up front with their price (tick) stored in the core protocol
  - Forwards calls to generate the offer distribution to populate a geometric Kandel instance to the new KandelLib which has a `createGeometricDistribution`. This on-chain generation function in KandelLib is introduced to reduce call data size for L2s. A library is used to reduce contract size.
  - Introduced a `baseQuoteTickOffset` to replace the old `ratio` parameter. Since prices in the core protocol follow a geometric progression, we offset via adding a tick offset, instead of multiplying by a ratio. All other parameters moved to CoreKandel.
  - Reduced complexity, and using offsets for price differences means we can support much larger price differences.
  - Spread renamed to step size.
  - Distribution struct changed to containing structs instead of arrays to reduce bytecode size and save gas.
  - `populate` and `populateIndex` changed to be able to "reserve" offers on the offer list by creating and retracting offers up front if `gives` in the offer distribution is 0 for said offer. This is to avoid having to create offers during `posthook` since it is expensive and complicates logic. Note, since the core protocol does not accept 0 gives, we have to use a minimum gives based on the density requirements of the core protocol.

# 0.0.2-0

- Mangrove-strat initial version. Read earlier changes in the mangrove-core changelog.
