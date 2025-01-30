const fs = require('fs');
const path = require('path');

console.log('Validating Configuration');
console.log('========================\n');

const requiredEnvVars = [
    'ARBITRUM_RPC_URL',
    'ETHEREUM_RPC_URL',
    'PRIVATE_KEY'
];

const optionalEnvVars = [
    'ARBISCAN_API_KEY',
    'ETHERSCAN_API_KEY',
    'CHAINLINK_NODE_ADDRESS'
];

// Check .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.log('⚠️  No .env file found');
    console.log('   Copy .env.example to .env and configure\n');
} else {
    console.log('✓ .env file found\n');
}

// Load environment
require('dotenv').config({ path: envPath });

console.log('Required Variables:');
let allRequired = true;
requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
        console.log(`  ✓ ${varName}`);
    } else {
        console.log(`  ✗ ${varName} - MISSING`);
        allRequired = false;
    }
});

console.log('\nOptional Variables:');
optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
        console.log(`  ✓ ${varName}`);
    } else {
        console.log(`  ○ ${varName} - not set`);
    }
});

console.log('\nContract Addresses:');
const addresses = [
    'VAULT_MANAGER_ADDRESS',
    'TIMELOCK_VAULT_ADDRESS',
    'HEIR_POLICY_ADDRESS'
];

addresses.forEach(addr => {
    if (process.env[addr]) {
        console.log(`  ✓ ${addr}: ${process.env[addr]}`);
    } else {
        console.log(`  ○ ${addr}: not deployed yet`);
    }
});

if (allRequired) {
    console.log('\n✅ All required configuration present');
} else {
    console.log('\n❌ Missing required configuration');
    process.exit(1);
}

