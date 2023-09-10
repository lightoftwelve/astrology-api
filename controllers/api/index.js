const router = require('express').Router();
const memberRoutes = require('./memberRoutes');
const celestialRoutes = require('./celestialRoutes');

router.use('/members', memberRoutes);
router.use('/celestial-routes', celestialRoutes);

module.exports = router;