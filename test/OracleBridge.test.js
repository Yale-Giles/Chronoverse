const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OracleBridge", function () {
    let oracleBridge, vaultManager;
    let owner, oracle, user;
    
    beforeEach(async function () {
        [owner, oracle, user] = await ethers.getSigners();
        
        const VaultManager = await ethers.getContractFactory("VaultManager");
        vaultManager = await VaultManager.deploy();
        
        const OracleBridge = await ethers.getContractFactory("OracleBridge");
        oracleBridge = await OracleBridge.deploy(await vaultManager.getAddress());
    });
    
    describe("Oracle Configuration", function () {
        it("Should set oracle condition", async function () {
            const vaultId = 1;
            const conditionId = ethers.keccak256(ethers.toUtf8Bytes("death_certificate"));
            const conditionData = ethers.toUtf8Bytes("verify_death");
            
            await expect(oracleBridge.setOracleCondition(vaultId, oracle.address, conditionId, conditionData))
                .to.emit(oracleBridge, "OracleConditionSet");
        });
        
        it("Should reject zero address oracle", async function () {
            const vaultId = 1;
            const conditionId = ethers.keccak256(ethers.toUtf8Bytes("test"));
            
            await expect(oracleBridge.setOracleCondition(vaultId, ethers.ZeroAddress, conditionId, "0x"))
                .to.be.reverted;
        });
    });
    
    describe("Condition Fulfillment", function () {
        let vaultId, conditionId;
        
        beforeEach(async function () {
            vaultId = 1;
            conditionId = ethers.keccak256(ethers.toUtf8Bytes("death_certificate"));
            await oracleBridge.setOracleCondition(vaultId, oracle.address, conditionId, "0x");
        });
        
        it("Should fulfill condition with valid oracle", async function () {
            const requestId = ethers.keccak256(ethers.toUtf8Bytes("request_1"));
            const response = ethers.toUtf8Bytes("confirmed");
            
            await expect(oracleBridge.connect(oracle).fulfillCondition(vaultId, requestId, response))
                .to.emit(oracleBridge, "OracleConditionFulfilled");
        });
        
        it("Should check condition status", async function () {
            expect(await oracleBridge.checkCondition(vaultId)).to.be.false;
            
            const requestId = ethers.keccak256(ethers.toUtf8Bytes("request_1"));
            await oracleBridge.connect(oracle).fulfillCondition(vaultId, requestId, "0x01");
            
            expect(await oracleBridge.checkCondition(vaultId)).to.be.true;
        });
    });
    
    describe("Trusted Oracles", function () {
        it("Should add trusted oracle", async function () {
            await oracleBridge.addTrustedOracle(oracle.address);
            expect(await oracleBridge.isTrustedOracle(oracle.address)).to.be.true;
        });
        
        it("Should remove trusted oracle", async function () {
            await oracleBridge.addTrustedOracle(oracle.address);
            await oracleBridge.removeTrustedOracle(oracle.address);
            expect(await oracleBridge.isTrustedOracle(oracle.address)).to.be.false;
        });
    });
});

