// Load the RPC_URL and PRIVATE_KEY from .env file into process.env
// This script assumes RPC_URL points to your access point and PRIVATE_KEY contains private key from which one wishes to post offers
require("dotenv").config();
// Import the Mangrove API
const { Mangrove, ethers } = require("@mangrovedao/mangrove.js");

// Create a wallet with a provider to interact with the chain.
const provider = new ethers.providers.WebSocketProvider(process.env.LOCAL_URL); // For local chain use
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Use either own account or if on local chain use an anvil account

// Connect the API to Mangrove
const mgv = await Mangrove.connect({ signer: wallet });

// Connect mgv to a DAI, USDC market
const market = await mgv.market({ base: "DAI", quote: "USDC" });

// Check it's live, should display the best bids and asks of the DAI, USDC market
market.consoleAsks();
market.consoleBids();

// Create a simple liquidity provider on `market`, using `wallet` as a source of liquidity
const directLP = await mgv.liquidityProvider(market);

// Liquidity provider needs to approve Mangrove for transfer of base token (DAI) which
// will be transferred from the wallet to Mangrove and then to the taker when the offer is taken.
const tx = await directLP.approveAsks();
await tx.wait();

// Query mangrove to know the bounty for posting a new Ask on `market`
const provision = await directLP.computeAskProvision();

// Post a new ask (requesting 100.5 USDC for 100.4 DAI) at a price of 100.5/100.4~=1.00099
// Consider looking at the consoleAsks above and increase gives such that the offer becomes visible in this list
const { id: offerId } = await directLP.newAsk({
  wants: 100.5,
  gives: 100.4,
  fund: provision,
});

// Check the order was posted (or look at https://testnet.mangrove.exchange)
console.log(offerId);
market.consoleAsks();
