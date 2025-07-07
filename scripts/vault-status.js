const hre = require("hardhat");

async function main() {
    const vaultId = process.argv[2] || 1;
    
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const timelockVaultAddress = process.env.TIMELOCK_VAULT_ADDRESS;
    
    const VaultManager = await hre.ethers.getContractAt("VaultManager", vaultManagerAddress);
    const TimelockVault = await hre.ethers.getContractAt("TimelockVault", timelockVaultAddress);
    
    console.log(`\nVault ${vaultId} Status`);
    console.log("==================");
    
    const vault = await VaultManager.getVault(vaultId);
    console.log("Owner:", vault.owner);
    console.log("Status:", vault.status);
    console.log("Created:", new Date(Number(vault.createdAt) * 1000).toLocaleDateString());
    console.log("Unlock Time:", new Date(Number(vault.unlockTime) * 1000).toLocaleString());
    
    const isUnlockable = await TimelockVault.isUnlockable(vaultId);
    console.log("Unlockable:", isUnlockable);
    
    const remaining = await TimelockVault.getTimeRemaining(vaultId);
    const days = Number(remaining) / (24 * 60 * 60);
    console.log("Days until unlock:", days.toFixed(1));
}

main().catch(console.error);

