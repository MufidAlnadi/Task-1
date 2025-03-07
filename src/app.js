const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const logger = require('./config/logger');
const sequelize = require('./config/database');
const umzug = require('./config/migrations');

const authRoutes = require('../src/routes/authRoutes');
const userRoutes = require('../src/routes/userRoutes');

const app = express();
app.use(helmet());

app.use(cors());
app.use(bodyParser.json());

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

umzug
  .up()
  .then(() => {
    console.log('Migrations are applied successfully!');
  })
  .catch((err) => {
    console.error('Error applying migrations:', err);
  });
app.use((req, res, next) => {
  logger.info(`Request made to: ${req.url} [${req.method}]`);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, mecky!');
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).send('Something went wrong!');
});

module.exports = app;
