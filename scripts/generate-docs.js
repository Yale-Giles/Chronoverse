const { exec } = require('child_process');
const path = require('path');

console.log('Generating contract documentation...');

const cmd = 'npx solidity-docgen --solc-module solc --templates ./docs/templates';

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error('Error:', error.message);
        return;
    }
    if (stderr) {
        console.error('Stderr:', stderr);
        return;
    }
    console.log(stdout);
    console.log('✅ Documentation generated!');
});

