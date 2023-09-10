const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class AstrologyAspectData extends Model { }

AstrologyAspectData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        body_id_1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body_name_1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body_id_2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body_name_2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        aspect: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'astrology_aspect_data',
    }
);

module.exports = AstrologyAspectData;