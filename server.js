require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors')
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helmet = require('helmet');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const { Configuration, OpenAIApi } = require('openai');

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
  origin: ['http://localhost:3001', 'https://www.lightoftwelve.com']
}));

app.use(helmet());

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