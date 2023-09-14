require('dotenv').config();
const router = require('express').Router();
const { isAuthenticatedView } = require('../utils/isAuthenticated');
const { CelestialBodyData, AstrologyAspectData, AstrologyHouseData, ZodiacSignData, Member, AspectDescriptionData } = require('../models/index');
const { getAspectDescription } = require('./helpers/getAspectDescription');

// --------------------------------------------
//         BIRTHCHART GENERATOR
// --------------------------------------------
// astrology/generate-personalized-astrology-natal-chart
router.get('/generate-personalized-astrology-natal-chart', isAuthenticatedView, async (req, res) => {
  try {
    const userId = req.session.member_id;
    console.log(req.session.member_id);

    // Fetch member's data
    const memberData = await Member.findByPk(userId);

    // Check if the member exists
    if (!memberData) {
      return res.status(404).send("User not found");
    }

    // Fetch astrology house data
    const houseDataInstance = await AstrologyHouseData.findOne({
      where: { user_id: userId }
    });
    console.log('House Data Instance', houseDataInstance);

    // Fetch celestial body data
    const celestialBodies = await CelestialBodyData.findAll({
      where: { user_id: userId }
    });
    console.log('celestial Body instance', celestialBodies);

    // Fetch astrology aspect data
    const validAstrologyAspects = await AspectDescriptionData.findAll({
      where: { user_id: userId }
    });

    // Assemble the userData object
    const userData = {
      LST: houseDataInstance ? houseDataInstance.LST : null,
      ascendant: houseDataInstance ? houseDataInstance.ascendant : null,
      houseCusps: houseDataInstance ? houseDataInstance.house_cusps.split(',') : [],
      celestialBodiesInfo: celestialBodies ? celestialBodies.filter(body => body.body_name.toLowerCase() !== "earth")  // Filter out "earth"
        .map(body => ({
          id: body.body_id,
          name: body.body_name,
          cellData: {
            house: body.house
          }
        })) : [],
      validAstrologyAspects: validAstrologyAspects ? validAstrologyAspects.map(aspect => ({
        body_id_1: aspect.body_id_1,
        body_name_1: aspect.body_name_1,
        aspect: aspect.aspect,
        body_id_2: aspect.body_id_2,
        body_name_2: aspect.body_name_2,
        description: aspect.description,
      })) : []
    };
    console.log('User Data Return', userData);
    res.render("generatedChart", {
      ...userData,
      logged_in: req.session.logged_in
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// --------------------------------------------
//         ZODIAC SUN SIGN
// --------------------------------------------
// astrology/zodiac-sign
router.get('/zodiac-sign', isAuthenticatedView, async (req, res) => {

  const userId = req.session.member_id;
  console.log(req.session.member_id);

  try {
    console.log('Accessed /zodiac-sign route');

    // Fetch user's saved zodiac sign
    const userDataInstance = await Member.findOne({ where: { id: userId }, attributes: ['zodiac_sun_sign'] });
    const { zodiac_sun_sign } = userDataInstance.get({ plain: true });

    // Fetch the zodiac sign details from the database
    const zodiacSignDataInstance = await ZodiacSignData.findOne({ where: { sign: zodiac_sun_sign } });
    const zodiacSignData = zodiacSignDataInstance.get({ plain: true });

    res.render("zodiacSign", {
      zodiacSignData,
      logged_in: req.session.logged_in
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching zodiac sign data' });
  }
});

// --------------------------------------------
//         EXPLORE ASPECTS
// --------------------------------------------
// astrology/explore-astrology-aspects
router.get('/explore-astrology-aspects', isAuthenticatedView, async (req, res) => {
  try {
    // Provide a list of celestial bodies and aspects for dropdown options
    const celestialBodies = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "neptune", "uranus", "pluto"];
    const aspects = ["conjunction", "sextile", "opposition", "trine", "square"];

    res.render("exploreAspects", {
      celestialBodies,
      aspects,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// --------------------------------------------
//         GET ASPECT DESCRIPTION
// --------------------------------------------
// astrology/get-aspect-description
router.post('/get-aspect-description', isAuthenticatedView, async (req, res) => {
  try {
    console.log("Reached the /get-aspect-description route!");

    const { body1, body2, aspect } = req.body;

    const description = await getAspectDescription({
      aspect: aspect,
      body_id_1: body1,
      body_id_2: body2
    });
    console.log(description);

    const celestialBodies = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "neptune", "uranus", "pluto"];
    const aspects = ["conjunction", "sextile", "opposition", "trine", "square"];

    if (body1 === body2) {
      res.render("exploreAspects", {
        error: "Please select two different celestial bodies.",
        celestialBodies: celestialBodies,
        aspects: aspects,
        logged_in: req.session.logged_in
      });
      return;
    }

    res.render("aspectDescription", {
      body_id_1: body1,
      body_id_2: body2,
      aspect: aspect,
      description: description,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// --------------------------------------------
//         Route for calculating aspects
// --------------------------------------------
router.get('/astrology-aspects', async (req, res) => {
  axios.get(ASTRONOMY_API_URL, { params, headers })
  try {
    const aspectsData = await AstrologyAspectData.findAll();
    res.json(aspectsData);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;

// ----------------------------------------
//     Daily Horoscopes | Future Project
// ----------------------------------------
// router.get('/daily-horoscopes/:date', (req, res) => {
//   const { date } = req.params;
//
//   // Fetching the data by date (or another suitable identifier) from the database
//   CelestialBodyData.findAll({ where: { date: date } })
//     .then(data => {
//       // Data is an array of CelestialBodyData objects | send it as-is or transform it
//       res.json(data);
//     })
//
//     .catch(error => {
//       console.error('Error fetching celestial data:', error);
//       res.status(500).json({ error: 'Error fetching celestial data' });
//     });
// });

// ------------------------------------------
//     Astrology Chatbot | Future Project
// ------------------------------------------
// axios.get('/celestial-assistant/date-here') 
//   .then(response => {
//     const celestialData = response.data;
//   })
//
//   .catch(error => {
//     console.error('Error fetching celestial data for chat:', error);
//   });
//
// router.post('/calculate', (req, res) => {
//   const { longitude, latitude, elevation, date, time } = req.body;
//   const calculatedData = calculateCelestialData(longitude, latitude, elevation, date, time);
// });