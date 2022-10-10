/**
 * @file Mangrove
 * @desc This file defines the exports of the `mangrove.js` package.
 * @hidden
 */

import { ethers } from "ethers";
import * as eth from "./eth";
import { decimals } from "./constants";

import Mangrove from "./mangrove";
import Market from "./market";
import Semibook from "./semibook";
import OfferLogic from "./offerLogic";
import MgvToken from "./mgvtoken";
import LiquidityProvider from "./liquidityProvider";
import AaveV3Module from "./aaveV3Module";
import * as mgvTestUtil from "./util/test/mgvIntegrationTestUtil";
import { typechain } from "./types";

// Turn off Ethers.js warnings
// ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

export default Mangrove;
export {
  eth,
  typechain,
  decimals,
  ethers,
  Mangrove,
  Market,
  Semibook,
  MgvToken,
  OfferLogic,
  LiquidityProvider,
  AaveV3Module,
  mgvTestUtil,
};
