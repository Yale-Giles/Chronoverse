const fs = require('fs');
const path = require('path');

console.log('Analyzing test coverage...\n');

const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');

if (fs.existsSync(coveragePath)) {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    
    console.log('Coverage Summary:');
    console.log('=================\n');
    
    for (const [file, data] of Object.entries(coverage)) {
        if (file !== 'total') {
            const fileName = path.basename(file);
            console.log(`${fileName}:`);
            console.log(`  Lines: ${data.lines.pct}%`);
            console.log(`  Statements: ${data.statements.pct}%`);
            console.log(`  Functions: ${data.functions.pct}%`);
            console.log(`  Branches: ${data.branches.pct}%\n`);
        }
    }
    
    if (coverage.total) {
        console.log('Overall Coverage:');
        console.log(`  Lines: ${coverage.total.lines.pct}%`);
        console.log(`  Statements: ${coverage.total.statements.pct}%`);
        console.log(`  Functions: ${coverage.total.functions.pct}%`);
        console.log(`  Branches: ${coverage.total.branches.pct}%`);
    }
} else {
    console.log('No coverage data found. Run: npm run test:coverage');
}

