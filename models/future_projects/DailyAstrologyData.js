const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/connection');

class DailyAstrologyData extends Model { }

DailyAstrologyData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        astrologyData: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'daily_astrology_data',
    }
);

module.exports = { DailyAstrologyData };