import * as chai from "chai";
const { expect } = chai;
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import { describe, it } from "mocha";
import { PriceUtils } from "../../src";

describe("Unit test suite for bot utils", () => {
  it("priceUtils.getGasPrice throws on unknown network", async function () {
    const priceUtils = new PriceUtils();

    expect(
      priceUtils.getGasPrice("NO_API_KEY", "unknown-network")
    ).to.eventually.be.rejectedWith("Unknown-network");
  });
});
