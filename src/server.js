const http = require('http');
const app = require('./app');
const { config } = require('./config');
const { connectDB } = require('./config/db');
const { logger } = require('./utils/logger');

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB(config.mongoUri);

    server.listen(config.port, () => {
      logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});



