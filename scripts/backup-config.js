const fs = require('fs');
const path = require('path');

console.log('Backup Configuration');
console.log('===================\n');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(__dirname, '..', 'backups');
const backupFile = path.join(backupDir, `config-${timestamp}.json`);

// Create backups directory
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Collect configuration
const config = {
    timestamp: new Date().toISOString(),
    network: process.env.NETWORK || 'unknown',
    contracts: {
        vaultManager: process.env.VAULT_MANAGER_ADDRESS,
        timelockVault: process.env.TIMELOCK_VAULT_ADDRESS,
        heirPolicy: process.env.HEIR_POLICY_ADDRESS,
        proofOfLife: process.env.PROOF_OF_LIFE_ADDRESS,
        secretVault: process.env.SECRET_VAULT_ADDRESS,
        oracleBridge: process.env.ORACLE_BRIDGE_ADDRESS,
        unlockExecutor: process.env.UNLOCK_EXECUTOR_ADDRESS
    },
    rpc: {
        arbitrum: process.env.ARBITRUM_RPC_URL ? 'configured' : 'not set',
        ethereum: process.env.ETHEREUM_RPC_URL ? 'configured' : 'not set'
    }
};

// Save backup
fs.writeFileSync(backupFile, JSON.stringify(config, null, 2));

console.log('✓ Configuration backed up to:');
console.log(`  ${backupFile}\n`);

console.log('Backup contains:');
Object.keys(config.contracts).forEach(key => {
    if (config.contracts[key]) {
        console.log(`  ✓ ${key}: ${config.contracts[key]}`);
    }
});

console.log('\n⚠️  Keep backups secure and private!');

