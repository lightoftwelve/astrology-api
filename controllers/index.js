const router = require('express').Router();
const AWS = require('aws-sdk');
const apiRoutes = require('./api');
const celestialRoutes = require('./celestialRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Initialize the S3 client
const s3 = new AWS.S3();

router.get('/images/:folderName/:imageName', async (req, res) => {
  try {
    // Extract the image name from the request params
    const folderName = req.params.folderName;
    const imageName = req.params.imageName;

    // Construct the S3 key based on naming convention
    const s3Key = `images/${folderName}/${imageName}`;

    // Specifing S3 bucket and S3 key
    const params = {
      Bucket: 'lightoftwelve-astrology-app-images',
      Key: s3Key,
    };

    // Retrieve the image from S3
    const data = await s3.getObject(params).promise();

    // Set response headers
    res.setHeader('Content-Type', data.ContentType);

    // Send the image data as the response
    res.send(data.Body);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the image');
  }
});

router.use('/', dashboardRoutes);
router.use('/api', apiRoutes);
router.use('/astrology', celestialRoutes);

router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = router;