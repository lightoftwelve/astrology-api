const router = require('express').Router();
const celestialRoutes = require('./celestialRoutes');

router.use('/celestial-routes', celestialRoutes);

module.exports = router;