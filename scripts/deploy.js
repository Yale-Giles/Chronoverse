const hre = require("hardhat");

async function main() {
    console.log("Starting Chronoverse deployment...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Deploy VaultManager
    console.log("\nDeploying VaultManager...");
    const VaultManager = await hre.ethers.getContractFactory("VaultManager");
    const vaultManager = await VaultManager.deploy();
    await vaultManager.waitForDeployment();
    const vaultManagerAddress = await vaultManager.getAddress();
    console.log("VaultManager deployed to:", vaultManagerAddress);
    
    // Deploy TimelockVault
    console.log("\nDeploying TimelockVault...");
    const TimelockVault = await hre.ethers.getContractFactory("TimelockVault");
    const timelockVault = await TimelockVault.deploy(vaultManagerAddress);
    await timelockVault.waitForDeployment();
    console.log("TimelockVault deployed to:", await timelockVault.getAddress());
    
    // Deploy HeirPolicy
    console.log("\nDeploying HeirPolicy...");
    const HeirPolicy = await hre.ethers.getContractFactory("HeirPolicy");
    const heirPolicy = await HeirPolicy.deploy(vaultManagerAddress);
    await heirPolicy.waitForDeployment();
    const heirPolicyAddress = await heirPolicy.getAddress();
    console.log("HeirPolicy deployed to:", heirPolicyAddress);
    
    // Deploy ProofOfLife
    console.log("\nDeploying ProofOfLife...");
    const ProofOfLife = await hre.ethers.getContractFactory("ProofOfLife");
    const proofOfLife = await ProofOfLife.deploy(vaultManagerAddress);
    await proofOfLife.waitForDeployment();
    console.log("ProofOfLife deployed to:", await proofOfLife.getAddress());
    
    // Deploy SecretVault
    console.log("\nDeploying SecretVault...");
    const SecretVault = await hre.ethers.getContractFactory("SecretVault");
    const secretVault = await SecretVault.deploy(vaultManagerAddress);
    await secretVault.waitForDeployment();
    console.log("SecretVault deployed to:", await secretVault.getAddress());
    
    // Deploy OracleBridge
    console.log("\nDeploying OracleBridge...");
    const OracleBridge = await hre.ethers.getContractFactory("OracleBridge");
    const oracleBridge = await OracleBridge.deploy(vaultManagerAddress);
    await oracleBridge.waitForDeployment();
    console.log("OracleBridge deployed to:", await oracleBridge.getAddress());
    
    // Deploy UnlockExecutor
    console.log("\nDeploying UnlockExecutor...");
    const UnlockExecutor = await hre.ethers.getContractFactory("UnlockExecutor");
    const unlockExecutor = await UnlockExecutor.deploy(vaultManagerAddress, heirPolicyAddress);
    await unlockExecutor.waitForDeployment();
    console.log("UnlockExecutor deployed to:", await unlockExecutor.getAddress());
    
    console.log("\n✅ All contracts deployed successfully!");
    
    console.log("\nDeployment Summary:");
    console.log("==================");
    console.log("VaultManager:", vaultManagerAddress);
    console.log("TimelockVault:", await timelockVault.getAddress());
    console.log("HeirPolicy:", heirPolicyAddress);
    console.log("ProofOfLife:", await proofOfLife.getAddress());
    console.log("SecretVault:", await secretVault.getAddress());
    console.log("OracleBridge:", await oracleBridge.getAddress());
    console.log("UnlockExecutor:", await unlockExecutor.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

