const deployments = require("@mangrovedao/mangrove-deployments");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const script = path.basename(__filename);

if (!config.copyDeployments) {
  console.group(
    "Skipping copying deployments from the mangrove-deployments package."
  );
  console.log("Set copyDeployments = true in config.js to enable copying.");
  console.log("Using addresses/deployed/*.json files as-is instead.");
  console.groupEnd();
  process.exit(0);
}

console.group(`${script}:`);

// This is a hack to get the network names because the addresses
// file names use non-canonical network names from ethers.js
const networkNames = deployments.mangroveNetworkNames;

// Query deployments based on the configuration in config.js
console.log(
  `Querying mangrove-deployments for core deployments of version ${
    config.coreDeploymentVersionRangePattern
  }, ${
    config.coreDeploymentVersionReleasedFilter === undefined
      ? "released or unreleased"
      : config.coreDeploymentVersionReleasedFilter
      ? "release"
      : "unreleased"
  }...`
);
const coreDeploymentsFilter = {
  version: config.coreDeploymentVersionRangePattern,
  released: config.coreDeploymentVersionReleasedFilter,
};
const latestCoreDeployments = deployments.getLatestCoreContractsPerNetwork(
  coreDeploymentsFilter
);
console.group(`...found the following deployments of Mangrove:`);
for (const [networkName, namedAddresses] of Object.entries(
  latestCoreDeployments
)) {
  console.log(
    `${networkName}: ${namedAddresses.mangrove.version} at ${namedAddresses.mangrove.address}`
  );
}
console.groupEnd();
console.log();

console.log(
  `Querying mangrove-deployments for matching strat deployments of version ${
    config.stratsDeploymentVersionRangePattern
  }, ${
    config.stratsDeploymentVersionReleasedFilter === undefined
      ? "released or unreleased"
      : config.stratsDeploymentVersionReleasedFilter
      ? "release"
      : "unreleased"
  }...`
);
const stratsDeploymentsFilter = {
  version: config.stratsDeploymentVersionRangePattern,
  released: config.stratsDeploymentVersionReleasedFilter,
};
const latestStratsDeployments = deployments.getLatestStratContractsPerNetwork(
  stratsDeploymentsFilter,
  coreDeploymentsFilter
);
console.group(`...found the following deployments of strats:`);
for (const [networkName, namedAddresses] of Object.entries(
  latestStratsDeployments
)) {
  console.group(
    `${networkName}, Mangrove v${namedAddresses.mangrove.version} at ${namedAddresses.mangrove.address}:`
  );
  for (const [stratName, stratNetworkDeployment] of Object.entries(
    namedAddresses
  )) {
    if (stratName == "mangrove") {
      continue;
    }
    if (stratNetworkDeployment === undefined) {
      console.log(`${stratName}: not deployed`);
      continue;
    }
    const name =
      stratNetworkDeployment.deploymentName ??
      stratNetworkDeployment.contractName;
    console.log(
      `${name}: v${stratNetworkDeployment.version} at ${stratNetworkDeployment.address}`
    );
  }
  console.groupEnd();
}
console.groupEnd();
console.log();

console.log(`Copying deployment addresses...`);

// NB: Test token deployments are included in the context-addresses package,
// so they are not queried from mangrove-deployments.
// Create the addresses files with the loaded deployment addresses
for (const [networkName, namedAddresses] of Object.entries(
  deployments.toNamedAddressesPerNamedNetwork(
    latestCoreDeployments,
    latestStratsDeployments
  )
)) {
  const networkAddressesDir = path.join(
    config.importedAddressesDir,
    "deployed"
  );
  if (!fs.existsSync(networkAddressesDir)) {
    fs.mkdirSync(networkAddressesDir, { recursive: true });
  }

  const networkAddressesFilePath = path.join(
    networkAddressesDir,
    `${networkName}.json`
  );
  fs.writeFileSync(
    networkAddressesFilePath,
    JSON.stringify(namedAddresses, null, 2)
  );
}

console.log(`...done copying deployment addresses`);
console.groupEnd();
