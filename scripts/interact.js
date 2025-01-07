const hre = require("hardhat");

async function main() {
    console.log("Chronoverse Interaction Script");
    console.log("==============================\n");
    
    const [signer] = await hre.ethers.getSigners();
    console.log("Using account:", signer.address);
    
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    
    if (!vaultManagerAddress) {
        throw new Error("VAULT_MANAGER_ADDRESS not set in environment");
    }
    
    const VaultManager = await hre.ethers.getContractFactory("VaultManager");
    const vaultManager = VaultManager.attach(vaultManagerAddress);
    
    // Example: Create a vault
    console.log("\nCreating a test vault...");
    const unlockTime = Math.floor(Date.now() / 1000) + (365 * 24 * 3600); // 1 year from now
    
    const tx = await vaultManager.createVault(
        unlockTime,
        0,
        true,  // useProofOfLife
        false  // useOracle
    );
    
    console.log("Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Vault created successfully!");
    
    // Get vault count
    const vaultCount = await vaultManager.getVaultCount();
    console.log("Total vaults:", vaultCount.toString());
    
    // Get user vaults
    const userVaults = await vaultManager.getVaultsByOwner(signer.address);
    console.log("Your vaults:", userVaults.map(v => v.toString()));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

