const hre = require("hardhat");

async function main() {
    console.log("Event Listener for Chronoverse");
    console.log("==============================\n");
    
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const VaultManager = await hre.ethers.getContractAt("VaultManager", vaultManagerAddress);
    
    console.log("Listening for events...\n");
    
    // Listen for vault creation
    VaultManager.on("VaultCreated", (vaultId, owner, unlockTime, event) => {
        console.log(`\n🆕 Vault Created!`);
        console.log(`  Vault ID: ${vaultId}`);
        console.log(`  Owner: ${owner}`);
        console.log(`  Unlock: ${new Date(Number(unlockTime) * 1000).toLocaleString()}`);
        console.log(`  Block: ${event.blockNumber}`);
        console.log(`  Tx: ${event.transactionHash}`);
    });
    
    // Listen for vault closed
    VaultManager.on("VaultClosed", (vaultId, owner, event) => {
        console.log(`\n🔒 Vault Closed!`);
        console.log(`  Vault ID: ${vaultId}`);
        console.log(`  Owner: ${owner}`);
        console.log(`  Block: ${event.blockNumber}`);
    });
    
    // Listen for unlocks
    VaultManager.on("VaultUnlocked", (vaultId, timestamp, event) => {
        console.log(`\n🔓 Vault Unlocked!`);
        console.log(`  Vault ID: ${vaultId}`);
        console.log(`  Time: ${new Date(Number(timestamp) * 1000).toLocaleString()}`);
        console.log(`  Block: ${event.blockNumber}`);
    });
    
    console.log("✓ Event listeners active");
    console.log("  Press Ctrl+C to stop\n");
    
    // Keep process alive
    await new Promise(() => {});
}

main().catch(console.error);

