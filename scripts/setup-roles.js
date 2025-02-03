const hre = require("hardhat");

async function main() {
    console.log("Setting up contract roles...");
    
    const vaultManagerAddress = process.env.VAULT_MANAGER_ADDRESS;
    const timelockVaultAddress = process.env.TIMELOCK_VAULT_ADDRESS;
    const heirPolicyAddress = process.env.HEIR_POLICY_ADDRESS;
    const unlockExecutorAddress = process.env.UNLOCK_EXECUTOR_ADDRESS;
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("Using account:", deployer.address);
    
    // Grant roles to VaultManager
    console.log("\nGranting VAULT_MANAGER_ROLE...");
    
    const TimelockVault = await hre.ethers.getContractAt("TimelockVault", timelockVaultAddress);
    const VAULT_MANAGER_ROLE = await TimelockVault.VAULT_MANAGER_ROLE();
    
    await TimelockVault.grantRole(VAULT_MANAGER_ROLE, vaultManagerAddress);
    console.log("✅ Role granted to TimelockVault");
    
    const HeirPolicy = await hre.ethers.getContractAt("HeirPolicy", heirPolicyAddress);
    await HeirPolicy.grantRole(VAULT_MANAGER_ROLE, vaultManagerAddress);
    console.log("✅ Role granted to HeirPolicy");
    
    // Grant REVEALER_ROLE to UnlockExecutor
    const SecretVault = await hre.ethers.getContractAt(
        "SecretVault",
        process.env.SECRET_VAULT_ADDRESS
    );
    const REVEALER_ROLE = await SecretVault.REVEALER_ROLE();
    await SecretVault.grantRole(REVEALER_ROLE, unlockExecutorAddress);
    console.log("✅ REVEALER_ROLE granted to UnlockExecutor");
    
    console.log("\n✅ All roles configured successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

