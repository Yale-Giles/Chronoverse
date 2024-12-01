const hre = require("hardhat");

async function main() {
    console.log("Network Configuration Check\n");
    console.log("============================\n");
    
    const network = hre.network.name;
    console.log(`Current Network: ${network}`);
    
    const [signer] = await hre.ethers.getSigners();
    console.log(`Signer Address: ${signer.address}`);
    
    const balance = await hre.ethers.provider.getBalance(signer.address);
    console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
    
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log(`Current Block: ${blockNumber}`);
    
    const gasPrice = await hre.ethers.provider.getFeeData();
    console.log(`Gas Price: ${hre.ethers.formatUnits(gasPrice.gasPrice || 0, "gwei")} gwei`);
    
    if (network === "hardhat" || network === "localhost") {
        console.log("\n⚠️  Using local network - for testing only");
    } else {
        console.log(`\n✓ Connected to ${network}`);
        
        if (balance < hre.ethers.parseEther("0.1")) {
            console.log("\n⚠️  WARNING: Low balance, please top up before deployment");
        }
    }
}

main().catch(console.error);

