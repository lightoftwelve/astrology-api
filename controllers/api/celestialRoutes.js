require('dotenv').config();
const router = require('express').Router();
const axios = require('axios');
const { calculateLST } = require('../helpers/calculateLST');
const { calculateAscendant } = require('../helpers/calculateAscendant');
const { processAstrologyAspects } = require('../helpers/processAstrologyAspects');
const { calculateHouse } = require('../helpers/calculateHouse');
const { calculateHouseCusps } = require('../helpers/calculateHouseCusps');
const { calculateZodiacSign } = require('../helpers/calculateZodiacSign');
const isAuthenticatedAPI = require('../../utils/isAuthenticated');
// const { getInterpretation } = require('../helpers/getInterpretation');
const { CelestialBodyData, AstrologyAspectData } = require('../../models/index')

// --------------------------------------------
//     Connection to AstromonyAPI (astronomyapi.com)
// --------------------------------------------
if (!process.env.ASTRONOMY_API_KEY) { throw new Error('ASTRONOMY_API_KEY environment variable is not defined'); }
const ASTRONOMY_API_URL = process.env.ASTRONOMY_API_URL;
const ASTRONOMY_API_ID = process.env.ASTRONOMY_API_ID;
const ASTRONOMY_API_KEY = process.env.ASTRONOMY_API_KEY;
const authString = Buffer.from(`${process.env.ASTRONOMY_API_ID}:${process.env.ASTRONOMY_API_KEY}`).toString('base64');
const headers = { Authorization: `Basic ${authString}` };

// --------------------------------------------
//     Extracting planetary data from API
// --------------------------------------------
function getCellData(cells, bodyId, bodyName) {
  let cell = cells[0];
  const date = cell.date;
  const altitude = cell.position.horizontal.altitude.degrees;
  const azimuth = cell.position.horizontal.azimuth.degrees;
  const distanceAU = cell.distance.fromEarth.au || 0;
  const distanceKM = cell.distance.fromEarth.km || 0;
  const rightAscension = cell.position.equatorial.rightAscension.hours;
  const declination = cell.position.equatorial.declination.degrees;
  const constellationId = cell.position.constellation.id;
  const constellationShort = cell.position.constellation.short;
  const constellationName = cell.position.constellation.name;
  const elongation = cell.extraInfo.elongation || 0;
  const magnitude = cell.extraInfo.magnitude || 0;

  return {
    date,
    bodyId,
    bodyName,
    altitude,
    azimuth,
    distanceAU,
    distanceKM,
    declination,
    rightAscension,
    constellationId,
    constellationShort,
    constellationName,
    elongation,
    magnitude
  };
}

// --------------------------------------------
// Route for calculating birthchart data & Equal House System
// --------------------------------------------
router.post('/calculate', isAuthenticatedAPI, (req, res) => {
  const { longitude, latitude, elevation, date, time } = req.body;
  const userId = req.user.id; // Extract the user ID from the session
  const params = {
    longitude,
    latitude,
    elevation,
    from_date: date,
    to_date: date,
    time
  };

  axios.get(ASTRONOMY_API_URL, { params, headers })
    .then(response => {
      const data = response.data.data;
      console.log("Raw API Response:", response.data);

      // Extract and log dates
      const fromDate = data.dates.from;
      console.log('From Date:', fromDate);
      const toDate = data.dates.to;
      console.log('To Date:', toDate);

      // Extract and log observer location (Long, Lat & Elevation)
      const observerLocation = data.observer.location;
      console.log('Observer Location:', observerLocation);

      // Extract and log header elements (Birthdate, Time, ?)
      const header = data.table.header;
      console.log('Header:', header);

      // Extract and log rows of position data
      const rows = data.table.rows;

      // Map rows | EX: { entry: { id: 'sun', name: 'Sun' }, cells: [ [Object] ] },
      const celestialBodiesInfo = rows.map(row => {
        const entry = row.entry;

        const bodyId = entry.id; // planet
        const bodyName = entry.name; // Planet Name
        const cells = row.cells; // Object per planet

        // Extract cell data for each celestial body
        const cellData = getCellData(cells, bodyId, bodyName);

        return {
          id: bodyId,
          name: bodyName,
          cellData: cellData
        };
      });

      // Log detailed information for each celestial body
      celestialBodiesInfo.forEach(body => {
        console.log(`Celestial Body: ${body.name}`);
        const body_id = body.id;
        const body_name = body.name;
        body.body_id = body_id;
        body.body_name = body_name;
      });

      // Processing Aspects
      const astrologyAspects = processAstrologyAspects(celestialBodiesInfo);

      // Declination and Right Ascension of Sun
      const sunData = celestialBodiesInfo.find(body => body.name === 'Sun');
      const decOfSun = sunData.cellData.declination;
      const raOfSun = sunData.cellData.rightAscension;
      console.log('Sun Data, Dec of Sun & Ra of Sun: returns normally', sunData, decOfSun, raOfSun);

      //Calculate Local Sidereal Time
      const LST = calculateLST(longitude, new Date());
      console.log('Local Sidereal Time:', LST);

      // Calculate Ascendant (Currently gives back numeric value)
      // TODO: Translate ascendant into constellation sign
      const ascendant = calculateAscendant(LST, latitude, decOfSun, raOfSun);
      console.log('Ascendant:', ascendant);

      // Calculate House Cusps (Check if its working | Equal House System)
      const houseCusps = calculateHouseCusps(ascendant);
      console.log('House Cusps:', houseCusps);

      // Calculate House
      celestialBodiesInfo.forEach(body => {
        body.cellData.house = calculateHouse(body.cellData.azimuth, houseCusps);
      });

      // Transform data for insertion
      const celestialBodyDataToInsert = celestialBodiesInfo.flatMap(body => ({ ...body.cellData, body_id: body.body_id, body_name: body.body_name, user_id: userId }));

      // const interpretations = {};
      console.log(celestialBodyDataToInsert);

      CelestialBodyData.bulkCreate(celestialBodyDataToInsert) // returningn fine
      // .then(data => console.log('Data saved successfully:', data))
      // .catch(error => console.error('Error saving data:', error));

      res.json({
        LST,
        ascendant,
        houseCusps,
        celestialBodiesInfo,
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    });
});


// --------------------------------------------
//   Route for calculating the zodiac / sun sign
// --------------------------------------------
router.post('/zodiac-sign', isAuthenticatedAPI, (req, res) => {
  const { date } = req.body;

  // Uses the calculateZodiacSign function with the provided 'date'
  const zodiacSign = calculateZodiacSign(date);

  res.json({
    zodiacSign
  });
});

// --------------------------------------------
//         Route for calculating aspects
// --------------------------------------------
// can only be internal unless it can fetch planet data
router.get('/astrology-aspects', isAuthenticatedAPI, async (req, res) => {
  try {
    const aspectsData = await AstrologyAspectData.findAll();
    res.json(aspectsData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// --------------------------------------------
//   Route for viewing celestialbodydata with associated astrologyaspectdata
// --------------------------------------------
// router.get('/celestial-with-aspects', async (req, res) => {
//   try {
//     const data = await CelestialBodyData.findAll({
//       include: [
//         {
//           model: AstrologyAspectData,
//           as: 'aspects_1'
//         },
//         {
//           model: AstrologyAspectData,
//           as: 'aspects_2'
//         }
//       ]
//     });

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error
//     });
//   }
// });

module.exports = router;

// let apples = 10
// console.log(apples == 5?"apples is 5":"hahaha")