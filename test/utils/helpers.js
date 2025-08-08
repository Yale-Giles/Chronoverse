const { ethers } = require("hardhat");

async function deployAll() {
    const [owner] = await ethers.getSigners();
    
    const VaultManager = await ethers.getContractFactory("VaultManager");
    const vaultManager = await VaultManager.deploy();
    
    return { vaultManager, owner };
}

function randomAddress() {
    return ethers.Wallet.createRandom().address;
}

function randomPercentages(count) {
    const percentages = [];
    let remaining = 10000;
    
    for (let i = 0; i < count - 1; i++) {
        const value = Math.floor(remaining / (count - i));
        percentages.push(value);
        remaining -= value;
    }
    percentages.push(remaining);
    
    return percentages;
}

module.exports = {
    deployAll,
    randomAddress,
    randomPercentages
};

