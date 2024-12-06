// Example: Advanced heir management
const { ethers } = require("hardhat");

async function main() {
    const heirPolicyAddress = process.env.HEIR_POLICY_ADDRESS;
    const HeirPolicy = await ethers.getContractAt("HeirPolicy", heirPolicyAddress);
    
    const vaultId = process.argv[2] || 1;
    
    console.log("Managing heirs for vault", vaultId);
    console.log("=====================================\n");
    
    // Get current heirs
    const heirs = await HeirPolicy.getHeirs(vaultId);
    console.log(`Current heir count: ${heirs.length}`);
    
    if (heirs.length > 0) {
        console.log("\nCurrent heirs:");
        for (let i = 0; i < heirs.length; i++) {
            const heir = heirs[i];
            console.log(`  ${i + 1}. ${heir.heirAddress}`);
            console.log(`     Percentage: ${heir.percentage / 100}%`);
            console.log(`     Claimed: ${heir.claimed}`);
        }
    } else {
        console.log("\nNo heirs configured yet.");
    }
    
    // Check distribution validity
    const isValid = await HeirPolicy.validateDistribution(vaultId);
    console.log(`\nDistribution valid: ${isValid}`);
    
    // Example: Add a new heir
    console.log("\n--- Adding New Heir Example ---");
    console.log("const newHeir = '0x...'");
    console.log("const percentage = 2000; // 20%");
    console.log("await HeirPolicy.addHeir(vaultId, newHeir, percentage);");
}

main().catch(console.error);

