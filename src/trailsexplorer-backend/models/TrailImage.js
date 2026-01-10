const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Trail = require('./Trail');

const TrailImage = sequelize.define('TrailImage', {
    image_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    trail_id: {
        type: DataTypes.INTEGER,
        references: { model: Trail, key: 'trail_id' }
    },
    image_url: { type: DataTypes.STRING, allowNull: false },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    caption: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'trail_images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Define associations here
Trail.hasMany(TrailImage, { foreignKey: 'trail_id', as: 'images' });
TrailImage.belongsTo(Trail, { foreignKey: 'trail_id' });

module.exports = TrailImage;
