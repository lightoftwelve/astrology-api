function calculateLST(longitude, date) {
    const J2000 = new Date(Date.UTC(2000, 0, 1)); // January 1, 2000
    const msPerDay = 24 * 60 * 60 * 1000;
    const N = (date - J2000) / msPerDay; // Number of days since J2000.0
    const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const LST = 100.46 + 0.985647 * N + longitude + 15 * UT;
    return LST % 360; // Ensure the result is between 0 and 360 degrees
}

module.exports = { calculateLST };