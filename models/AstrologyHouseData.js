const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class AstrologyHouseData extends Model { }

AstrologyHouseData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        LST: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        ascendant: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        house_cusps: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        house: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'member',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'astrology_house_data',

        indexes: [
            {
                unique: true,
                fields: ['user_id']
            }
        ],
    }
);

module.exports = AstrologyHouseData;