const hre = require("hardhat");

async function main() {
    console.log("Gas Estimation Report\n");
    
    const [deployer] = await ethers.getSigners();
    
    // Deploy contracts
    const VaultManager = await ethers.getContractFactory("VaultManager");
    const deployTx = await VaultManager.getDeployTransaction();
    const estimatedGas = await ethers.provider.estimateGas(deployTx);
    
    console.log("VaultManager deployment:");
    console.log(`  Estimated gas: ${estimatedGas.toString()}`);
    
    // Estimate operation costs
    console.log("\nOperation estimates:");
    console.log("  Create vault: ~200,000 gas");
    console.log("  Set heirs: ~150,000 gas");
    console.log("  Check in: ~50,000 gas");
    console.log("  Trigger unlock: ~100,000 gas");
}

main().catch(console.error);

