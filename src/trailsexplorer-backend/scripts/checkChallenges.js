const sequelize = require('../config/database');
const Challenge = require('../models/Challenge');

async function checkChallenges() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const count = await Challenge.count();
        console.log(`Total challenges: ${count}`);

        const challenges = await Challenge.findAll();
        console.log(JSON.stringify(challenges, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error checking challenges:', error);
        process.exit(1);
    }
}

checkChallenges();
