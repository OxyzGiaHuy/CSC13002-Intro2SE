const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trail = sequelize.define('Trail', {
    trail_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    short_description: { type: DataTypes.STRING(500) },
    difficulty: { type: DataTypes.ENUM('EASY', 'MODERATE', 'HARD'), allowNull: false },
    length_km: { type: DataTypes.DECIMAL(6, 2), allowNull: false },
    estimated_duration_hours: { type: DataTypes.INTEGER, allowNull: false },
    location_region: { type: DataTypes.STRING(100), allowNull: false },
    start_point: { type: DataTypes.GEOMETRY('POINT', 4326), allowNull: true }, // Should be not null generally but allow null for initial implementation if needed
    end_point: { type: DataTypes.GEOMETRY('POINT', 4326), allowNull: true }
}, {
    tableName: 'trails',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Trail;
