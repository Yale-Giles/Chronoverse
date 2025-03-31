// Example: Complex multi-heir configuration
const { ethers } = require("hardhat");

async function main() {
    console.log("Multi-Heir Setup Example");
    console.log("========================\n");
    
    // Configuration
    const vaultId = process.argv[2] || 1;
    
    // Define heirs with percentages
    const heirs = [
        { name: "Spouse", address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", percentage: 5000 },  // 50%
        { name: "Child 1", address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", percentage: 2000 }, // 20%
        { name: "Child 2", address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", percentage: 2000 }, // 20%
        { name: "Charity", address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", percentage: 1000 }  // 10%
    ];
    
    console.log("Heir Configuration:");
    console.log("-------------------");
    let totalPercentage = 0;
    heirs.forEach((heir, i) => {
        console.log(`${i + 1}. ${heir.name}: ${heir.percentage / 100}%`);
        console.log(`   Address: ${heir.address}`);
        totalPercentage += heir.percentage;
    });
    
    console.log(`\nTotal: ${totalPercentage / 100}%`);
    
    if (totalPercentage !== 10000) {
        console.error("\n❌ Percentages must total 100%!");
        process.exit(1);
    }
    
    console.log("\n✓ Configuration valid");
    console.log("\nTo apply this configuration:");
    console.log(`  const addresses = [${heirs.map(h => `"${h.address}"`).join(', ')}];`);
    console.log(`  const percentages = [${heirs.map(h => h.percentage).join(', ')}];`);
    console.log(`  await heirPolicy.setHeirPolicy(${vaultId}, addresses, percentages, 0);`);
}

main().catch(console.error);

