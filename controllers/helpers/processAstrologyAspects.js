// --------------------------------------------------------
//         FUNCTION TO PROCESS ASTROLOGY ASPECTS
// --------------------------------------------------------
const { calculateAngularSeparation } = require('./calculateAngularSeparation');
const { getClosestAspect } = require('./getClosestAspect');

// Calculate Astrology Aspects
function processAstrologyAspects(celestialBodiesInfo) {
  const aspectsToInsert = [];

  for (let i = 0; i < celestialBodiesInfo.length; i++) {
    for (let j = i + 1; j < celestialBodiesInfo.length; j++) {
      const body1 = celestialBodiesInfo[i];
      const body2 = celestialBodiesInfo[j];

      // Skip if either body is named "Earth"
      if (body1.name === 'Earth' || body2.name === 'Earth') {
        continue;
      }

      // Right Ascension and Declination of each Celestial Body
      const ra1 = body1.cellData.rightAscension;
      const dec1 = body1.cellData.declination;
      const ra2 = body2.cellData.rightAscension;
      const dec2 = body2.cellData.declination;

      // Calculate Angular Separation
      const angularSeparation = calculateAngularSeparation(ra1, dec1, ra2, dec2);

      // Calculate Closest Aspect
      const aspect = getClosestAspect(angularSeparation);

      if (aspect !== null) {
        aspectsToInsert.push({
          body_id_1: body1.id,
          body_name_1: body1.name,
          body_id_2: body2.id,
          body_name_2: body2.name,
          aspect
        });
      }
    }
  }
  return aspectsToInsert;
}

module.exports = { processAstrologyAspects };