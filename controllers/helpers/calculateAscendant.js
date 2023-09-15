// --------------------------------------------------------
//              CALCULATE ASCENDANT SIGN
// --------------------------------------------------------
function calculateAscendant(LST, latitude, declinationOfSun, raOfSun) {
  const H = LST - raOfSun; // Local Hour angle of the sun - Right Ascension
  const φ = latitude;
  const δ = declinationOfSun;

  const ascendantRad = Math.atan2(-Math.cos(H), Math.sin(H) * Math.cos(φ) - Math.tan(δ) * Math.sin(φ));

  // Convert from radians to degrees, and make sure it's in the 0-360 range
  let ascendantDeg = ascendantRad * 180 / Math.PI;
  if (ascendantDeg < 0) ascendantDeg += 360;

  return ascendantDeg;
}

module.exports = { calculateAscendant };