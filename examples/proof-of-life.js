// Example: Check in to prove you're alive
const { ethers } = require("hardhat");

async function main() {
    const proofOfLifeAddress = process.env.PROOF_OF_LIFE_ADDRESS;
    const ProofOfLife = await ethers.getContractAt("ProofOfLife", proofOfLifeAddress);
    
    const vaultId = process.argv[2] || 1;
    
    console.log(`Checking in for vault ${vaultId}...`);
    
    const tx = await ProofOfLife.checkIn(vaultId);
    await tx.wait();
    
    console.log("✅ Check-in successful!");
    
    // Show status
    const isActive = await ProofOfLife.isActive(vaultId);
    const remaining = await ProofOfLife.getRemainingTime(vaultId);
    const days = Number(remaining) / (24 * 60 * 60);
    
    console.log(`Status: ${isActive ? "Active" : "Inactive"}`);
    console.log(`Days until inactivity: ${days.toFixed(1)}`);
}

main().catch(console.error);

