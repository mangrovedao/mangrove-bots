// Contracts that should export their ABI only
exports.abi_exports = [
  "MangroveOrder",
  "AbstractRouter",
  "ICreditDelegationToken",
  "ILiquidityProvider",
  "IOfferLogic",
  "AccessControlled",
  "GeometricKandel",
  "Kandel",
  "AaveKandel",
  "AbstractKandelSeeder",
  "KandelSeeder",
  "AaveKandelSeeder",
];

// Contracts that should export their ABI + bytecode
exports.full_exports = ["OfferMaker"];
