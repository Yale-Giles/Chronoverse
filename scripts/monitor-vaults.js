const hre = require("hardhat");

async function monitorVaults() {
    console.log("Vault Monitor");
    console.log("=============\n");
    
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const timelockVaultAddress = process.env.TIMELOCK_VAULT_ADDRESS;
    
    if (!vaultManagerAddress || !timelockVaultAddress) {
        console.error("Contract addresses not configured");
        process.exit(1);
    }
    
    const VaultManager = await hre.ethers.getContractAt("VaultManager", vaultManagerAddress);
    const TimelockVault = await hre.ethers.getContractAt("TimelockVault", timelockVaultAddress);
    
    const vaultCount = await VaultManager.getVaultCount();
    console.log(`Monitoring ${vaultCount} vaults...\n`);
    
    for (let i = 1; i <= vaultCount; i++) {
        try {
            const vault = await VaultManager.getVault(i);
            const isUnlockable = await TimelockVault.isUnlockable(i);
            
            console.log(`Vault ${i}:`);
            console.log(`  Status: ${vault.status}`);
            console.log(`  Unlockable: ${isUnlockable}`);
            
            if (isUnlockable && vault.status === 0) {
                console.log(`  ⚠️  Vault ready for unlock!`);
            }
            console.log();
        } catch (error) {
            console.error(`  Error checking vault ${i}`);
        }
    }
}

// Run monitoring
monitorVaults().catch(console.error);

// Set up periodic monitoring (optional)
if (process.argv.includes('--watch')) {
    setInterval(monitorVaults, 60000); // Every minute
}

