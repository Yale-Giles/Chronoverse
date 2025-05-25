const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Multi-Vault Scenarios", function () {
    let vaultManager;
    let owner, user1, user2;
    
    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
    });
    
    it("Should handle multiple vaults from same owner", async function () {
        const baseTime = await time.latest();
        
        // Create 3 vaults
        await vaultManager.connect(user1).createVault(baseTime + 86400, 0, false, false);
        await vaultManager.connect(user1).createVault(baseTime + 172800, 0, false, false);
        await vaultManager.connect(user1).createVault(baseTime + 259200, 0, false, false);
        
        const userVaults = await vaultManager.getVaultsByOwner(user1.address);
        expect(userVaults.length).to.equal(3);
    });
    
    it("Should handle vaults from different owners", async function () {
        const unlockTime = (await time.latest()) + 86400;
        
        await vaultManager.connect(user1).createVault(unlockTime, 0, false, false);
        await vaultManager.connect(user2).createVault(unlockTime + 3600, 0, false, false);
        
        const user1Vaults = await vaultManager.getVaultsByOwner(user1.address);
        const user2Vaults = await vaultManager.getVaultsByOwner(user2.address);
        
        expect(user1Vaults.length).to.equal(1);
        expect(user2Vaults.length).to.equal(1);
    });
});

