const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { config } = require('../config');

const { combine, timestamp, printf, colorize, errors } = format;

const logDir = config.logs.directory;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  const logMessage = stack || message;
  return `${ts} [${level.toUpperCase()}] ${logMessage}`;
});

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      )
    }),
    new transports.File({
      filename: path.join(logDir, 'app.log')
    })
  ],
  exitOnError: false
});

const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
};

module.exports = {
  logger,
  requestLogger
};



