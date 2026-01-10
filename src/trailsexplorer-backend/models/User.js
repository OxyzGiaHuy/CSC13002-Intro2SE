const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // Import bcrypt

const User = sequelize.define('User', {
    // 1. Map id -> user_id
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true, 
        field: 'user_id' 
    },

    // 2. Thêm full_name (Vì Form đăng ký của bạn có trường này)
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // 3. Username (Bắt buộc trong DB, sẽ được tự động sinh ra ở Controller)
    username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },

    // 4. Email
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: { isEmail: true }
    },

    // 5. Map password -> password_hash và thêm logic bảo mật
    password: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        field: 'password_hash' // Map vào cột password_hash trong DB
    },

    // 6. Role & Status
    role: { 
        type: DataTypes.ENUM('ADMIN', 'USER', 'MODERATOR'), 
        defaultValue: 'USER' 
    },
    
    // 7. Email Verification
    is_email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
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
User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;