// Complete end-to-end example
const { ethers } = require("hardhat");

async function completeExample() {
    console.log("Complete Vault Creation Example");
    console.log("================================\n");
    
    const [owner] = await ethers.getSigners();
    
    // Step 1: Get contract instances
    const vaultManager = await ethers.getContractAt(
        "VaultManager",
        process.env.VAULT_MANAGER_ADDRESS
    );
    
    const heirPolicy = await ethers.getContractAt(
        "HeirPolicy",
        process.env.HEIR_POLICY_ADDRESS
    );
    
    const secretVault = await ethers.getContractAt(
        "SecretVault",
        process.env.SECRET_VAULT_ADDRESS
    );
    
    // Step 2: Create vault
    console.log("Step 1: Creating vault...");
    const oneYear = 365 * 24 * 60 * 60;
    const unlockTime = Math.floor(Date.now() / 1000) + oneYear;
    
    const createTx = await vaultManager.createVault(
        unlockTime,
        0,
        true,  // proof-of-life
        false  // no oracle
    );
    const receipt = await createTx.wait();
    const vaultId = 1; // Assuming first vault
    console.log(`✓ Vault ${vaultId} created\n`);
    
    // Step 3: Configure heirs
    console.log("Step 2: Configuring heirs...");
    const heirs = [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ];
    const percentages = [6000, 4000]; // 60%, 40%
    
    await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
    console.log("✓ Heirs configured\n");
    
    // Step 4: Store secret
    console.log("Step 3: Storing secret...");
    const cid = "QmExampleCID123";
    const hash = ethers.keccak256(ethers.toUtf8Bytes(cid));
    await secretVault.storeSecret(vaultId, cid, hash);
    console.log("✓ Secret stored\n");
    
    console.log("✅ Vault setup complete!");
    console.log(`   Vault ID: ${vaultId}`);
    console.log(`   Unlock: ${new Date(unlockTime * 1000).toLocaleDateString()}`);
}

completeExample().catch(console.error);

