const router = require('express').Router();
const signinRoutes = require('./signinRoutes');
const celestialRoutes = require('./celestialRoutes');

router.use('/signin', signinRoutes);
router.use('/celestial-routes', celestialRoutes);

module.exports = router;