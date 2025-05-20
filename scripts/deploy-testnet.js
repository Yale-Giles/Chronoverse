const hre = require("hardhat");

async function main() {
    console.log("Testnet Deployment Script");
    console.log("=========================\n");
    
    const network = hre.network.name;
    console.log(`Deploying to: ${network}`);
    
    if (network === "mainnet" || network === "arbitrum") {
        console.error("❌ This script is for testnet only!");
        console.error("   Use deploy.js for mainnet");
        process.exit(1);
    }
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deployer:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "ETH\n");
    
    if (balance < hre.ethers.parseEther("0.01")) {
        console.error("⚠️  Low balance! Get testnet ETH from faucet");
    }
    
    // Deploy contracts
    console.log("Deploying contracts...\n");
    
    const VaultManager = await hre.ethers.getContractFactory("VaultManager");
    const vaultManager = await VaultManager.deploy();
    await vaultManager.waitForDeployment();
    console.log("✓ VaultManager:", await vaultManager.getAddress());
    
    console.log("\n✅ Testnet deployment complete!");
    console.log("\nNext steps:");
    console.log("  1. Verify contracts on block explorer");
    console.log("  2. Update .env with addresses");
    console.log("  3. Run setup-roles.js");
    console.log("  4. Test vault creation");
}

main().catch(console.error);

