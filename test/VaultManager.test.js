const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("VaultManager", function () {
    let vaultManager;
    let owner, user1, user2;
    
    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        await vaultManager.waitForDeployment();
    });
    
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await vaultManager.owner()).to.equal(owner.address);
        });
        
        it("Should initialize with zero vaults", async function () {
            expect(await vaultManager.getVaultCount()).to.equal(0);
        });
    });
    
    describe("Vault Creation", function () {
        it("Should create a vault successfully", async function () {
            const unlockTime = (await time.latest()) + 86400; // 1 day from now
            
            await expect(vaultManager.connect(user1).createVault(
                unlockTime,
                0,
                false,
                false
            )).to.emit(vaultManager, "VaultCreated");
            
            expect(await vaultManager.getVaultCount()).to.equal(1);
        });
        
        it("Should reject vault with invalid unlock time", async function () {
            const invalidTime = (await time.latest()) + 3600; // Less than MIN_UNLOCK_DELAY
            
            await expect(vaultManager.connect(user1).createVault(
                invalidTime,
                0,
                false,
                false
            )).to.be.reverted;
        });
        
        it("Should track vaults by owner", async function () {
            const unlockTime = (await time.latest()) + 86400;
            
            await vaultManager.connect(user1).createVault(unlockTime, 0, false, false);
            await vaultManager.connect(user1).createVault(unlockTime + 86400, 0, false, false);
            
            const userVaults = await vaultManager.getVaultsByOwner(user1.address);
            expect(userVaults.length).to.equal(2);
        });
    });
    
    describe("Vault Management", function () {
        let vaultId;
        
        beforeEach(async function () {
            const unlockTime = (await time.latest()) + 86400;
            const tx = await vaultManager.connect(user1).createVault(unlockTime, 0, false, false);
            const receipt = await tx.wait();
            vaultId = 1;
        });
        
        it("Should allow owner to close vault", async function () {
            await expect(vaultManager.connect(user1).closeVault(vaultId))
                .to.emit(vaultManager, "VaultClosed");
        });
        
        it("Should prevent non-owner from closing vault", async function () {
            await expect(vaultManager.connect(user2).closeVault(vaultId))
                .to.be.reverted;
        });
        
        it("Should retrieve vault configuration", async function () {
            const vault = await vaultManager.getVault(vaultId);
            expect(vault.owner).to.equal(user1.address);
        });
    });
});

