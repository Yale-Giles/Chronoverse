const hre = require("hardhat");

async function main() {
    console.log("Generating Gas Usage Report");
    console.log("===========================\n");
    
    const [deployer] = await hre.ethers.getSigners();
    
    // Deploy contracts and measure gas
    console.log("Deploying contracts...\n");
    
    const deployments = {};
    
    // VaultManager
    const VaultManager = await hre.ethers.getContractFactory("VaultManager");
    const vaultManager = await VaultManager.deploy();
    await vaultManager.waitForDeployment();
    const vaultManagerReceipt = await vaultManager.deploymentTransaction().wait();
    deployments.VaultManager = vaultManagerReceipt.gasUsed;
    
    // TimelockVault
    const TimelockVault = await hre.ethers.getContractFactory("TimelockVault");
    const timelockVault = await TimelockVault.deploy(await vaultManager.getAddress());
    await timelockVault.waitForDeployment();
    const timelockReceipt = await timelockVault.deploymentTransaction().wait();
    deployments.TimelockVault = timelockReceipt.gasUsed;
    
    // HeirPolicy
    const HeirPolicy = await hre.ethers.getContractFactory("HeirPolicy");
    const heirPolicy = await HeirPolicy.deploy(await vaultManager.getAddress());
    await heirPolicy.waitForDeployment();
    const heirReceipt = await heirPolicy.deploymentTransaction().wait();
    deployments.HeirPolicy = heirReceipt.gasUsed;
    
    // Print deployment gas costs
    console.log("Deployment Gas Costs:");
    console.log("--------------------");
    let totalGas = BigInt(0);
    for (const [contract, gas] of Object.entries(deployments)) {
        console.log(`${contract}: ${gas.toString()} gas`);
        totalGas += gas;
    }
    console.log(`\nTotal Deployment Gas: ${totalGas.toString()}`);
    
    // Test operation gas costs
    console.log("\n\nOperation Gas Costs:");
    console.log("-------------------");
    
    const unlockTime = Math.floor(Date.now() / 1000) + 86400;
    const createTx = await vaultManager.createVault(unlockTime, 0, false, false);
    const createReceipt = await createTx.wait();
    console.log(`Create Vault: ${createReceipt.gasUsed.toString()} gas`);
    
    const vaultId = 1;
    const heirs = [deployer.address];
    const percentages = [10000];
    const setHeirsTx = await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
    const heirsReceipt = await setHeirsTx.wait();
    console.log(`Set Heirs: ${heirsReceipt.gasUsed.toString()} gas`);
    
    console.log("\n✅ Gas report generation complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

