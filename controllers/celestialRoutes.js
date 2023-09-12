const router = require('express').Router();
const { calculateZodiacSign } = require('./helpers/calculateZodiacSign');
const { ZodiacSignData } = require('../models/ZodiacSignData');
const { isAuthenticatedView } = require('../utils/isAuthenticated');

// astrology/zodiac-sign
router.post('/zodiac-sign', async (req, res) => {
  try {
    console.log('Accessed /zodiac-sign route');
    const { date } = req.body;
    const zodiacSign = calculateZodiacSign(date);

    // Fetch the zodiac sign details from the database
    const zodiacSignDataInstance = await ZodiacSignData.findOne({ where: { sign: zodiacSign } });
    const zodiacSignData = zodiacSignDataInstance.get({ plain: true });

    res.json({ zodiacSignData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching celestial data' });
  }
});

// Frontend route to render a form for user input
// astrology/generate-personalized-astrology-natal-chart
router.get('/generate-personalized-astrology-natal-chart', isAuthenticatedView, (req, res) => {
  // Fetch the celestial data interpretations from the database
  // Render the results.hbs view with the fetched data
  res.render('results', { interpretations: fetchedData });
});


module.exports = router;

// ----------------------------------------
//            Daily Horoscopes
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