// --------------------------------------------------------
//        CALCULATE ANGULAR SEPARATION FOR ASPECTS
// --------------------------------------------------------
// replaced haversine formula with: cos(θ) = sin(δ1)sin(δ2) + cos(δ1)cos(δ2)cos(α1 - α2) as haversine calculates distance between two points on earths surface so its returning only opposition
function calculateAngularSeparation(ra1, dec1, ra2, dec2) {
    const ra1Rad = (ra1 * Math.PI) / 12; // convert hours to radians
    const dec1Rad = (dec1 * Math.PI) / 180; // convert degrees to radians
    const ra2Rad = (ra2 * Math.PI) / 12; // convert hours to radians
    const dec2Rad = (dec2 * Math.PI) / 180; // convert degrees to radians

    const cosTheta =
        Math.sin(dec1Rad) * Math.sin(dec2Rad) +
        Math.cos(dec1Rad) * Math.cos(dec2Rad) * Math.cos(ra1Rad - ra2Rad);

    const thetaRad = Math.acos(cosTheta);

    const thetaDeg = (thetaRad * 180) / Math.PI; // convert radians to degrees

    return thetaDeg;
}

module.exports = { calculateAngularSeparation };