const fs = require('fs');
const path = require('path');

console.log('Checking contract sizes...\n');

const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts');

function getContractSize(contractPath) {
    try {
        const artifact = require(contractPath);
        const bytecode = artifact.bytecode;
        const size = (bytecode.length - 2) / 2; // Remove 0x and divide by 2
        return size;
    } catch (e) {
        return 0;
    }
}

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            checkDirectory(filePath);
        } else if (file.endsWith('.json') && !file.endsWith('.dbg.json')) {
            const size = getContractSize(filePath);
            const contractName = path.basename(file, '.json');
            
            if (size > 0) {
                const sizeKB = (size / 1024).toFixed(2);
                const maxSize = 24576; // 24KB limit
                const percentage = ((size / maxSize) * 100).toFixed(1);
                
                console.log(`${contractName}: ${sizeKB} KB (${percentage}% of limit)`);
                
                if (size > maxSize) {
                    console.log(`  ⚠️  WARNING: Exceeds 24KB limit!`);
                }
            }
        }
    });
}

if (fs.existsSync(artifactsPath)) {
    checkDirectory(artifactsPath);
} else {
    console.log('No artifacts found. Run: npm run compile');
}

