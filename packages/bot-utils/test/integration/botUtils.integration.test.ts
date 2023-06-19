import { expect } from "chai";
import { describe, it } from "mocha";
import { TxUtils } from "../../src";

describe("Bot utils tests", () => {
  const PolygonChainId = 137;
  const MumbaiChainId = 80001;

  it("txUtils.GetFeeOverrides returns overriding fee for Polygon", async function () {
    const txUtils = new TxUtils();
    const fees = await txUtils.getFeeOverrides(PolygonChainId);

    return Promise.all([
      expect(fees).to.have.property("maxFeePerGas"),
      expect(fees).to.have.property("maxPriorityFeePerGas"),
    ]);
  });

  it("txUtils.GetFeeOverrides returns no overrriding fee for Mumbai", async function () {
    const txUtils = new TxUtils();
    const fees = await txUtils.getFeeOverrides(MumbaiChainId);

    return Promise.all([expect(fees).to.be.undefined]);
  });
});
