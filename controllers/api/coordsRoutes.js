const router = require('express').Router();
require('dotenv').config();
const axios = require('axios');

// Gets longitude, latitude & elevation coordinates from Google API | /api/coords/get-coords
router.post('/get-coords', async (req, res) => {
    const { lat, lng } = req.body;

    const GM_BACKEND_KEY_API = process.env.GM_BACKEND_KEY_API;

    // Construct the API URL with the provided coordinates and API key
    const apiUrl = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${GM_BACKEND_KEY_API}`;

    try {
        // Send a GET request to the Google Maps Elevation API
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log(data);

        // Check if the API response contains elevation data
        if (data.results && data.results[0] && data.results[0].elevation) {
            // If elevation data is present, send it as JSON response
            res.json({ elevation: data.results[0].elevation });
        } else {
            res.status(400).json({ error: 'Failed to get elevation' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;