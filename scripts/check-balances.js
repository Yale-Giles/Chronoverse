const hre = require("hardhat");

async function main() {
    const [signer] = await hre.ethers.getSigners();
    console.log("Checking balances for:", signer.address);
    
    const balance = await hre.ethers.provider.getBalance(signer.address);
    console.log("ETH Balance:", hre.ethers.formatEther(balance));
}

main().catch(console.error);

