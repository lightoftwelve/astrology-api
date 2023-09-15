require('dotenv').config();
const router = require('express').Router();
const axios = require('axios');
const { calculateLST } = require('../helpers/calculateLST');
const { calculateAscendant } = require('../helpers/calculateAscendant');
const { processAstrologyAspects } = require('../helpers/processAstrologyAspects');
const { calculateHouse } = require('../helpers/calculateHouse');
const { calculateHouseCusps } = require('../helpers/calculateHouseCusps');
const { calculateZodiacSign } = require('../helpers/calculateZodiacSign');
const { isAuthenticatedAPI } = require('../../utils/isAuthenticated');
const { CelestialBodyData, AstrologyAspectData, AstrologyHouseData, Member } = require('../../models/index')
const { getAspectDescription } = require('../helpers/getAspectDescription');
// const { getInterpretation } = require('../helpers/getInterpretation');

// ------------------------------------------------------
//     Connection to AstromonyAPI (astronomyapi.com)
// ------------------------------------------------------
if (!process.env.ASTRONOMY_API_KEY) {
  throw new Error('ASTRONOMY_API_KEY environment variable is not defined');
}

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
//            EQUAL HOUSE SYSTEM
//     For generating full birthchart
// --------------------------------------------
// api/celestial-routes/calculate
router.post('/calculate', isAuthenticatedAPI, async (req, res) => {
  const { longitude, latitude, elevation, date, time } = req.body;

  console.log(req.session.member_id);

  if (!req.session.member_id) {
    return res.status(401).json({ error: 'UnAuthorized Access!' }); // Added a return to exit early
  }

  const userId = req.session.member_id;
  const params = {
    longitude,
    latitude,
    elevation,
    from_date: date,
    to_date: date,
    time
  };
  console.log(params);

  try {
    const response = await axios.get(ASTRONOMY_API_URL, { params, headers });

    const data = response.data.data;

    // Extract and log rows of position data
    const rows = data.table.rows;

    // Map rows | EX: { entry: { id: 'sun', name: 'Sun' }, cells: [ [Object] ] },
    const celestialBodiesInfo = rows.map(row => {
      const entry = row.entry;
      const bodyId = entry.id; // planet
      const bodyName = entry.name; // Planet Name
      const cells = row.cells; // Object per planet

      const cellData = getCellData(cells, bodyId, bodyName); // Extract cell data for each celestial body

      if (!cellData || !cellData.azimuth) {
        console.error('Error fetching data for', bodyId);
        throw new Error('Error fetching data');
      }

      return {
        id: bodyId,
        name: bodyName,
        cellData: cellData
      };
    });

    // Log detailed information for each celestial body
    celestialBodiesInfo.forEach(body => {
      const body_id = body.id;
      const body_name = body.name;
      body.body_id = body_id;
      body.body_name = body_name;
    });

    // Processing Aspects
    const astrologyAspects = processAstrologyAspects(celestialBodiesInfo) || [];
    let validAstrologyAspects = astrologyAspects.filter(aspect => aspect !== null);

    // Declination and Right Ascension of Sun
    const sunData = celestialBodiesInfo.find(body => body.name === 'Sun');
    const decOfSun = sunData.cellData.declination;
    const raOfSun = sunData.cellData.rightAscension;

    //Calculate Local Sidereal Time
    const { from_date, time } = params;
    const LST = calculateLST(longitude, from_date, time);

    // Calculate Ascendant (Currently gives back numeric value)
    const ascendant = calculateAscendant(LST, latitude, decOfSun, raOfSun);

    // Calculate House Cusps (Equal House System)
    const houseCusps = calculateHouseCusps(ascendant);

    // Calculate House (Equal House System)
    celestialBodiesInfo.forEach(body => {
      body.cellData.house = calculateHouse(body.cellData.azimuth, houseCusps);
    });

    // Put together a planet & house result array
    const planetAndHouseArray = celestialBodiesInfo.filter(body => body.cellData.bodyName !== "Earth").map(body => ({
      bodyName: body.cellData.bodyName, house: body.cellData.house
    }));

    // Transform data for insertion
    const celestialBodyDataToInsert = celestialBodiesInfo.flatMap(body => ({ user_id: userId, ...body.cellData, body_id: body.body_id, body_name: body.body_name, validAstrologyAspects }));

    // Try to delete existing data for this user (if it exists)
    await CelestialBodyData.destroy({ where: { user_id: userId } });
    // Insert new celestial body data for the user into the CelestialBodyData table
    await CelestialBodyData.bulkCreate(celestialBodyDataToInsert);

    // Try to delete existing data for this user (if it exists)
    await AstrologyAspectData.destroy({ where: { user_id: userId } });

    // Process astrology aspects from celestial body data, filtering null or invalid aspects
    const aspectsToInsert = processAstrologyAspects(celestialBodiesInfo) || [];
    validAstrologyAspects = aspectsToInsert.filter(aspect => aspect !== null);

    // Retrieve aspect descriptions in parallel for valid astrology aspects
    const aspectsWithDescriptions = await Promise.all(
      validAstrologyAspects.map(async aspect => {
        const description = await getAspectDescription(aspect);
        return { user_id: userId, ...aspect, description };
      })
    );

    // Insert new astrology aspect data for the user into the AstrologyAspectData table
    await AstrologyAspectData.bulkCreate(aspectsWithDescriptions);

    // Try to delete existing data for this user (if it exists)
    await AstrologyHouseData.destroy({ where: { user_id: userId } });

    // Insert or update house data for each celestial body for the user into the AstrologyHouseData table
    for (let body of celestialBodiesInfo) {
      await AstrologyHouseData.upsert({
        user_id: userId,
        LST,
        ascendant,
        house_cusps: JSON.stringify(houseCusps),
        house: body.cellData.house,
        bodyName: body.cellData.bodyName,
      });
    }

    res.json({
      LST,
      ascendant,
      houseCusps,
      celestialBodiesInfo,
      planetAndHouseArray,
      validAstrologyAspects
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

// --------------------------------------------
// BELOW ARE NOT APART OF THE PROJECT FOR GRADING :] REFACTORED FOR USE OUTSIDE OF COURSE OBJECTIVE FOR CONTINUED APP CREATION
// --------------------------------------------
// --------------------------------------------
//              GET CELESTIAL DATA
// --------------------------------------------
// api/celestial-routes/celestial-data
router.post('/celestial-data', isAuthenticatedAPI, async (req, res) => {
  const { longitude, latitude, elevation, date, time } = req.body;
  const userId = req.session.member_id;

  if (!longitude || !latitude || !date || !time) {
    return res.status(400).json({ error: 'Required parameters are missing.' });
  }

  try {
    const celestialBodiesInfo = await getCelestialData(longitude, latitude, date, time, elevation);

    // Saving celestial data to the database
    await CelestialBodyData.destroy({ where: { user_id: userId } });
    await CelestialBodyData.bulkCreate(celestialBodiesInfo.map(body => ({ user_id: userId, body_id: body.id, body_name: body.name, ...body.cellData })));

    res.json(celestialBodiesInfo);
    console.log(celestialBodiesInfo)
  } catch (error) {
    console.error('Error fetching celestial data:', error);
    res.status(500).json({ error: 'Error fetching celestial data' });
  }
});

// --------------------------------------------
//          EXTRACT CELESTIAL DATA
// --------------------------------------------
async function getCelestialData(longitude, latitude, date, time, elevation) {
  const params = {
    longitude,
    latitude,
    elevation,
    from_date: date,
    to_date: date,
    time
  };

  try {
    const response = await axios.get(ASTRONOMY_API_URL, { params, headers });
    const data = response.data.data;

    const rows = data.table.rows;

    return rows.map(row => {
      const entry = row.entry;
      const bodyId = entry.id;
      const bodyName = entry.name;
      const cells = row.cells;

      console.log('Entry for body:', entry);

      const cellData = getCellData(cells, bodyId, bodyName);
      if (!cellData || !cellData.azimuth) {
        console.error('Error fetching data for', bodyId);
        throw new Error('Error fetching data');
      }

      return {
        id: bodyId,
        name: bodyName,
        cellData: cellData
      };
    });
  } catch (error) {
    console.error('Error fetching celestial data:', error);
    throw new Error('Error fetching celestial data');
  }
}

// --------------------------------------------
//            ASCENDANT & HOUSES
// --------------------------------------------
// api/celestial-routes/astrology-houses
router.post('/astrology-houses', isAuthenticatedAPI, async (req, res) => {
  const { longitude, latitude, elevation, date, time } = req.body;
  const userId = req.session.member_id;

  if (!longitude || !latitude || !date || !time) {
    return res.status(400).json({ error: 'Required parameters are missing.' });
  }

  try {
    // Fetch celestial data
    const celestialData = await getCelestialData(longitude, latitude, date, time, elevation);

    // Get declination and right ascension of Sun
    const sunData = celestialData.find(body => body.name === 'Sun');
    const decOfSun = sunData.cellData.declination;
    const raOfSun = sunData.cellData.rightAscension;

    // Calculate Local Sidereal Time
    const LST = calculateLST(longitude, date, time);

    // Calculate Ascendant
    const ascendant = calculateAscendant(LST, latitude, decOfSun, raOfSun);

    // Calculate House Cusps
    const houseCusps = calculateHouseCusps(ascendant);

    // Calculate Houses
    celestialData.forEach(body => {
      body.cellData.house = calculateHouse(body.cellData.azimuth, houseCusps);
    });

    const planetAndHouseArray = celestialData
      .filter(body => body.cellData.bodyName !== "Earth") // Filtering out Earth
      .map(body => ({
        bodyName: body.cellData.bodyName,
        house: body.cellData.house
      }));

    await AstrologyHouseData.destroy({ where: { user_id: userId } });

    // Save celestial body's astrology house data
    for (let body of celestialData) {
      await AstrologyHouseData.upsert({
        user_id: userId,
        LST,
        ascendant,
        house_cusps: JSON.stringify(houseCusps),
        house: body.cellData.house,
        bodyName: body.cellData.bodyName,
      });
    }

    res.json({
      LST,
      ascendant,
      houseCusps,
      planetAndHouseArray
    });

  } catch (error) {
    console.error('Error fetching astrological info:', error);
    res.status(500).json({ error: 'Error fetching astrological info' });
  }
});

// --------------------------------------------
//                ASPECTS
// --------------------------------------------
// api/celestial-routes/astrology-aspects
router.post('/astrology-aspects', isAuthenticatedAPI, async (req, res) => {
  const { longitude, latitude, elevation, date, time } = req.body;
  const userId = req.session.member_id;

  if (!longitude || !latitude || !date || !time) {
    return res.status(400).json({ error: 'Required parameters are missing.' });
  }

  try {
    const celestialBodiesInfo = await getCelestialData(longitude, latitude, date, time, elevation);

    const astrologyAspects = processAstrologyAspects(celestialBodiesInfo) || []; // Calculating aspects

    const validAstrologyAspects = astrologyAspects.filter(aspect => aspect !== null); // Filter out invalid aspects

    // Loop through the valid astrology aspects and use upsert
    for (let aspect of validAstrologyAspects) {
      await AstrologyAspectData.upsert({
        user_id: userId,
        ...aspect
      });
    }
    console.log(validAstrologyAspects);
    res.json({ validAstrologyAspects }); // Return the valid aspects

  } catch (error) {
    console.error('Error processing astrology aspects:', error);
    res.status(500).json({ error: 'Error processing astrology aspects' });
  }
});

// --------------------------------------------
//            ZODIAC / SUN SIGN
// --------------------------------------------
// api/celestial-routes/zodiac-sign
router.post('/zodiac-sign', isAuthenticatedAPI, async (req, res) => {
  const userId = req.session.member_id;

  try {
    const { date } = req.body;
    const zodiacSign = calculateZodiacSign(date);

    const memberData = await Member.update(
      { zodiac_sun_sign: zodiacSign },
      { where: { id: userId } }
    );

    if (!memberData[0] === 0) {  // Sequelize's update method returns an array where the first element indicates the number of records updated
      return res.status(404).json({ error: 'No user found with this id' });
    }

    res.json({
      zodiacSign
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

// let apples = 10
// console.log(apples == 5?"apples is 5":"hahaha")