const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UnlockExecutor", function () {
    let unlockExecutor, heirPolicy, vaultManager;
    let owner, heir1, heir2;
    
    beforeEach(async function () {
        [owner, heir1, heir2] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        
        const HeirPolicy = await ethers.getContractFactory("HeirPolicy");
        heirPolicy = await HeirPolicy.deploy(await vaultManager.getAddress());
        
        const UnlockExecutor = await ethers.getContractFactory("UnlockExecutor");
        unlockExecutor = await UnlockExecutor.deploy(
            await vaultManager.getAddress(),
            await heirPolicy.getAddress()
        );
    });
    
    describe("Asset Distribution", function () {
        it("Should execute unlock successfully", async function () {
            const vaultId = 1;
            const heirs = [heir1.address, heir2.address];
            const percentages = [6000, 4000];
            
            await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
            
            await expect(unlockExecutor.executeUnlock(vaultId))
                .to.emit(unlockExecutor, "ExecutionStarted");
        });
        
        it("Should check execution capability", async function () {
            const vaultId = 1;
            expect(await unlockExecutor.canExecute(vaultId)).to.be.false;
            
            const heirs = [heir1.address];
            const percentages = [10000];
            await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
            
            expect(await unlockExecutor.canExecute(vaultId)).to.be.true;
        });
    });
    
    describe("Execution Status", function () {
        it("Should track execution status", async function () {
            const vaultId = 1;
            const heirs = [heir1.address];
            const percentages = [10000];
            
            await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
            await unlockExecutor.executeUnlock(vaultId);
            
            const status = await unlockExecutor.getExecutionStatus(vaultId);
            expect(status.isExecuted).to.be.true;
        });
    });
});

