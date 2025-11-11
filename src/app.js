const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');
const { requestLogger } = require('./utils/logger');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
const hasBuiltFrontend = () => fs.existsSync(frontendDistPath);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes);

if (hasBuiltFrontend()) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }

    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found'
  });
});

app.use(errorHandler);

module.exports = app;

