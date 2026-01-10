const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'user_id' },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
    role: { type: DataTypes.ENUM('ADMIN', 'USER', 'MODERATOR'), defaultValue: 'USER' },
    bio: { type: DataTypes.TEXT },
    avatar_url: { type: DataTypes.TEXT },
    home_city: { type: DataTypes.STRING(100) },
    total_distance_km: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total_elevation_gain: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total_trips_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_trails_conquered: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;