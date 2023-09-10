const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class ZodiacSignData extends Model { }

ZodiacSignData.init({
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
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sign_meaning: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'zodiac_sign_data'
});

module.exports = ZodiacSignData;