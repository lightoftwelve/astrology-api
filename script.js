require('dotenv').config();
const router = require('express').Router();
const axios = require('axios');
const { calculateAngularSeparation } = require('./controllers/helpers/calculateAngularSeparation');
const { calculateHouse } = require('./controllers/helpers/calculateHouse');
const { calculateLST } = require('./controllers/helpers/calculateLST');
const { getClosestAspect } = require('./controllers/helpers/getClosestAspect');
const { calculateAscendants } = require ('./controllers/helpers/calculateAscendant');

if (!process.env.ASTRONOMY_API_KEY) {
    throw new Error('ASTRONOMY_API_KEY environment variable is not defined');
}

const ASTRONOMY_API_URL = 'https://api.astronomyapi.com/api/v2/bodies/positions';
const ASTRONOMY_API_ID = process.env.ASTRONOMY_API_ID;
const ASTRONOMY_API_KEY = process.env.ASTRONOMY_API_KEY;

const authString = Buffer.from(`${process.env.ASTRONOMY_API_ID}:${process.env.ASTRONOMY_API_KEY}`).toString('base64');
const headers = {
    Authorization: `Basic ${authString}`
};

// const express = require('express');
// const axios = require('axios');
// const { calculateAngularSeparation, getClosestAspect } = require('./utils/helpers/calculateAngularSeparation');

// const app = express();
// const port = 3000;

// const apiUrl = 'https://api.astronomyapi.com/api/v2/bodies/positions';

// // Replace this with your actual Application ID and Application Secret
// const applicationId = 'e668bae3-882c-4752-9972-f8f68e726eee';
// const applicationSecret = '6bb51127c8555b5fda041013e0b1ab43aeb16c6fca157354eb44a63c1279493a27b0e66384a3558c691d75f150c6416741c6e397c8dedffe051289353df9bcd01f49964ac5f0bc656f57b9215dd20ca4025c5095856eabae7a3bba3c5674fddb232458b9844d913eff7fe55860d18f04';

// const authString = Buffer.from(`${applicationId}:${applicationSecret}`).toString('base64');
// const headers = {
//   Authorization: `Basic ${authString}`
// };

// app.use(express.json());

router.post('/calculate', (req, res) => {
  const { longitude, latitude, elevation, date, time } = req.body;
  const params = {
    longitude,
    latitude,
    elevation,
    from_date: date,
    to_date: date,
    time
  };

  axios.get(apiUrl, { params, headers })
    .then(response => {
      const data = response.data.data;

      // Extract and log dates
      const fromDate = data.dates.from;
      const toDate = data.dates.to;
      console.log('From Date:', fromDate);
      console.log('To Date:', toDate);

      // Extract and log observer location
      const observerLocation = data.observer.location;
      console.log('Observer Location:', observerLocation);

      // Extract and log header elements
      const header = data.table.header;
      console.log('Header:', header);

      // Extract and log rows of position data
      const rows = data.table.rows;
      console.log('Rows:', rows);

      // Assuming 'cells' is an array of objects
      const celestialBodiesInfo = rows.map(row => {
        const entry = row.entry;
        const bodyId = entry.id;
        const bodyName = entry.name;
        const cells = row.cells;

        // Extract cell data for each celestial body
        const cellData = cells.map(cell => {
          const date = cell.date;
          const altitude = cell.position.horizontal.altitude.degrees;
          const azimuth = cell.position.horizontal.azimuth.degrees;
          const distanceAU = cell.distance.fromEarth.au;
          const distanceKM = cell.distance.fromEarth.km;
          const rightAscension = cell.position.equatorial.rightAscension.hours;
          const declination = cell.position.equatorial.declination.degrees;
          const constellationId = cell.position.constellation.id;
          const constellationShort = cell.position.constellation.short;
          const constellationName = cell.position.constellation.name;
          const elongation = cell.extraInfo.elongation;
          const magnitude = cell.extraInfo.magnitude;
          // Add more properties as needed

          return {
            date,
            altitude,
            azimuth,
            distanceAU,
            distanceKM,
            rightAscension,
            declination,
            constellationId,
            constellationShort,
            constellationName,
            elongation,
            magnitude
            // Add more properties as needed
          };
        });

        return {
          id: bodyId,
          name: bodyName,
          cellData: cellData
        };
      });

      // Log detailed information for each celestial body
      celestialBodiesInfo.forEach(body => {
        console.log(`Celestial Body: ${body.name}`);
        body.cellData.forEach(cell => {
          console.log('Date:', cell.date);
          console.log('Altitude (degrees):', cell.altitude);
          console.log('Azimuth (degrees):', cell.azimuth);
          // ... (Print other cell data)
          console.log('---'); // Separator
        });
        console.log('===================='); // Separator
      });

      for (let i = 0; i < celestialBodiesInfo.length; i++) {
        for (let j = i + 1; j < celestialBodiesInfo.length; j++) {
          const body1 = celestialBodiesInfo[i];
          const body2 = celestialBodiesInfo[j];

          const ra1 = body1.cellData[0].rightAscension;
          const dec1 = body1.cellData[0].declination;
          const ra2 = body2.cellData[0].rightAscension;
          const dec2 = body2.cellData[0].declination;

          const angularSeparation = calculateAngularSeparation(ra1, dec1, ra2, dec2);

          const aspect = getClosestAspect(angularSeparation);

          console.log(`Aspect between ${body1.name} and ${body2.name}: ${aspect}`);
        }
      }

      const sunData = celestialBodiesInfo.find(body => body.name === 'Sun');
      const decOfSun = sunData.cellData[0].declination;
      const raOfSun = sunData.cellData[0].rightAscension;

      const LST = calculateLST(longitude, new Date());
      const ascendant = calculateAscendant(LST, latitude, decOfSun);

      console.log('Local Sidereal Time:', LST);
      console.log('Ascendant:', ascendant);

      // Calculate house cusps
      const houseCusps = [];
      for (let i = 0; i < 12; i++) {
        houseCusps[i] = (ascendant + i * 30) % 360;
      }
      console.log('House Cusps:', houseCusps);

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
        const H = LST - raOfSun; // Local Hour Angle of the Sun
        const φ = latitude;
        const δ = declinationOfSun;
        const ascendant = Math.atan2(-Math.cos(H), Math.sin(H) * Math.cos(φ) - Math.tan(δ) * Math.sin(φ));
        return ascendant * 180 / Math.PI; // Convert from radians to degrees
      }

      function calculateHouse(azimuth, houseCusps) {
        for (let i = 0; i < 12; i++) {
          if (azimuth < houseCusps[i]) {
            return i + 1;
          }
        }
        return 1;
      }
      
      celestialBodiesInfo.forEach(body => {
        const azimuth = body.cellData[0].azimuth;
        const house = calculateHouse(azimuth, houseCusps);
        body.house = house;
      });
      
      res.json({
        LST,
        ascendant,
        houseCusps,
        celestialBodiesInfo // This now includes house information for each body
      });
      
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  });
});

module.exports = router;

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });