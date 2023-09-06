const { declination, rightAscension } = require('../../script');

// Function to calculate Local Sidereal Time (LST)
function calculateLST(longitude, date) {
    const J2000 = new Date(Date.UTC(2000, 0, 1)); // January 1, 2000
    const msPerDay = 24 * 60 * 60 * 1000;
    const N = (date - J2000) / msPerDay; // Number of days since J2000.0
    const UT = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    const LST = 100.46 + 0.985647 * N + longitude + 15 * UT;
    return LST % 360; // Ensure the result is between 0 and 360 degrees
  }
  
  // Function to calculate Ascendant
  function calculateAscendant(LST, latitude, declinationOfSun) {
    const H = LST - rightAscensionOfSun; // Local Hour Angle of the Sun
    const φ = latitude;
    const δ = declinationOfSun;
    const ascendant = Math.atan2(-Math.cos(H), Math.sin(H) * Math.cos(φ) - Math.tan(δ) * Math.sin(φ));
    return ascendant * 180 / Math.PI; // Convert from radians to degrees
  }
  
  // Example usage:
  const longitude = -122.4194; // Example longitude for San Francisco
  const latitude = 37.7749; // Example latitude for San Francisco
  const date = new Date(); // Current date and time
  const declinationOfSun = 23.44; // Example declination of the Sun (this would be calculated based on the date)
  
  const LST = calculateLST(longitude, date);
  const ascendant = calculateAscendant(LST, latitude, declinationOfSun);
  
  console.log('Local Sidereal Time:', LST);
  console.log('Ascendant:', ascendant);
  
  // Calculate house cusps
  const houseCusps = [];
  for (let i = 0; i < 12; i++) {
    houseCusps[i] = (ascendant + i * 30) % 360;
  }
  console.log('House Cusps:', houseCusps);
  
  const dec = declination(/* ... parameters ... */);
  const RA = rightAscension(/* ... parameters ... */);