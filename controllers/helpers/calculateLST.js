function calculateLST(longitudeInput, dateInput, timeInput) {
    const longitude = Number(longitudeInput);

    // Convert user's date and time input to a Date object
    console.log(typeof dateInput, dateInput);

    if (typeof dateInput !== 'string' || typeof timeInput !== 'string') {
        throw new Error("Invalid inputs: Date and Time should be in string format");
    }

    const [year, month, day] = dateInput.split('-').map(Number);
    const [hours, minutes, seconds] = timeInput.split(':').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

    const J2000 = new Date(Date.UTC(2000, 0, 1)); // January 1, 2000
    const msPerDay = 24 * 60 * 60 * 1000;
    const N = (date - J2000) / msPerDay; // Number of days since J2000.0

    // Calculate UT in decimal hours
    const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

    // Calculate Local Sidereal Time using the provided formula
    // const LST = 100.46 + 0.985647 * N + longitude + 15 * UT;
    // (LST % 360).toFixed(4);

    const LST = 100.46 + 0.985647 * N + longitude + 15 * UT;
    const normalizedLST = LST >= 0 ? LST % 360 : (LST % 360 + 360) % 360;
    return normalizedLST.toFixed(4);

}

module.exports = { calculateLST };




// function calculateLST(longitudeInput, date) {
//     const longitude = Number(longitudeInput);
//     console.log(`CalculateLST: ${longitude, date}`);
//     const J2000 = new Date(Date.UTC(2000, 0, 1)); // January 1, 2000
//     const msPerDay = 24 * 60 * 60 * 1000;
//     const N = (date - J2000) / msPerDay; // Number of days since J2000.0
//     // can it go down to whole number
//     const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
//     const LST = 100.46 + 0.985647 * N + longitude + 15 * UT;
//     console.log(LST % 360);
//     return Math.floor(LST % 360); // Ensure the result is between 0 and 360 degrees
// }

// module.exports = { calculateLST };