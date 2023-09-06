// ----------------------------------------
//           HouseCusps might be the problem
// ----------------------------------------
function calculateHouse(azimuth, houseCusps) {
    for (let i = 0; i < 12; i++) {
        if (azimuth < houseCusps[i]) {
            return i + 1;
        }
    }
    return 1;
}

module.exports = { calculateHouse } ;