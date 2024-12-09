const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecretVault", function () {
    let secretVault, vaultManager;
    let owner, user;
    
    beforeEach(async function () {
        [owner, user] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        
        const SecretVault = await ethers.getContractFactory("SecretVault");
        secretVault = await SecretVault.deploy(await vaultManager.getAddress());
    });
    
    describe("Secret Storage", function () {
        it("Should store secret successfully", async function () {
            const vaultId = 1;
            const cid = "QmTestCID123456789";
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
            
            await expect(secretVault.connect(user).storeSecret(vaultId, cid, contentHash))
                .to.emit(secretVault, "SecretStored");
        });
        
        it("Should retrieve stored secret", async function () {
            const vaultId = 1;
            const cid = "QmTestCID123456789";
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
            
            await secretVault.connect(user).storeSecret(vaultId, cid, contentHash);
            
            const revealed = await secretVault.revealSecret(vaultId);
            expect(revealed).to.equal(cid);
        });
    });
    
    describe("Secret Revocation", function () {
        it("Should allow owner to revoke secret", async function () {
            const vaultId = 1;
            const cid = "QmTestCID123456789";
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
            
            await secretVault.connect(user).storeSecret(vaultId, cid, contentHash);
            
            await expect(secretVault.connect(user).revokeSecret(vaultId))
                .to.emit(secretVault, "SecretRevoked");
        });
        
        it("Should prevent access to revoked secret", async function () {
            const vaultId = 1;
            const cid = "QmTestCID123456789";
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
            
            await secretVault.connect(user).storeSecret(vaultId, cid, contentHash);
            await secretVault.connect(user).revokeSecret(vaultId);
            
            await expect(secretVault.revealSecret(vaultId)).to.be.reverted;
        });
    });
    
    describe("Content Verification", function () {
        it("Should verify correct content hash", async function () {
            const vaultId = 1;
            const cid = "QmTestCID123456789";
            const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
            
            await secretVault.connect(user).storeSecret(vaultId, cid, contentHash);
            
            expect(await secretVault.verifySecret(vaultId, contentHash)).to.be.true;
        });
    });
});

