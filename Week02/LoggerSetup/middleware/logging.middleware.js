// middleware/logging.middleware.js
const morgan = require('morgan');
const logger = require('../config/logger');


// Custom Morgan format with more details
const morganFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Create Morgan stream that writes to Winston
const morganStream = {
  write: (message) => {
    // Remove newline character and log to Winston
    logger.info(message.trim(), { type: 'http-request' });
  }
};

// Morgan middleware
const httpLogger = morgan(morganFormat, { 
  stream: morganStream,
  skip: (req, res) => {
    // Skip logging for health check endpoints in production
    return process.env.NODE_ENV === 'production' && req.url === '/health';
  }
});

module.exports = httpLogger;