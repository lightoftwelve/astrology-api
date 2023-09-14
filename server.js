require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors')
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helmet = require('helmet');
const AWS = require('aws-sdk');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const { Configuration, OpenAIApi } = require('openai');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

// Configure and link a session object with the sequelize store
const sess = {
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  cookie: {
    maxAge: 7200000 // expires in 2 hours
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(cors({
  origin: ['http://localhost:3001', 'https://www.lightoftwelve.com', 'https://code.jquery.com', 'https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js']
}));

// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://code.jquery.com', 'https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js'],
//     },
//   },
// }));

// Add express-session and store as Express.js middleware
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});