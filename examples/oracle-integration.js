// Example: Oracle integration for conditional unlocks
const { ethers } = require("hardhat");

async function main() {
    const oracleBridgeAddress = process.env.ORACLE_BRIDGE_ADDRESS;
    const OracleBridge = await ethers.getContractAt("OracleBridge", oracleBridgeAddress);
    
    const vaultId = process.argv[2] || 1;
    
    console.log("Oracle Integration Example");
    console.log("===========================\n");
    
    // Set oracle condition
    const oracleAddress = "0x..."; // Your oracle contract
    const conditionId = ethers.keccak256(ethers.toUtf8Bytes("death_certificate"));
    const conditionData = ethers.toUtf8Bytes("verify_death_record");
    
    console.log("Setting oracle condition:");
    console.log(`  Oracle: ${oracleAddress}`);
    console.log(`  Condition ID: ${conditionId}`);
    
    // Uncomment to execute:
    // await OracleBridge.setOracleCondition(
    //     vaultId,
    //     oracleAddress,
    //     conditionId,
    //     conditionData
    // );
    
    // Check condition status
    const condition = await OracleBridge.getCondition(vaultId);
    console.log("\nCurrent condition:");
    console.log(`  Oracle: ${condition.oracleAddress}`);
    console.log(`  Fulfilled: ${condition.isFulfilled}`);
    
    if (condition.isFulfilled) {
        const fulfillmentDate = new Date(Number(condition.fulfillmentTime) * 1000);
        console.log(`  Fulfilled at: ${fulfillmentDate.toLocaleString()}`);
    }
    
    console.log("\n--- Oracle Fulfillment Example ---");
    console.log("// Called by oracle when condition is met:");
    console.log("await OracleBridge.fulfillCondition(vaultId, requestId, responseData);");
}

main().catch(console.error);

