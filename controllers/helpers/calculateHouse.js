// -------------------------------------------------------
//              CALCULATE ASTROLOGY HOUSE
// -------------------------------------------------------
// Updated to start by checking if the azimuth is within the 1st house (which would be between the 12th house cusp and the 1st house cusp). If not, it loops through the rest of the house cusps to find the correct house.
function calculateHouse(azimuth, houseCusps) {
    console.log(`calculateHouse: azimuth: ${azimuth}, houseCusps: ${houseCusps}`);

    // When azimuth is close to 360, reduce it to near 0 for the logic to work.
    if (azimuth > 359.5) {
        azimuth = azimuth - 360;
    }

    // If the azimuth is between the last cusp and the start (House 1 cusp), it belongs to House 12.
    if ((azimuth >= houseCusps[11] && azimuth < 360) || (azimuth >= 0 && azimuth < houseCusps[0])) {
        return 12;
    }

    for (let i = 0; i < 11; i++) {
        if (azimuth >= houseCusps[i] && azimuth < houseCusps[i + 1]) {
            return i + 1;
        }
    }

    // This line should never be reached.
    console.error(`Unexpected azimuth value: ${azimuth}`);
    return null;
}

module.exports = { calculateHouse };