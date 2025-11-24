L# 📊 Production-Ready Logging Setup Guide

## 🎯 Overview

This guide covers comprehensive logging setup for Node.js applications using Winston, Morgan, and integration with monitoring tools like Grafana, ELK Stack, and more.

---

## 🚀 Why Logging is Critical in Production

### **Problems Without Proper Logging:**
- ❌ Can't debug issues in production
- ❌ No visibility into application performance
- ❌ Unable to track user behavior
- ❌ Security incidents go unnoticed
- ❌ Performance bottlenecks are invisible

### **Benefits of Good Logging:**
- ✅ Quick issue identification and resolution
- ✅ Performance monitoring and optimization
- ✅ Security audit trails
- ✅ Business intelligence and analytics
- ✅ Compliance and regulatory requirements

---

## 📋 Table of Contents

1. [Logging Levels Explained](#-logging-levels-explained)
2. [Winston Setup](#-winston-basic-setup)
3. [Morgan Integration](#-morgan-integration-with-winston)
4. [Daily Rotate Files](#-daily-rotate-files-setup)
5. [Exception Handling](#-exception-handling-in-logging)
6. [Production Setup](#-production-ready-setup)
7. [Monitoring Integration](#-monitoring-tools-integration)
8. [Best Practices](#-best-practices)

---

## 🎚️ Logging Levels Explained

### **Understanding the Difference:**

| Level | When to Use | Example |
|-------|-------------|---------|
| **INFO** | Normal application flow | User logged in, API called successfully |
| **ERROR** | Application errors that are handled | Database connection failed, API returned 500 |
| **EXCEPTION** | Unhandled errors that crash the app | Uncaught exceptions, unhandled promise rejections |

### **Real-World Examples:**

```javascript
// INFO - Normal operation
logger.info('User registration successful', { userId: 123, email: 'user@example.com' });

// ERROR - Handled error
logger.error('Database query failed', { 
  error: error.message, 
  query: 'SELECT * FROM users',
  userId: 123 
});

// EXCEPTION - Unhandled error (these crash your app!)
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { 
    error: error.message, 
    stack: error.stack 
  });
});
```

### **Key Difference:**
- **ERROR**: Your application catches and handles it gracefully
- **EXCEPTION**: Your application doesn't expect it and might crash

---

## 🛠️ Winston Basic Setup

### **Installation:**
```bash
npm install winston winston-daily-rotate-file morgan
```

### **Basic Winston Configuration:**

```javascript
// config/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  // Add metadata if present
  if (Object.keys(meta).length > 0) {
    log += ` | ${JSON.stringify(meta)}`;
  }
  
  // Add stack trace for errors
  if (stack) {
    log += `\nStack: ${stack}`;
  }
  
  return log;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Capture stack traces
    logFormat
  ),
  defaultMeta: { 
    service: process.env.SERVICE_NAME || 'my-app',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'HH:mm:ss' }),
        logFormat
      )
    }),
    
    // File transport for all logs
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d', // Keep logs for 14 days
      zippedArchive: true
    }),
    
    // Separate file for errors only
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d', // Keep error logs longer
      zippedArchive: true
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
    new winston.transports.Console()
  ],
  
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
    new winston.transports.Console()
  ]
});

module.exports = logger;
```

---

## 🔄 Morgan Integration with Winston

### **How Morgan Connects to Winston:**

Morgan captures HTTP requests and forwards them to Winston for centralized logging.

```javascript
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
```

### **Usage in Express App:**

```javascript
// app.js
const express = require('express');
const httpLogger = require('./middleware/logging.middleware');
const logger = require('./config/logger');

const app = express();

// Apply HTTP logging middleware FIRST
app.use(httpLogger);

// Your routes
app.get('/api/users', (req, res) => {
  logger.info('Fetching users', { requestId: req.id });
  res.json({ users: [] });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error in request', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    requestId: req.id
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## 📅 Daily Rotate Files - Why and How?

### **What is Daily Rotate?**
Daily rotation creates new log files every day and manages old files automatically.

### **Why Do We Need It?**

#### **Problems Without Daily Rotation:**
```
logs/
├── application.log  (50GB - impossible to open!)
├── error.log       (10GB - crashes text editors)
```

#### **Solution With Daily Rotation:**
```
logs/
├── application-2024-11-24.log    (20MB - easy to handle)
├── application-2024-11-23.log.gz (compressed old logs)
├── application-2024-11-22.log.gz
├── error-2024-11-24.log
└── error-2024-11-23.log.gz
```

### **Benefits:**
- ✅ **File Size Management**: Each file stays manageable
- ✅ **Performance**: Smaller files = faster searching
- ✅ **Storage**: Automatic compression and cleanup
- ✅ **Debugging**: Easy to find logs from specific dates
- ✅ **Compliance**: Automatic retention policies

### **Real-World Example:**

```javascript
// Without daily rotation - PROBLEM!
app.get('/api/heavy-endpoint', (req, res) => {
  // This endpoint gets 1M requests/day
  logger.info('Processing heavy request'); // Logs pile up in single file!
});

// With daily rotation - SOLUTION!
const dailyRotateTransport = new DailyRotateFile({
  filename: 'logs/api-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH', // Rotate hourly for high-traffic
  maxSize: '100m',
  maxFiles: '7d'
});
```

---

## ⚠️ Exception Handling in Logging

### **Why Handle Exceptions?**

#### **The Problem:**
```javascript
// This will crash your entire application!
app.get('/api/users', (req, res) => {
  const user = null;
  console.log(user.name); // TypeError: Cannot read property 'name' of null
  // APP CRASHES! No logs! Users see 503 errors!
});
```

#### **The Solution:**
```javascript
// config/logger.js - Exception Handlers
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' }),
  new winston.transports.Console()
);

logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' }),
  new winston.transports.Console()
);

// Global exception handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception - Application will exit', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Graceful shutdown
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
});
```

### **Production Exception Handling:**

```javascript
// middleware/error.middleware.js
const logger = require('../config/logger');

const errorHandler = (error, req, res, next) => {
  // Log the error with context
  logger.error('Request Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    requestId: req.id,
    userId: req.user?.id
  });
  
  // Don't expose internal errors to clients
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;
    
  res.status(error.status || 500).json({
    error: message,
    requestId: req.id
  });
};

module.exports = errorHandler;
```

---

## 🏭 Production-Ready Setup

### **Project Structure:**

```
my-app/
├── config/
│   ├── logger.js                 # Winston configuration
│   └── monitoring.js             # Grafana/ELK integration
├── middleware/
│   ├── logging.middleware.js     # Morgan integration
│   └── error.middleware.js       # Error handling
├── services/
│   ├── metrics.service.js        # Custom metrics collection
│   └── alerting.service.js       # Alert integration
├── logs/                         # Log files (auto-generated)
│   ├── application-YYYY-MM-DD.log
│   ├── error-YYYY-MM-DD.log
│   ├── exceptions.log
│   └── rejections.log
├── monitoring/
│   ├── grafana/                  # Grafana dashboards
│   ├── elasticsearch/            # ELK stack configs
│   └── prometheus/               # Prometheus configs
└── docker/
    ├── docker-compose.yml        # Full stack deployment
    └── Dockerfile
```

### **Environment-Specific Configuration:**

```javascript
// config/logger.js
const getLogLevel = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'warn'; // Less verbose in production
    case 'staging':
      return 'info';
    case 'development':
      return 'debug'; // Most verbose for development
    default:
      return 'info';
  }
};

const getTransports = () => {
  const transports = [];
  
  // Always log to files
  transports.push(
    new DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '100m',
      maxFiles: process.env.LOG_RETENTION_DAYS || '30d'
    })
  );
  
  // Console only in development
  if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({
      format: winston.format.colorize()
    }));
  }
  
  // Send to external services in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.ELASTICSEARCH_URL) {
      // Add Elasticsearch transport
      transports.push(/* Elasticsearch config */);
    }
    
    if (process.env.GRAFANA_LOKI_URL) {
      // Add Grafana Loki transport
      transports.push(/* Loki config */);
    }
  }
  
  return transports;
};
```

---

## 📊 Monitoring Tools Integration

### **1. Grafana + Loki Integration**

```javascript
// config/grafana-loki.js
const winston = require('winston');
const LokiTransport = require('winston-loki');

const lokiTransport = new LokiTransport({
  host: process.env.GRAFANA_LOKI_URL || 'http://localhost:3100',
  labels: {
    app: 'my-node-app',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION || '1.0.0'
  },
  json: true,
  format: winston.format.json(),
  replaceTimestamp: true,
  onConnectionError: (err) => console.error('Loki connection error:', err)
});

module.exports = lokiTransport;
```

### **2. ELK Stack (Elasticsearch, Logstash, Kibana)**

```javascript
// config/elasticsearch.js
const winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');

const elasticsearchTransport = new ElasticsearchTransport({
  level: 'info',
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME,
      password: process.env.ELASTICSEARCH_PASSWORD
    }
  },
  index: `app-logs-${new Date().toISOString().slice(0, 7)}`, // Monthly indices
  indexPrefix: 'my-app',
  indexSuffixPattern: 'YYYY.MM',
  messageType: 'log',
  ensureMappingTemplate: true,
  mappingTemplate: {
    index_patterns: ['my-app-*'],
    settings: {
      number_of_shards: 1,
      number_of_replicas: 1
    }
  }
});

module.exports = elasticsearchTransport;
```

### **3. Prometheus Metrics Integration**

```javascript
// services/metrics.service.js
const client = require('prom-client');
const logger = require('../config/logger');

// Create metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const logCounter = new client.Counter({
  name: 'logs_total',
  help: 'Total number of logs by level',
  labelNames: ['level', 'service']
});

// Middleware to collect HTTP metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
      
    // Log metrics
    logger.info('HTTP Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}s`
    });
    
    logCounter.labels('info', 'my-app').inc();
  });
  
  next();
};

module.exports = { metricsMiddleware, httpRequestDuration, logCounter };
```

### **4. Docker Compose for Full Stack**

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - GRAFANA_LOKI_URL=http://loki:3100
    depends_on:
      - elasticsearch
      - loki
    volumes:
      - ./logs:/app/logs

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  kibana:
    image: docker.elastic.co/kibana/kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./monitoring/loki:/etc/loki
    command: -config.file=/etc/loki/local-config.yaml

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml

volumes:
  elasticsearch_data:
  grafana_data:
```

---

## 🎯 Best Practices

### **1. Structured Logging**
```javascript
// ❌ Bad
logger.info('User logged in');

// ✅ Good
logger.info('User authentication successful', {
  userId: user.id,
  email: user.email,
  loginMethod: 'password',
  timestamp: new Date().toISOString(),
  ipAddress: req.ip,
  userAgent: req.get('User-Agent')
});
```

### **2. Log Levels Usage**
```javascript
// Use appropriate log levels
logger.debug('Database query executed', { query, params }); // Development only
logger.info('User action completed', { action, userId }); // Important events
logger.warn('Rate limit approaching', { userId, currentCount }); // Potential issues
logger.error('External API failed', { apiName, error }); // Actual errors
```

### **3. Performance Considerations**
```javascript
// ❌ Bad - Expensive operations in logs
logger.info('Processing data', { 
  data: JSON.stringify(largeObject) // Expensive!
});

// ✅ Good - Log only essential information
logger.info('Processing data', { 
  dataSize: largeObject.length,
  userId: largeObject.userId,
  operation: 'process_data'
});
```

### **4. Security Considerations**
```javascript
// ❌ Bad - Logging sensitive data
logger.info('User login', { 
  email: user.email,
  password: user.password // NEVER LOG PASSWORDS!
});

// ✅ Good - Sanitized logging
logger.info('User login attempt', { 
  email: user.email,
  success: true,
  timestamp: new Date().toISOString()
});
```

---

## 📈 Monitoring Dashboards

### **Grafana Dashboard Config Example:**

```json
{
  "dashboard": {
    "title": "Application Logs Dashboard",
    "panels": [
      {
        "title": "Log Levels Distribution",
        "type": "piechart",
        "targets": [
          {
            "expr": "sum(rate(logs_total[5m])) by (level)",
            "datasource": "Prometheus"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(logs_total{level=\"error\"}[5m])",
            "datasource": "Prometheus"
          }
        ]
      },
      {
        "title": "Recent Error Logs",
        "type": "logs",
        "targets": [
          {
            "expr": "{level=\"error\"}",
            "datasource": "Loki"
          }
        ]
      }
    ]
  }
}
```

---

## 🚨 Alerting Setup

```javascript
// services/alerting.service.js
const logger = require('../config/logger');

class AlertingService {
  static async sendAlert(level, message, metadata) {
    const alert = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME
    };
    
    // Log the alert
    logger.error('ALERT TRIGGERED', alert);
    
    // Send to external alerting services
    if (process.env.SLACK_WEBHOOK_URL) {
      await this.sendSlackAlert(alert);
    }
    
    if (process.env.PAGERDUTY_KEY) {
      await this.sendPagerDutyAlert(alert);
    }
  }
  
  static async sendSlackAlert(alert) {
    // Slack webhook implementation
  }
  
  static async sendPagerDutyAlert(alert) {
    // PagerDuty API implementation
  }
}

module.exports = AlertingService;
```

---

## 📊 Summary

This production-ready logging setup provides:

- ✅ **Centralized Logging**: Winston + Morgan integration
- ✅ **Daily Rotation**: Automatic file management
- ✅ **Exception Handling**: Graceful error management
- ✅ **Monitoring Integration**: Grafana, ELK, Prometheus
- ✅ **Alerting**: Real-time issue notifications
- ✅ **Security**: Sanitized, structured logging
- ✅ **Performance**: Optimized for production
- ✅ **Scalability**: Ready for microservices

### **Next Steps:**
1. Implement the basic Winston setup
2. Add Morgan middleware for HTTP logging
3. Configure daily rotation
4. Set up monitoring dashboards
5. Implement alerting rules
6. Deploy with Docker Compose

This setup scales from small applications to enterprise-level systems and integrates with all major monitoring and alerting platforms. 

