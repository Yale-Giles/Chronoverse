const fs = require('fs');
const path = require('path');

const foldersToDelete = [
    'cache',
    'artifacts',
    'coverage',
    'typechain-types'
];

console.log('Cleaning project...');

foldersToDelete.forEach(folder => {
    const folderPath = path.join(__dirname, '..', folder);
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`✓ Deleted ${folder}/`);
    }
});

console.log('✅ Clean complete!');

