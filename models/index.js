const Member = require('./Member');
const AstrologyAspectData = require('./AstrologyAspectData');
const CelestialBodyData = require('./celestialBodyData');
const ZodiacSignData = require('./ZodiacSignData');

// CelestialBodyData to AstrologyAspectData for body_id_1
// CelestialBodyData.hasMany(AstrologyAspectData, {
//     foreignKey: 'body_id_1',
//     sourceKey: 'body_id',
//     as: 'aspects_1'
// });

// AstrologyAspectData.belongsTo(CelestialBodyData, {
//     foreignKey: 'body_id_1',
//     targetKey: 'body_id',
//     as: 'body_1'
// });

// CelestialBodyData to AstrologyAspectData for body_id_2
// CelestialBodyData.hasMany(AstrologyAspectData, {
//     foreignKey: 'body_id_2',
//     sourceKey: 'body_id',
//     as: 'aspects_2'
// });

// AstrologyAspectData.belongsTo(CelestialBodyData, {
//     foreignKey: 'body_id_2',
//     targetKey: 'body_id',
//     as: 'body_2'
// });

module.exports = { Member, CelestialBodyData, AstrologyAspectData, ZodiacSignData };