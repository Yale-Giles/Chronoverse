const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Optimization Tests", function () {
    let vaultManager, timelockVault;
    let owner, user;
    
    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        
        const TimelockVault = await ethers.getContractFactory("TimelockVault");
        timelockVault = await TimelockVault.deploy(await vaultManager.getAddress());
    });
    
    it("Should measure gas for vault creation", async function () {
        const unlockTime = Math.floor(Date.now() / 1000) + 86400;
        const tx = await vaultManager.createVault(unlockTime, 0, false, false);
        const receipt = await tx.wait();
        
        console.log(`Gas used for vault creation: ${receipt.gasUsed.toString()}`);
        expect(receipt.gasUsed).to.be.lt(250000);
    });
    
    it("Should measure gas for batch operations", async function () {
        const unlockTime = Math.floor(Date.now() / 1000) + 86400;
        
        for (let i = 0; i < 3; i++) {
            const tx = await vaultManager.createVault(unlockTime + i * 3600, 0, false, false);
            const receipt = await tx.wait();
            console.log(`Vault ${i + 1} gas: ${receipt.gasUsed.toString()}`);
        }
    });
});

