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
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
    reward_points: { type: DataTypes.INTEGER, defaultValue: 0 },
    image_url: { type: DataTypes.STRING }
}, {
    tableName: 'challenges',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Challenge;
