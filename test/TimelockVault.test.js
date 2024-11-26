const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("TimelockVault", function () {
    let timelockVault, vaultManager;
    let owner, manager, user;
    
    beforeEach(async function () {
        [owner, manager, user] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        await vaultManager.waitForDeployment();
        
        const TimelockVault = await ethers.getContractFactory("TimelockVault");
        timelockVault = await TimelockVault.deploy(await vaultManager.getAddress());
        await timelockVault.waitForDeployment();
    });
    
    describe("Unlock Scheduling", function () {
        it("Should schedule unlock with time constraint", async function () {
            const unlockTime = (await time.latest()) + 86400;
            const vaultId = 1;
            
            await expect(timelockVault.scheduleUnlock(vaultId, unlockTime, 0))
                .to.emit(timelockVault, "UnlockScheduled");
        });
        
        it("Should reject invalid configuration", async function () {
            await expect(timelockVault.scheduleUnlock(1, 0, 0))
                .to.be.reverted;
        });
    });
    
    describe("Unlock Triggering", function () {
        let vaultId, unlockTime;
        
        beforeEach(async function () {
            vaultId = 1;
            unlockTime = (await time.latest()) + 3600;
            await timelockVault.scheduleUnlock(vaultId, unlockTime, 0);
        });
        
        it("Should not allow unlock before time", async function () {
            await expect(timelockVault.triggerUnlock(vaultId))
                .to.be.reverted;
        });
        
        it("Should allow unlock after time", async function () {
            await time.increaseTo(unlockTime + 1);
            
            await expect(timelockVault.triggerUnlock(vaultId))
                .to.emit(timelockVault, "UnlockTriggered");
        });
        
        it("Should check unlockable status correctly", async function () {
            expect(await timelockVault.isUnlockable(vaultId)).to.be.false;
            
            await time.increaseTo(unlockTime + 1);
            expect(await timelockVault.isUnlockable(vaultId)).to.be.true;
        });
    });
});

