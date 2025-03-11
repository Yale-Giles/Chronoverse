const hre = require("hardhat");

async function main() {
    console.log("Emergency Recovery Tool");
    console.log("======================\n");
    console.log("⚠️  Use only in emergency situations!\n");
    
    const vaultId = process.argv[2];
    
    if (!vaultId) {
        console.error("Usage: node emergency-recovery.js <vaultId>");
        process.exit(1);
    }
    
    const [signer] = await hre.ethers.getSigners();
    console.log("Signer:", signer.address);
    
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const VaultManager = await hre.ethers.getContractAt("VaultManager", vaultManagerAddress);
    
    // Get vault info
    try {
        const vault = await VaultManager.getVault(vaultId);
        console.log(`\nVault ${vaultId} Info:`);
        console.log(`  Owner: ${vault.owner}`);
        console.log(`  Status: ${vault.status}`);
        console.log(`  Unlock Time: ${new Date(Number(vault.unlockTime) * 1000).toLocaleString()}`);
        
        if (vault.owner !== signer.address) {
            console.log("\n❌ You are not the vault owner!");
            process.exit(1);
        }
        
        console.log("\n✓ Vault found");
        console.log("Recovery options will be displayed here in production");
        
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
}

main().catch(console.error);

