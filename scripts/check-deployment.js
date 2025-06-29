const hre = require("hardhat");

async function main() {
    console.log("Deployment Verification");
    console.log("======================\n");
    
    const addresses = {
        VaultManager: process.env.VAULT_MANAGER_ADDRESS,
        TimelockVault: process.env.TIMELOCK_VAULT_ADDRESS,
        HeirPolicy: process.env.HEIR_POLICY_ADDRESS
    };
    
    for (const [name, address] of Object.entries(addresses)) {
        if (!address) {
            console.log(`❌ ${name}: Not deployed`);
            continue;
        }
        
        const code = await hre.ethers.provider.getCode(address);
        if (code === "0x") {
            console.log(`❌ ${name}: No code at ${address}`);
        } else {
            console.log(`✓ ${name}: Deployed at ${address}`);
        }
    }
}

main().catch(console.error);

