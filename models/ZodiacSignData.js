const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ZodiacSignData extends Model { }

ZodiacSignData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        sign: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        symbol: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dates: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'default_image_url_here'
        },
        sign_meaning: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'zodiac_sign_data'
    });

module.exports = ZodiacSignData;