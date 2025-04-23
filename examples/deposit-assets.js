// Example: Deposit ETH into a vault
const { ethers } = require("hardhat");

async function main() {
    const unlockExecutorAddress = process.env.UNLOCK_EXECUTOR_ADDRESS;
    const UnlockExecutor = await ethers.getContractAt("UnlockExecutor", unlockExecutorAddress);
    
    const vaultId = process.argv[2] || 1;
    const amount = ethers.parseEther("1.0"); // 1 ETH
    
    console.log(`Depositing ${ethers.formatEther(amount)} ETH to vault ${vaultId}...`);
    
    const tx = await UnlockExecutor.depositAssets(
        vaultId,
        amount,
        ethers.ZeroAddress, // Zero address = ETH
        { value: amount }
    );
    
    await tx.wait();
    console.log("✅ Assets deposited successfully!");
}

main().catch(console.error);

