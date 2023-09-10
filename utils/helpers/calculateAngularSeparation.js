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

function getClosestAspect(angularSeparation) {
    const aspects = [
        { name: 'conjunction', degrees: 0 },
        { name: 'sextile', degrees: 60 },
        { name: 'square', degrees: 90 },
        { name: 'trine', degrees: 120 },
        { name: 'opposition', degrees: 180 },
    ];

    // find the aspect with the closest number of degrees to the angular separation
    const closestAspect = aspects.reduce((prev, curr) =>
        Math.abs(curr.degrees - angularSeparation) < Math.abs(prev.degrees - angularSeparation) ? curr : prev
    );

    return closestAspect.name;
}

module.exports = {
    calculateAngularSeparation,
    getClosestAspect
};