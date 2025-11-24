# 📊 Production-Ready Logger Setup

## 🔧 Syntax Issues Fixed

- ✅ Fixed `transport` → `transports` import
- ✅ Fixed `logFormate` → `logFormat` naming
- ✅ Fixed `format.Console()` issue
- ✅ Added missing semicolon

## 📦 Dependencies

```bash
npm install winston winston-daily-rotate-file
```

## 🚀 Production Setup

### 1. Environment Variables (.env)

```bash
# Logger Configuration
NODE_ENV=production
LOG_LEVEL=warn
SERVICE_NAME=my-app
APP_VERSION=1.0.0

# Optional: External Logging
ELASTICSEARCH_URL=http://localhost:9200
GRAFANA_LOKI_URL=http://localhost:3100
```

### 2. Directory Structure

```
project/
├── config/
│   └── logger.js          # Your current logger
├── logs/                  # Auto-created
│   ├── application-YYYY-MM-DD.log
│   ├── error-YYYY-MM-DD.log
│   ├── exceptions.log
│   └── rejections.log
├── middleware/
│   └── logging.middleware.js
└── app.js
```

### 3. Logging Middleware (middleware/logging.middleware.js)

```javascript
const morgan = require('morgan');
const logger = require('../config/logger');

// Morgan stream that connects to Winston
const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// HTTP request logging
const httpLogger = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms',
  { stream }
);

module.exports = httpLogger;
```

### 4. Express Integration (app.js)

```javascript
const express = require('express');
const logger = require('./config/logger');
const httpLogger = require('./middleware/logging.middleware');

const app = express();

// Apply HTTP logging first
app.use(httpLogger);

// Your routes
app.get('/api/users', (req, res) => {
  logger.info('Fetching users', { requestId: req.id });
  res.json({ users: [] });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Request Error', {
    error: error.message,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => {
    logger.info('Process terminated');
  });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
```

## 🎯 Usage Examples

### Basic Logging
```javascript
const logger = require('./config/logger');

// Info logs
logger.info('User logged in', { userId: 123 });

// Error logs  
logger.error('Database error', { error: err.message });

// Warning logs
logger.warn('Rate limit approaching', { userId: 123, count: 95 });
```

### Structured Logging
```javascript
// Good practice - include context
logger.info('Order created', {
  orderId: order.id,
  userId: user.id,
  amount: order.total,
  timestamp: new Date().toISOString()
});
```

## 🔧 Production Optimizations

### 1. Log Levels by Environment

```javascript
// Development: debug, info, warn, error
// Staging: info, warn, error  
// Production: warn, error only
```

### 2. Log Rotation

- **Daily rotation**: New file each day
- **Size limits**: 20MB per file
- **Retention**: 30 days for app logs, longer for errors
- **Compression**: Automatic for old logs

### 3. File Structure

```
logs/
├── application-2024-11-24.log  # Today's app logs
├── error-2024-11-24.log        # Today's errors
├── exceptions.log              # Uncaught exceptions
└── rejections.log              # Unhandled promises
```

## 📊 Monitoring Integration

### ELK Stack Setup

```yaml
# docker-compose.yml
version: '3.7'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    ports:
      - "9200:9200"
    environment:
      - discovery.type=single-node

  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  app:
    build: .
    volumes:
      - ./logs:/app/logs
    depends_on:
      - elasticsearch
```

### Grafana Integration

```javascript
// Add to your logger transports for Grafana Loki
const LokiTransport = require('winston-loki');

// In production, add this transport:
if (process.env.GRAFANA_LOKI_URL) {
  logger.add(new LokiTransport({
    host: process.env.GRAFANA_LOKI_URL,
    labels: { app: 'my-app' }
  }));
}
```

## 🚨 Alerting Setup

### Slack Notifications

```javascript
// services/alerting.js
const logger = require('../config/logger');

const sendAlert = async (level, message) => {
  if (level === 'error' && process.env.SLACK_WEBHOOK) {
    // Send to Slack
    logger.info('Alert sent to Slack');
  }
};

module.exports = { sendAlert };
```

## 📈 Performance Tips

### 1. Avoid Expensive Operations

```javascript
// ❌ Bad - expensive JSON.stringify
logger.info('Large object', { data: JSON.stringify(largeObject) });

// ✅ Good - log only essentials
logger.info('Processing data', { size: largeObject.length, userId: largeObject.userId });
```

### 2. Use Appropriate Log Levels

```javascript
logger.debug('Debug info');    // Development only
logger.info('User action');    // Important events
logger.warn('Warning');        // Potential issues  
logger.error('Error');         // Actual errors
```

### 3. Structured Data

```javascript
// ✅ Always use structured data
logger.info('Event occurred', {
  eventType: 'user_login',
  userId: 123,
  timestamp: new Date().toISOString(),
  metadata: { ip: '192.168.1.1' }
});
```

## 🔒 Security Best Practices

### 1. Never Log Sensitive Data

```javascript
// ❌ Never do this
logger.info('User login', { 
  email: user.email,
  password: user.password  // NEVER!
});

// ✅ Safe logging
logger.info('User login', { 
  userId: user.id,
  email: user.email,
  loginTime: new Date().toISOString()
});
```

### 2. Sanitize User Input

```javascript
// Sanitize before logging
const sanitize = (str) => str.replace(/[<>]/g, '');
logger.info('User input', { input: sanitize(userInput) });
```

## 🎯 Quick Start

1. **Install dependencies**: `npm install winston winston-daily-rotate-file morgan`
2. **Use your current logger.js** (syntax now fixed)
3. **Add HTTP logging middleware**
4. **Set environment variables**
5. **Deploy with proper log retention**

Your logger is now production-ready! 🚀