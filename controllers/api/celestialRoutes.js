require('dotenv').config();
const router = require('express').Router();
const axios = require('axios');
const { calculateLST } = require('../helpers/calculateLST');
const { calculateAscendant } = require('../helpers/calculateAscendant');
const { processAstrologyAspects } = require('../helpers/processAstrologyAspects');
const { calculateHouse } = require('../helpers/calculateHouse');
const { calculateHouseCusps } = require('../helpers/calculateHouseCusps');
// const { getInterpretation } = require('../helpers/getInterpretation');
const CelestialBodyData = require('../../models/celestialBodyData');

if (!process.env.ASTRONOMY_API_KEY) {
  throw new Error('ASTRONOMY_API_KEY environment variable is not defined');
}

const ASTRONOMY_API_URL = process.env.ASTRONOMY_API_URL;
const ASTRONOMY_API_ID = process.env.ASTRONOMY_API_ID;
const ASTRONOMY_API_KEY = process.env.ASTRONOMY_API_KEY;

const authString = Buffer.from(`${process.env.ASTRONOMY_API_ID}:${process.env.ASTRONOMY_API_KEY}`).toString('base64');
const headers = {
  Authorization: `Basic ${authString}`
};

// TODO: Translate ascendant into constellation sign
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

// function logCelestialData(cellData) {
//   console.log('Date:', cellData.date);
//   console.log('Altitude (degrees):', cellData.altitude);
//   console.log('Azimuth (degrees):', cellData.azimuth);
//   // ... (Print other cell data)
//   console.log('---'); // Separator
//   // });
//   console.log('===================='); // Separator)
// }

// Equal House System
// Route for calculating birthchart data
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

  axios.get(ASTRONOMY_API_URL, { params, headers })
    .then(response => {
      const data = response.data.data;

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
        // logCelestialData(body.cellData);
      });

      // Processing Aspects
      const astrologyAspects = processAstrologyAspects(celestialBodiesInfo);

      // Declination and Right Ascension of Sun
      const sunData = celestialBodiesInfo.find(body => body.name === 'Sun');
      const decOfSun = sunData.cellData.declination;
      const raOfSun = sunData.cellData.rightAscension;

      //Calculate Local Sidereal Time
      const LST = calculateLST(longitude, new Date());
      console.log('Local Sidereal Time:', LST);

      // Calculate Ascendant (Currently gives back numeric value)
      const ascendant = calculateAscendant(LST, latitude, decOfSun, raOfSun);
      console.log('Ascendant:', ascendant);

      // Calculate House Cusps (Check if its working | Equal House System)
      const houseCusps = calculateHouseCusps(ascendant);
      console.log('House Cusps:', houseCusps);
      // Calculate house cusps
      // const houseCusps = [];
      // for (let i = 0; i < 12; i++) {
      //   houseCusps[i] = (ascendant + i * 30) % 360;
      // }
      // console.log('House Cusps:', houseCusps);

      // Calculate House
      celestialBodiesInfo.forEach(body => {
        body.cellData.house = calculateHouse(body.cellData.azimuth, houseCusps);
      });

      // Transform data for insertion
      const celestialBodyDataToInsert = celestialBodiesInfo.flatMap(body => ({ ...body.cellData, body_id: body.body_id, body_name: body.body_name }))

      // const interpretations = {};
      console.log(celestialBodyDataToInsert);
      // celestialBodiesInfo.forEach(body => {
      //     const houseNumber = body.house;
      //     const interpretation = getInterpretation(body.name, houseNumber, null);
      //     interpretations[body.name] = interpretation;
      // });

      CelestialBodyData.bulkCreate(celestialBodyDataToInsert)
        .then(data => console.log('Data saved successfully:', data))
        .catch(error => console.error('Error saving data:', error));

      // const sunInfo = celestialBodiesInfo.find(body => body.name === 'Sun');
      // const houseNumber = sunInfo.house;
      // const interpretation = getInterpretation('Sun', houseNumber, null);
 
      res.json({
        LST,
        ascendant,
        houseCusps,
        celestialBodiesInfo,
        // sunInterpretation: interpretation, 
        // interpretations
      });

      // res.render('results', {
      //   interpretations
      // });

    })
    .catch(error => {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    });
});

module.exports = router;

// let apples = 10
// console.log(apples == 5?"apples is 5":"hahaha")