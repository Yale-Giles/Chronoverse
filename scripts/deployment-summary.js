const fs = require('fs');

console.log('Deployment Summary');
console.log('==================\n');

const addresses = {
    VaultManager: process.env.VAULT_MANAGER_ADDRESS,
    TimelockVault: process.env.TIMELOCK_VAULT_ADDRESS,
    HeirPolicy: process.env.HEIR_POLICY_ADDRESS,
    ProofOfLife: process.env.PROOF_OF_LIFE_ADDRESS,
    SecretVault: process.env.SECRET_VAULT_ADDRESS,
    OracleBridge: process.env.ORACLE_BRIDGE_ADDRESS,
    UnlockExecutor: process.env.UNLOCK_EXECUTOR_ADDRESS
};

const summary = {
    timestamp: new Date().toISOString(),
    network: process.env.NETWORK || 'unknown',
    contracts: addresses
};

// Save to file
const outputPath = './deployment-summary.json';
fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

console.log('Summary saved to:', outputPath);
console.log('\nDeployed Contracts:');
Object.entries(addresses).forEach(([name, addr]) => {
    console.log(`  ${name}: ${addr || 'Not deployed'}`);
});

