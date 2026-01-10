const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Group = require('./Group');

const GroupMember = sequelize.define('GroupMember', {
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: Group, key: 'group_id' }
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: User, key: 'user_id' }
    },
    role: {
        type: DataTypes.ENUM('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'),
        defaultValue: 'MEMBER'
    },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'group_members',
    timestamps: false
});

// Associations
User.belongsToMany(Group, { through: GroupMember, foreignKey: 'user_id' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'group_id', as: 'members' });

module.exports = GroupMember;
