// Calculate Ascendant (Rising sign)
function calculateAscendant(LST, latitude, declinationOfSun, raOfSun) {
  const H = LST - raOfSun; // Local Hour angle of the sun - Right Ascension
  const φ = latitude;
  const δ = declinationOfSun;
  const ascendant = Math.atan2(-Math.cos(H), Math.sin(H) * Math.cos(φ) - Math.tan(δ) * Math.sin(φ));
  return ascendant * 180 / Math.PI; // Convert from radians to degrees
}

module.exports = { calculateAscendant };