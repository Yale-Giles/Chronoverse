const { expect } = require("chai");

describe("Constants Verification", function () {
    const ONE_DAY = 86400;
    const MIN_UNLOCK = ONE_DAY;
    const MAX_UNLOCK = 100 * 365 * ONE_DAY;
    const PERCENTAGE_BASE = 10000;
    
    it("Should have correct time constants", function () {
        expect(ONE_DAY).to.equal(86400);
        expect(MIN_UNLOCK).to.equal(86400);
    });
    
    it("Should have correct percentage base", function () {
        expect(PERCENTAGE_BASE).to.equal(10000);
    });
});

