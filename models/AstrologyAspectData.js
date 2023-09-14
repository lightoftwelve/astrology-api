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
        description: {
            type: DataTypes.TEXT,
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
        modelName: 'astrology_aspect_data',

        indexes: [
            {
                unique: true,
                fields: ['user_id', 'body_id_1', 'body_id_2']
            }
        ]
    }
);

module.exports = AstrologyAspectData;