const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Edge Cases and Boundary Testing", function () {
    let vaultManager, heirPolicy;
    let owner, user1;
    
    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        
        const HeirPolicy = await ethers.getContractFactory("HeirPolicy");
        heirPolicy = await HeirPolicy.deploy(await vaultManager.getAddress());
    });
    
    describe("Boundary Values", function () {
        it("Should handle minimum unlock delay", async function () {
            const minDelay = await vaultManager.MIN_UNLOCK_DELAY();
            const unlockTime = (await time.latest()) + Number(minDelay);
            
            await expect(vaultManager.createVault(unlockTime, 0, false, false))
                .to.emit(vaultManager, "VaultCreated");
        });
        
        it("Should reject zero unlock time with active vault", async function () {
            await expect(vaultManager.createVault(0, 0, false, false))
                .to.be.reverted;
        });
        
        it("Should handle maximum number of heirs", async function () {
            const vaultId = 1;
            const unlockTime = (await time.latest()) + 86400;
            await vaultManager.createVault(unlockTime, 0, false, false);
            
            const maxHeirs = 10;
            const heirs = [];
            const percentages = [];
            const percentage = Math.floor(10000 / maxHeirs);
            
            for (let i = 0; i < maxHeirs; i++) {
                heirs.push(ethers.Wallet.createRandom().address);
                percentages.push(i === maxHeirs - 1 ? 10000 - (percentage * (maxHeirs - 1)) : percentage);
            }
            
            await expect(heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0))
                .to.emit(heirPolicy, "HeirPolicySet");
        });
    });
    
    describe("Empty and Null Values", function () {
        it("Should reject empty heir array", async function () {
            const vaultId = 1;
            await expect(heirPolicy.setHeirPolicy(vaultId, [], [], 0))
                .to.be.reverted;
        });
        
        it("Should handle vault query for non-existent vault", async function () {
            await expect(vaultManager.getVault(999))
                .to.be.reverted;
        });
    });
    
    describe("Overflow Protection", function () {
        it("Should prevent percentage overflow", async function () {
            const vaultId = 1;
            const unlockTime = (await time.latest()) + 86400;
            await vaultManager.createVault(unlockTime, 0, false, false);
            
            const heirs = [user1.address];
            const percentages = [20000]; // 200%, should fail
            
            await expect(heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0))
                .to.be.reverted;
        });
    });
});

