const hre = require("hardhat");

async function main() {
    const contracts = {
        VaultManager: process.env.VAULT_MANAGER_ADDRESS,
        TimelockVault: process.env.TIMELOCK_VAULT_ADDRESS,
        HeirPolicy: process.env.HEIR_POLICY_ADDRESS,
        ProofOfLife: process.env.PROOF_OF_LIFE_ADDRESS,
        SecretVault: process.env.SECRET_VAULT_ADDRESS,
        OracleBridge: process.env.ORACLE_BRIDGE_ADDRESS,
        UnlockExecutor: process.env.UNLOCK_EXECUTOR_ADDRESS
    };
    
    console.log("Verifying contracts on Etherscan...");
    
    for (const [name, address] of Object.entries(contracts)) {
        if (!address) {
            console.log(`Skipping ${name} (address not set)`);
            continue;
        }
        
        try {
            console.log(`\nVerifying ${name} at ${address}...`);
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: []
            });
            console.log(`✅ ${name} verified successfully`);
        } catch (error) {
            if (error.message.includes("Already Verified")) {
                console.log(`✓ ${name} already verified`);
            } else {
                console.error(`❌ Error verifying ${name}:`, error.message);
            }
        }
    }
    
    console.log("\n✅ Verification complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

