const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Trail = require('./Trail');

const CommunityPost = sequelize.define('CommunityPost', {
    post_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'user_id' }
    },
    content_type: {
        type: DataTypes.ENUM('TEXT', 'PHOTO', 'VIDEO', 'TRIP_REPORT', 'TRAIL_REVIEW', 'QUESTION'),
        defaultValue: 'TEXT'
    },
    title: { type: DataTypes.STRING(200) },
    content: { type: DataTypes.TEXT },
    media_urls: { type: DataTypes.JSONB, defaultValue: [] },
    trail_id: {
        type: DataTypes.INTEGER,
        references: { model: Trail, key: 'trail_id' },
        allowNull: true
    },
    like_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    comment_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    share_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    visibility: {
        type: DataTypes.ENUM('PUBLIC', 'PRIVATE', 'FRIENDS_ONLY', 'GROUP'),
        defaultValue: 'PUBLIC'
    },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: true },
    // Moderation fields
    is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
    report_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    reported_by_users: { type: DataTypes.JSONB, defaultValue: [] },
    moderated_at: { type: DataTypes.DATE, allowNull: true },
    moderated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: User, key: 'user_id' }
    }
}, {
    tableName: 'community_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Associations
User.hasMany(CommunityPost, { foreignKey: 'user_id' });
CommunityPost.belongsTo(User, { foreignKey: 'user_id' });

Trail.hasMany(CommunityPost, { foreignKey: 'trail_id' });
CommunityPost.belongsTo(Trail, { foreignKey: 'trail_id' });

module.exports = CommunityPost;
