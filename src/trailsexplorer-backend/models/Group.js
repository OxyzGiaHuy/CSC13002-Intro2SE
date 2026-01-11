const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User'); // Owner

const Group = sequelize.define('Group', {
    group_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Schema: created_by INT REFERENCES users(user_id)
    created_by: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    // Schema: no trail_id directly in user_groups? No, it has rules, tags.
    // Wait, typical groups might not be bound to a trail.
    // My previous model had trail_id. Schema user_groups doesn't seem to have trail_id.
    // I will remove trail_id to match schema or check if I can add it.
    // Schema has 'avatar_url', 'cover_image_url'.
    avatar_url: { type: DataTypes.STRING },

    group_type: {
        type: DataTypes.ENUM('PUBLIC', 'PRIVATE', 'INVITE_ONLY'),
        defaultValue: 'PUBLIC'
    }
}, {
    tableName: 'user_groups', // Schema table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Association for the creator/owner
// Note: This needs User to be defined. If circular dependency issues arise, move to a separate init file.
// Ideally, we require User here or set up associations in a central place.
// For now, let's assume User is required top-level (it is).
Group.belongsTo(User, { as: 'owner', foreignKey: 'created_by' });

module.exports = Group;

// Associations
// Associations
User.hasMany(Group, { foreignKey: 'created_by' });
// Duplicate removed: Group.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });


module.exports = Group;
