const User = require('./models/User');
const sequelize = require('./config/database');

async function listUsers() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const users = await User.findAll({
            attributes: ['user_id', 'username', 'email', 'role', 'password', 'created_at'],
            order: [['created_at', 'ASC']]
        });

        console.log(`\nFound ${users.length} users:\n`);
        console.table(users.map(u => ({
            ID: u.user_id,
            Name: u.username,
            Email: u.email,
            Password: u.password, // Will be hashed string
            Role: u.role,
            Created: u.created_at ? new Date(u.created_at).toLocaleString() : 'N/A'
        })));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

listUsers();
