const hre = require("hardhat");

async function main() {
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const VaultManager = await hre.ethers.getContractAt("VaultManager", vaultManagerAddress);
    
    const [signer] = await hre.ethers.getSigners();
    const vaults = await VaultManager.getVaultsByOwner(signer.address);
    
    console.log(`Found ${vaults.length} vaults:`);
    for (const vaultId of vaults) {
        const vault = await VaultManager.getVault(vaultId);
        console.log(`\nVault ${vaultId}:`);
        console.log(`  Status: ${vault.status}`);
        console.log(`  Unlock Time: ${new Date(Number(vault.unlockTime) * 1000)}`);
    }
}

main().catch(console.error);

