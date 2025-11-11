const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => { // eslint-disable-line
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error'
  };

  if (err.details) {
    response.details = err.details;
  }

  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  } else {
    logger.warn(err.message);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorHandler
};



