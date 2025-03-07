const {Sequelize} = require('sequelize');
const config = require('./config');

const dbConfig = config.development;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
  }
);

module.exports = sequelize;
