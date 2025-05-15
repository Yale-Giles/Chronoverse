const hre = require("hardhat");

async function main() {
    console.log("Contract Information");
    console.log("===================\n");
    
    const contracts = {
        "VaultManager": process.env.VAULT_MANAGER_ADDRESS,
        "TimelockVault": process.env.TIMELOCK_VAULT_ADDRESS,
        "HeirPolicy": process.env.HEIR_POLICY_ADDRESS,
        "ProofOfLife": process.env.PROOF_OF_LIFE_ADDRESS,
        "SecretVault": process.env.SECRET_VAULT_ADDRESS,
        "OracleBridge": process.env.ORACLE_BRIDGE_ADDRESS,
        "UnlockExecutor": process.env.UNLOCK_EXECUTOR_ADDRESS
    };
    
    console.log("Deployed Contracts:");
    console.log("-------------------");
    
    for (const [name, address] of Object.entries(contracts)) {
        if (address) {
            console.log(`${name}:`);
            console.log(`  Address: ${address}`);
            
            try {
                const code = await hre.ethers.provider.getCode(address);
                if (code === "0x") {
                    console.log(`  ⚠️  No code at address`);
                } else {
                    console.log(`  ✓ Contract deployed`);
                    console.log(`  Code size: ${(code.length - 2) / 2} bytes`);
                }
            } catch (error) {
                console.log(`  ❌ Error: ${error.message}`);
            }
            console.log();
        } else {
            console.log(`${name}: Not configured`);
        }
    }
}

main().catch(console.error);

