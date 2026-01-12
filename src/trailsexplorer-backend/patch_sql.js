const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'migrations', 'example-data.sql');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the problematic lines
    const newContent = content
        .replace(/SET session_replication_role = 'replica';/g, "-- SET session_replication_role = 'replica';")
        .replace(/SET session_replication_role = 'origin';/g, "-- SET session_replication_role = 'origin';");

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('✅ Successfully patched example-data.sql');
    } else {
        console.log('ℹ️ No changes needed for example-data.sql');
    }

} catch (err) {
    console.error('❌ Error patching file:', err);
}
