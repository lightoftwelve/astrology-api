const router = require('express').Router();
const memberRoutes = require('./memberRoutes');
const celestialRoutes = require('./celestialRoutes');
const coordsRoutes = require('./coordsRoutes');

router.use('/members', memberRoutes);
router.use('/celestial-routes', celestialRoutes);
router.use('/coords', coordsRoutes);

module.exports = router;