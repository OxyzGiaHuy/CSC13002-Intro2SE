const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserChallenge = sequelize.define('UserChallenge', {
    user_challenge_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'user_id' }
    },
    challenge_id: {
        type: DataTypes.INTEGER,
        references: { model: 'challenges', key: 'challenge_id' }
    },
    status: {
        type: DataTypes.ENUM('JOINED', 'COMPLETED', 'FAILED'),
        defaultValue: 'JOINED'
    },
    progress: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'user_challenges',
    timestamps: false
});

module.exports = UserChallenge;
