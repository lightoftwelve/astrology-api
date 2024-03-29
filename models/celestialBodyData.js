// --------------------------------------------
//          PLANET INFORMATION
// --------------------------------------------
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class CelestialBodyData extends Model { }

CelestialBodyData.init(
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'member',
                key: 'id',
            },
        },
        body_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        body_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        altitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        azimuth: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        distanceAU: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        distanceKM: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rightAscension: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        declination: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        constellationId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        constellationShort: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        constellationName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        elongation: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        magnitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        house: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'celestial_body_data',

        indexes: [
            {
                unique: true,
                fields: ['user_id', 'body_id', 'date']
            }
        ],
    }
);

module.exports = CelestialBodyData;