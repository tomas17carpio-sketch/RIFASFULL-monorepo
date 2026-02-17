const { Sequelize } = require('sequelize');
const config = require('../../config/config');
const logger = require('../../shared/utils/logger');

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.pass,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: (msg) => logger.debug(msg),
  }
);

// Basic connectivity test
sequelize.authenticate()
  .then(() => logger.info('Database connection has been established successfully.'))
  .catch(err => logger.error('Unable to connect to the database:', err));

module.exports = sequelize;