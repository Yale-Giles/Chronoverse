const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Complete Flow Scenarios", function () {
    let contracts;
    let owner, heir1, heir2;
    
    beforeEach(async function () {
        [owner, heir1, heir2] = await ethers.getSigners();
        
        // Deploy all contracts
        const VaultManager = await ethers.getContractFactory("VaultManager");
        const vaultManager = await VaultManager.deploy();
        const vmAddr = await vaultManager.getAddress();
        
        const HeirPolicy = await ethers.getContractFactory("HeirPolicy");
        const heirPolicy = await HeirPolicy.deploy(vmAddr);
        
        const TimelockVault = await ethers.getContractFactory("TimelockVault");
        const timelockVault = await TimelockVault.deploy(vmAddr);
        
        const UnlockExecutor = await ethers.getContractFactory("UnlockExecutor");
        const unlockExecutor = await UnlockExecutor.deploy(
            vmAddr,
            await heirPolicy.getAddress()
        );
        
        contracts = {
            vaultManager,
            heirPolicy,
            timelockVault,
            unlockExecutor
        };
    });
    
    it("Should complete simple inheritance scenario", async function () {
        // 1. Create vault
        const unlockTime = (await time.latest()) + 86400;
        await contracts.vaultManager.createVault(unlockTime, 0, false, false);
        const vaultId = 1;
        
        // 2. Configure heirs
        await contracts.heirPolicy.setHeirPolicy(
            vaultId,
            [heir1.address, heir2.address],
            [7000, 3000],
            0
        );
        
        // 3. Schedule unlock
        await contracts.timelockVault.scheduleUnlock(vaultId, unlockTime, 0);
        
        // 4. Wait for unlock time
        await time.increaseTo(unlockTime + 1);
        
        // 5. Verify unlockable
        expect(await contracts.timelockVault.isUnlockable(vaultId)).to.be.true;
        
        // 6. Trigger unlock
        await contracts.timelockVault.triggerUnlock(vaultId);
        
        // 7. Execute distribution
        await contracts.unlockExecutor.executeUnlock(vaultId);
        
        // 8. Verify completion
        const status = await contracts.unlockExecutor.getExecutionStatus(vaultId);
        expect(status.isExecuted).to.be.true;
    });
});

