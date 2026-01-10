const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // Import bcrypt

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'user_id' },

    // Sign-up added fields
    full_name: { type: DataTypes.STRING, allowNull: false },

    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },

    password: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },

    role: { type: DataTypes.ENUM('ADMIN', 'USER', 'MODERATOR'), defaultValue: 'USER' },

    // Main branch fields (Stats & Profile)
    bio: { type: DataTypes.TEXT },
    avatar_url: { type: DataTypes.TEXT },
    home_city: { type: DataTypes.STRING(100) },
    total_distance_km: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total_elevation_gain: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total_trips_completed: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_trails_conquered: { type: DataTypes.INTEGER, defaultValue: 0 },

    // Sign-up verification fields
    is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        // --- HOOK QUAN TRỌNG: Tự động hash pass trước khi tạo ---
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hook khi update user (đổi mật khẩu)
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Phương thức kiểm tra mật khẩu (Dùng khi Login)
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;