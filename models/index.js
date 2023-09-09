// const User = require('./User');
const CelestialBodyData = require('./celestialBodyData');
const AstrologyAspectData = require('./AstrologyAspectData');

CelestialBodyData.hasMany(AstrologyAspectData, {
    foreignKey: 'body_id',
    as: 'aspects'
});

AstrologyAspectData.belongsTo(CelestialBodyData, {
    foreignKey: 'body_id',
});


module.exports = { CelestialBodyData, AstrologyAspectData };