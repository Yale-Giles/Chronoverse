// Example: Create a basic time-locked vault
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    
    // Get contract instance
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const VaultManager = await ethers.getContractAt("VaultManager", vaultManagerAddress);
    
    // Set unlock time to 1 year from now
    const oneYear = 365 * 24 * 60 * 60;
    const unlockTime = Math.floor(Date.now() / 1000) + oneYear;
    
    console.log("Creating vault...");
    console.log("Owner:", deployer.address);
    console.log("Unlock time:", new Date(unlockTime * 1000).toISOString());
    
    const tx = await VaultManager.createVault(
        unlockTime,
        0,           // No block-based unlock
        true,        // Enable proof-of-life
        false        // No oracle
    );
    
    const receipt = await tx.wait();
    console.log("✅ Vault created!");
    console.log("Transaction:", receipt.hash);
}

main().catch(console.error);

