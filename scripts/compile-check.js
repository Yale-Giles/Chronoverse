const { exec } = require('child_process');

console.log('Compilation Check');
console.log('=================\n');

exec('npx hardhat compile', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Compilation failed:');
        console.error(stderr);
        process.exit(1);
    }
    
    console.log(stdout);
    
    // Check for warnings
    if (stdout.includes('Warning')) {
        console.log('\n⚠️  Compilation completed with warnings');
    } else {
        console.log('\n✅ Compilation successful - no warnings');
    }
});

