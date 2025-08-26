const fs = require('fs');
const path = require('path');

const contracts = [
    'VaultManager',
    'TimelockVault',
    'HeirPolicy',
    'ProofOfLife',
    'SecretVault',
    'OracleBridge',
    'UnlockExecutor'
];

const abiDir = path.join(__dirname, '..', 'abi');
if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
}

contracts.forEach(name => {
    const artifact = require(`../artifacts/contracts/core/${name}.sol/${name}.json`);
    const abiPath = path.join(abiDir, `${name}.json`);
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`✓ Exported ${name} ABI`);
});

console.log('✅ All ABIs exported!');

