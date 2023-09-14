const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class AspectDescriptionData extends Model { }

AspectDescriptionData.init(
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
        body_id_2: {
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
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'aspect_description_data',

        indexes: [
            {
                unique: true,
                fields: ['body_id_1', 'body_id_2', 'aspect']
            }
        ]
    }
);

module.exports = AspectDescriptionData;