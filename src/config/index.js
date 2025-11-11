const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test'
    ? path.resolve(process.cwd(), '.env.test')
    : path.resolve(process.cwd(), '.env')
});

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  logs: {
    directory: process.env.LOG_DIRECTORY || path.resolve(process.cwd(), 'logs')
  }
};

module.exports = {
  config
};



