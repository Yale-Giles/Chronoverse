const fs = require('fs');
const path = require('path');

console.log("Test Summary Generator");
console.log("=====================\n");

const testDir = path.join(__dirname, '..', 'test');

function countTests(dir) {
    let total = 0;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
            total += countTests(fullPath);
        } else if (file.name.endsWith('.test.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const tests = content.match(/it\(/g) || [];
            total += tests.length;
            console.log(`${file.name}: ${tests.length} tests`);
        }
    });
    
    return total;
}

const totalTests = countTests(testDir);

console.log(`\n✅ Total tests: ${totalTests}`);
console.log("Run 'npm test' to execute all tests");

