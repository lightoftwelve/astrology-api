//  Calculate house cusps
function calculateHouseCusps(ascendant) {
    const houseCusps = [];
    for (let i = 0; i < 12; i++) {
        houseCusps[i] = (ascendant + i * 30) % 360;
    }
    return houseCusps;
}

module.exports = { calculateHouseCusps };