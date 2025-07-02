const hre = require("hardhat");

async function main() {
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const VaultManager = await hre.ethers.getContractAt("VaultManager", vaultManagerAddress);
    
    const count = process.argv[2] || 5;
    const baseTime = Math.floor(Date.now() / 1000);
    
    console.log(`Creating ${count} vaults...`);
    
    for (let i = 0; i < count; i++) {
        const unlockTime = baseTime + ((i + 1) * 365 * 24 * 3600);
        
        const tx = await VaultManager.createVault(unlockTime, 0, false, false);
        await tx.wait();
        
        console.log(`✓ Vault ${i + 1} created`);
    }
    
    console.log(`✅ All ${count} vaults created!`);
}

main().catch(console.error);

