function getInterpretation(planet, houseNumber, astrologySign) {
    let interpretation = '';

    if (planet && houseNumber) {
        // get interpretation for planet in house
        interpretation = `The significance of ${planet} being in the ${houseNumber} house is ...`;
    } else if (planet && astrologySign) {
        // get interpretation for planet in astrology sign
        interpretation = `The meaning of ${planet} being in ${astrologySign} is ...`;
    }

    return interpretation;
}

module.exports = { getInterpretation };