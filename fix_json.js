
const fs = require('fs');
const path = require('path');

const files = [
    './package.json',
    './apps/admin/package.json',
    './apps/client/package.json',
    './packages/shared-type/package.json'
];

files.forEach(file => {
    try {
        const filePath = path.resolve(process.cwd(), file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            // Try formatting to fix basic syntax if possible or just parse
            // If it fails parse, we might need a looser parser, but let's assume standard JSON with potential minor errors
            // Actually, if it has syntax errors, JSON.parse will throw. 
            // The prompt asks to "Detect and correct". 
            // If strict JSON.parse fails, we won't be able to easily fix it without a loose parser.
            // But let's assume it's valid enough or we can use a regex to fix trailing commas.

            let cleanContent = content.replace(/,(\s*[}\]])/g, '$1'); // Fix trailing commas
            const json = JSON.parse(cleanContent);

            // Validation Logic from prompts
            if (file.includes('packages/shared-type')) {
                if (json.name !== '@rifasfull/shared-types') {
                    console.log('Fixing shared package name');
                    json.name = '@rifasfull/shared-types';
                }
            }

            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
            console.log(`✅ Fixed/Validated ${file}`);
        } else {
            console.error(`❌ File not found: ${file}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${file}: ${error.message}`);
    }
});
