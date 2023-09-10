const router = require('express').Router();

const apiRoutes = require('./api');
const celestialRoutes = require('./celestialRoutes');
const dashboardRoutes = require('./dashboardRoutes');

router.use('/', dashboardRoutes);
router.use('/api', apiRoutes);
router.use('/astrology', celestialRoutes);

router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;