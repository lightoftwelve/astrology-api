const Member = require('./Member');
const AstrologyAspectData = require('./AstrologyAspectData');
const CelestialBodyData = require('./CelestialBodyData');

// CelestialBodyData to AstrologyAspectData for body_id_1
CelestialBodyData.hasMany(AstrologyAspectData, {
    foreignKey: 'body_id_1',
    as: 'aspects_1'
});

AstrologyAspectData.belongsTo(CelestialBodyData, {
    foreignKey: 'body_id_1',
    as: 'body_1'
});

// CelestialBodyData to AstrologyAspectData for body_id_2
CelestialBodyData.hasMany(AstrologyAspectData, {
    foreignKey: 'body_id_2',
    as: 'aspects_2'
});

AstrologyAspectData.belongsTo(CelestialBodyData, {
    foreignKey: 'body_id_2',
    as: 'body_2'
});

module.exports = { Member, CelestialBodyData, AstrologyAspectData };