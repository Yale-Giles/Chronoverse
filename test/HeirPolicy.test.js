const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeirPolicy", function () {
    let heirPolicy, vaultManager;
    let owner, heir1, heir2, heir3;
    
    beforeEach(async function () {
        [owner, heir1, heir2, heir3] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        await vaultManager.waitForDeployment();
        
        const HeirPolicy = await ethers.getContractFactory("HeirPolicy");
        heirPolicy = await HeirPolicy.deploy(await vaultManager.getAddress());
        await heirPolicy.waitForDeployment();
    });
    
    describe("Policy Configuration", function () {
        it("Should set heir policy correctly", async function () {
            const vaultId = 1;
            const heirs = [heir1.address, heir2.address];
            const percentages = [6000, 4000]; // 60% and 40%
            
            await expect(heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0))
                .to.emit(heirPolicy, "HeirPolicySet");
            
            const configuredHeirs = await heirPolicy.getHeirs(vaultId);
            expect(configuredHeirs.length).to.equal(2);
        });
        
        it("Should reject invalid percentage sum", async function () {
            const vaultId = 1;
            const heirs = [heir1.address, heir2.address];
            const percentages = [6000, 3000]; // Total 90%, not 100%
            
            await expect(heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0))
                .to.be.reverted;
        });
        
        it("Should reject mismatched array lengths", async function () {
            const vaultId = 1;
            const heirs = [heir1.address, heir2.address];
            const percentages = [10000]; // Mismatch
            
            await expect(heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0))
                .to.be.reverted;
        });
    });
    
    describe("Distribution Validation", function () {
        it("Should validate correct distribution", async function () {
            const vaultId = 1;
            const heirs = [heir1.address, heir2.address, heir3.address];
            const percentages = [5000, 3000, 2000]; // 50%, 30%, 20%
            
            await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
            
            expect(await heirPolicy.validateDistribution(vaultId)).to.be.true;
        });
    });
});

