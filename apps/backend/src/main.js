const app = require('./app');
const config = require('./config/config');
const logger = require('./shared/utils/logger');
// Ensure DB connection is initialized
require('./infrastructure/database/sequelize');

const port = config.app.port;

const server = app.listen(port, () => {
  logger.info(`Server running in ${config.app.env} mode on port ${port}`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});