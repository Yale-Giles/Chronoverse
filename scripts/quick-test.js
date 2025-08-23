const { exec } = require('child_process');

console.log('Quick Test Runner');
console.log('=================\n');

const testFiles = process.argv.slice(2);

if (testFiles.length === 0) {
    console.log('Usage: node quick-test.js <test-file-pattern>');
    console.log('Example: node quick-test.js VaultManager');
    process.exit(1);
}

const pattern = testFiles.join('|');
const cmd = `npx hardhat test --grep "${pattern}"`;

console.log(`Running: ${cmd}\n`);

exec(cmd, (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (error) process.exit(1);
});

