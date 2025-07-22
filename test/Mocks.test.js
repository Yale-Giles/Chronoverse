const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mock Contracts", function () {
    it("Should deploy MockERC20", async function () {
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const token = await MockERC20.deploy();
        expect(await token.name()).to.equal("Mock Token");
    });
});
