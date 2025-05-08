const { ethers } = require("hardhat");

async function deployVaultSystem() {
    const [owner, ...users] = await ethers.getSigners();
    
    const VaultManager = await ethers.getContractFactory("VaultManager");
    const vaultManager = await VaultManager.deploy();
    const vaultManagerAddr = await vaultManager.getAddress();
    
    const TimelockVault = await ethers.getContractFactory("TimelockVault");
    const timelockVault = await TimelockVault.deploy(vaultManagerAddr);
    
    const HeirPolicy = await ethers.getContractFactory("HeirPolicy");
    const heirPolicy = await HeirPolicy.deploy(vaultManagerAddr);
    
    const ProofOfLife = await ethers.getContractFactory("ProofOfLife");
    const proofOfLife = await ProofOfLife.deploy(vaultManagerAddr);
    
    const SecretVault = await ethers.getContractFactory("SecretVault");
    const secretVault = await SecretVault.deploy(vaultManagerAddr);
    
    const OracleBridge = await ethers.getContractFactory("OracleBridge");
    const oracleBridge = await OracleBridge.deploy(vaultManagerAddr);
    
    const UnlockExecutor = await ethers.getContractFactory("UnlockExecutor");
    const unlockExecutor = await UnlockExecutor.deploy(
        vaultManagerAddr,
        await heirPolicy.getAddress()
    );
    
    return {
        vaultManager,
        timelockVault,
        heirPolicy,
        proofOfLife,
        secretVault,
        oracleBridge,
        unlockExecutor,
        owner,
        users
    };
}

module.exports = { deployVaultSystem };

