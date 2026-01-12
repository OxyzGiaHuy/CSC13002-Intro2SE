const sequelize = require('./config/database');
const fs = require('fs');

async function inspect() {
    try {
        await sequelize.authenticate();

        const [results] = await sequelize.query(`
            SELECT data_type, udt_name 
            FROM information_schema.columns 
            WHERE table_name = 'community_posts' AND column_name = 'content_type';
        `);

        const output = `Type: ${results[0]?.data_type}, UDT: ${results[0]?.udt_name}\n`;
        fs.writeFileSync('inspection_result.txt', output, 'utf8');

        // Check constraints
        const [constraints] = await sequelize.query(`
            SELECT conname, pg_get_constraintdef(oid) 
            FROM pg_constraint 
            WHERE conrelid = 'community_posts'::regclass;
        `);
        fs.appendFileSync('inspection_result.txt', 'Constraints: ' + JSON.stringify(constraints, null, 2) + '\n', 'utf8');

        // Check values
        const [values] = await sequelize.query(`SELECT DISTINCT content_type FROM community_posts`);
        fs.appendFileSync('inspection_result.txt', 'Values: ' + JSON.stringify(values) + '\n', 'utf8');

    } catch (err) {
        fs.writeFileSync('inspection_result.txt', 'Error: ' + err.message, 'utf8');
    } finally {
        await sequelize.close();
    }
}

inspect();
