const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Integration Tests", function () {
    let vaultManager, timelockVault, heirPolicy, proofOfLife;
    let secretVault, oracleBridge, unlockExecutor;
    let owner, heir1, heir2, heir3;
    
    beforeEach(async function () {
        [owner, heir1, heir2, heir3] = await ethers.getSigners();
        
        // Deploy all contracts
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        const vaultManagerAddr = await vaultManager.getAddress();
        
        const TimelockVault = await ethers.getContractFactory("TimelockVault");
        timelockVault = await TimelockVault.deploy(vaultManagerAddr);
        
        const HeirPolicy = await ethers.getContractFactory("HeirPolicy");
        heirPolicy = await HeirPolicy.deploy(vaultManagerAddr);
        
        const ProofOfLife = await ethers.getContractFactory("ProofOfLife");
        proofOfLife = await ProofOfLife.deploy(vaultManagerAddr);
        
        const SecretVault = await ethers.getContractFactory("SecretVault");
        secretVault = await SecretVault.deploy(vaultManagerAddr);
        
        const OracleBridge = await ethers.getContractFactory("OracleBridge");
        oracleBridge = await OracleBridge.deploy(vaultManagerAddr);
        
        const UnlockExecutor = await ethers.getContractFactory("UnlockExecutor");
        unlockExecutor = await UnlockExecutor.deploy(
            vaultManagerAddr,
            await heirPolicy.getAddress()
        );
    });
    
    describe("Complete Vault Lifecycle", function () {
        it("Should complete full vault creation and unlock flow", async function () {
            // Create vault
            const unlockTime = (await time.latest()) + 86400;
            const tx = await vaultManager.createVault(unlockTime, 0, false, false);
            const vaultId = 1;
            
            // Configure heirs
            const heirs = [heir1.address, heir2.address];
            const percentages = [6000, 4000];
            await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
            
            // Store secret
            const cid = "QmTestCID123";
            const hash = ethers.keccak256(ethers.toUtf8Bytes(cid));
            await secretVault.storeSecret(vaultId, cid, hash);
            
            // Schedule unlock
            await timelockVault.scheduleUnlock(vaultId, unlockTime, 0);
            
            // Fast forward time
            await time.increaseTo(unlockTime + 1);
            
            // Trigger unlock
            await timelockVault.triggerUnlock(vaultId);
            
            // Execute distribution
            await unlockExecutor.executeUnlock(vaultId);
            
            expect(await timelockVault.isUnlockable(vaultId)).to.be.true;
        });
    });
    
    describe("Proof-of-Life Integration", function () {
        it("Should handle proof-of-life workflow", async function () {
            const unlockTime = (await time.latest()) + 86400;
            const vaultId = 1;
            
            await vaultManager.createVault(unlockTime, 0, true, false);
            await proofOfLife.initialize(vaultId, owner.address, 90 * 24 * 3600);
            
            // Check in
            await proofOfLife.checkIn(vaultId);
            expect(await proofOfLife.isActive(vaultId)).to.be.true;
            
            // Fast forward past inactivity period
            await time.increase(91 * 24 * 3600 + 8 * 24 * 3600);
            
            // Mark inactive
            await proofOfLife.markInactive(owner.address, vaultId);
            expect(await proofOfLife.isActive(vaultId)).to.be.false;
        });
    });
});

