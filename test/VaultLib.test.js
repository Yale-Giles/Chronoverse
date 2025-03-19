const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VaultLib", function () {
    let testContract;
    
    before(async function () {
        const TestVaultLib = await ethers.getContractFactory("TestVaultLib");
        testContract = await TestVaultLib.deploy();
    });
    
    it("Should calculate percentage correctly", async function () {
        const amount = 10000;
        const percentage = 2500; // 25%
        const result = await testContract.testCalculateDistribution(amount, percentage);
        expect(result).to.equal(2500);
    });
    
    it("Should validate addresses", async function () {
        await expect(testContract.testValidateAddress(ethers.ZeroAddress))
            .to.be.reverted;
    });
});

