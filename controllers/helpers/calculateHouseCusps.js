// ----------------------------------------
// In the Equal House System, each house covers exactly 30 degrees, and the Ascendant marks the cusp of the 1st house.
// ----------------------------------------
function calculateHouseCusps(ascendant) {
    const houseCusps = [];
    for (let i = 0; i < 12; i++) {
        houseCusps[i] = (ascendant + i * 30) % 360;
    }
    return houseCusps.sort((a, b) => a - b);
}

module.exports = { calculateHouseCusps };