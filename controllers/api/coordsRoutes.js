const router = require('express').Router();
require('dotenv').config();
const axios = require('axios');

// /api/coords/get-elevation
router.post('/get-coords', async (req, res) => {
    const { lat, lng } = req.body;
    const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;

    const apiUrl = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${GOOGLE_GEOCODING_API_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.results && data.results[0] && data.results[0].elevation) {
            res.json({ elevation: data.results[0].elevation });
        } else {
            res.status(400).json({ error: 'Failed to get elevation' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;