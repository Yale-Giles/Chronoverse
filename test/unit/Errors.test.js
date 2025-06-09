const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Error Handling Tests", function () {
    let vaultManager;
    let owner, user;
    
    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
    });
    
    it("Should revert with VaultNotFound for invalid vault", async function () {
        await expect(vaultManager.getVault(999)).to.be.reverted;
    });
    
    it("Should revert with InvalidUnlockTime for past time", async function () {
        const pastTime = Math.floor(Date.now() / 1000) - 3600;
        await expect(vaultManager.createVault(pastTime, 0, false, false)).to.be.reverted;
    });
    
    it("Should revert on unauthorized access", async function () {
        const unlockTime = Math.floor(Date.now() / 1000) + 86400;
        await vaultManager.connect(user).createVault(unlockTime, 0, false, false);
        
        await expect(vaultManager.connect(owner).closeVault(1)).to.be.reverted;
    });
});

