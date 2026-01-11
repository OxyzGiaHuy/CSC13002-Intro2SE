const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Challenge = sequelize.define('Challenge', {
    challenge_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    created_by: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'user_id' }
    },
    name: { type: DataTypes.STRING, allowNull: false }, // schema: name
    description: { type: DataTypes.TEXT },
    target_value: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // schema: target_value
    unit: { type: DataTypes.STRING, allowNull: false },
    challenge_type: {
        type: DataTypes.ENUM('DISTANCE', 'ELEVATION', 'TRAIL_COUNT', 'DURATION', 'STREAK'),
        defaultValue: 'DISTANCE'
    },
    end_date: { type: DataTypes.DATEONLY },
    challenge_type: {
        type: DataTypes.ENUM('DISTANCE', 'ELEVATION', 'TRAIL_COUNT', 'DURATION', 'STREAK'),
        defaultValue: 'DISTANCE'
    }
}, {
    tableName: 'challenges',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Challenge;
