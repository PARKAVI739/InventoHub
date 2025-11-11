const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

const connectDB = async (uri) => {
  if (!uri) {
    throw new Error('MongoDB connection string is not defined');
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true
    });
    logger.info('Database connection established');
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectDB
};



