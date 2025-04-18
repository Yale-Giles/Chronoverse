// Example: Configure heirs for a vault
const { ethers } = require("hardhat");

async function main() {
    const heirPolicyAddress = process.env.HEIR_POLICY_ADDRESS;
    const HeirPolicy = await ethers.getContractAt("HeirPolicy", heirPolicyAddress);
    
    const vaultId = process.argv[2] || 1;
    
    // Configure 3 heirs with different percentages
    const heirs = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // 50%
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // 30%
        "0x90F79bf6EB2c4f870365E785982E1f101E93b906"  // 20%
    ];
    
    const percentages = [5000, 3000, 2000]; // Basis points (100% = 10000)
    
    console.log(`Configuring heirs for vault ${vaultId}...`);
    
    const tx = await HeirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
    await tx.wait();
    
    console.log("✅ Heirs configured successfully!");
}

main().catch(console.error);

