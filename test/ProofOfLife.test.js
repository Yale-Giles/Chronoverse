const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ProofOfLife", function () {
    let proofOfLife, vaultManager;
    let owner, user;
    const INACTIVITY_PERIOD = 90 * 24 * 3600; // 90 days
    
    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        
        const ProofOfLife = await ethers.getContractFactory("ProofOfLife");
        proofOfLife = await ProofOfLife.deploy(await vaultManager.getAddress());
    });
    
    describe("Check-in System", function () {
        let vaultId;
        
        beforeEach(async function () {
            vaultId = 1;
            await proofOfLife.initialize(vaultId, user.address, INACTIVITY_PERIOD);
        });
        
        it("Should allow owner to check in", async function () {
            await expect(proofOfLife.connect(user).checkIn(vaultId))
                .to.emit(proofOfLife, "CheckedIn");
        });
        
        it("Should update last check-in time", async function () {
            const before = await proofOfLife.getLastCheckIn(vaultId);
            await time.increase(3600);
            await proofOfLife.connect(user).checkIn(vaultId);
            const after = await proofOfLife.getLastCheckIn(vaultId);
            expect(after).to.be.gt(before);
        });
        
        it("Should prevent non-owner from checking in", async function () {
            await expect(proofOfLife.connect(owner).checkIn(vaultId))
                .to.be.reverted;
        });
    });
    
    describe("Inactivity Detection", function () {
        let vaultId;
        
        beforeEach(async function () {
            vaultId = 1;
            await proofOfLife.initialize(vaultId, user.address, INACTIVITY_PERIOD);
        });
        
        it("Should be active initially", async function () {
            expect(await proofOfLife.isActive(vaultId)).to.be.true;
        });
        
        it("Should mark inactive after period", async function () {
            await time.increase(INACTIVITY_PERIOD + 8 * 24 * 3600); // Beyond grace period
            
            await expect(proofOfLife.markInactive(user.address, vaultId))
                .to.emit(proofOfLife, "MarkedInactive");
                
            expect(await proofOfLife.isActive(vaultId)).to.be.false;
        });
        
        it("Should not mark inactive prematurely", async function () {
            await time.increase(3600);
            
            await expect(proofOfLife.markInactive(user.address, vaultId))
                .to.be.reverted;
        });
    });
});

