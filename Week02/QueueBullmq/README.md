# BullMQ Queue System - Email Processing

A comprehensive BullMQ implementation for handling email jobs with Redis as the backing store. This project demonstrates the proper flow and best practices for implementing distributed job queues in Node.js applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Flow](#architecture-flow)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Monitoring & Dashboard](#monitoring--dashboard)
- [Error Handling](#error-handling)
- [Production Considerations](#production-considerations)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project implements a robust email queue system using BullMQ, designed to handle asynchronous email processing with Redis as the message broker. The architecture follows the producer-consumer pattern with proper error handling and monitoring capabilities.

### Key Features

- ✅ **Asynchronous Processing**: Non-blocking email job execution
- ✅ **Scalable Workers**: Multiple worker instances for load distribution  
- ✅ **Error Handling**: Built-in retry mechanisms and failure handling
- ✅ **Monitoring**: Real-time queue monitoring dashboard
- ✅ **Redis Integration**: Reliable message persistence and delivery
- ✅ **Production Ready**: Proper connection management and graceful shutdowns

## 🏗️ Architecture Flow

### Complete Job Lifecycle

```
1. Job Creation (Producer)
   ├── addJobQueue.js creates email jobs
   ├── Jobs added to Redis queue "Test-emailQueue"
   └── Multiple jobs can be batched together

2. Job Storage (Redis)
   ├── Jobs persisted in Redis with metadata
   ├── Queue maintains job state (waiting, active, completed, failed)
   └── Supports job priorities and delays

3. Job Processing (Consumer/Worker)
   ├── Worker polls queue for available jobs
   ├── Processes jobs asynchronously one at a time
   ├── Updates job status in Redis
   └── Emits events on completion/failure

4. Monitoring & Events
   ├── Worker events: completed, failed, active
   ├── Dashboard provides real-time queue insights
   └── Logs job processing details
```

### Data Flow Diagram

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Application   │───▶│  Email Queue │───▶│  Email Worker   │
│  (Job Producer) │    │   (Redis)    │    │  (Job Consumer) │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │                     │
         │                       │                     ▼
         │                       │            ┌─────────────────┐
         │                       │            │  Email Service  │
         │                       │            │ (SMTP/Provider) │
         │                       │            └─────────────────┘
         │                       ▼
         │              ┌──────────────┐
         └─────────────▶│  Dashboard   │
                        │ (Monitoring) │
                        └──────────────┘
```

## 📂 Project Structure

```
QueueBullmq/
├── queue/
│   └── email.queue.js        # Queue configuration and initialization
├── utils/
│   └── addJobQueue.js        # Job creation and batch operations
├── workers/
│   └── email.worker.js       # Worker implementation and event handlers
├── .env                      # Environment configuration
├── server.js                 # Main application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # This documentation
```

### File Responsibilities

| File | Purpose | Key Functions |
|------|---------|---------------|
| `email.queue.js` | Queue definition and Redis connection | Queue creation, connection config |
| `addJobQueue.js` | Job producer/creator | Add jobs to queue, batch operations |
| `email.worker.js` | Job consumer/processor | Process jobs, handle events |
| `server.js` | Application bootstrap | Start server, initialize dashboard |

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** >= 16.x
- **Redis** >= 6.x (local or cloud instance)
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone and navigate to project**
   ```bash
   cd Week02/QueueBullmq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   PORT=6379
   HOST=redis  # or localhost for local Redis
   ```

4. **Start Redis (if running locally)**
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:alpine
   
   # Or using Redis CLI
   redis-server
   ```

5. **Run the application**
   ```bash
   # Start main server with dashboard
   node server.js
   
   # In separate terminal, start worker
   node workers/email.worker.js
   ```

## 💡 Usage Examples

### Basic Job Creation

```javascript
const emailQueue = require('./queue/email.queue');

// Add single email job
await emailQueue.add('send-welcome-email', {
  email: 'user@example.com',
  message: 'Welcome to our platform!',
  senderName: 'Support Team',
  template: 'welcome'
});
```

### Batch Job Processing

```javascript
// Add multiple jobs efficiently
const jobs = [
  { name: 'newsletter', data: { email: 'user1@example.com', type: 'weekly' } },
  { name: 'reminder', data: { email: 'user2@example.com', type: 'payment' } },
  { name: 'notification', data: { email: 'user3@example.com', type: 'update' } }
];

await emailQueue.addBulk(jobs);
```

### Advanced Job Options

```javascript
// Job with priority, delay, and retry options
await emailQueue.add('high-priority-email', {
  email: 'vip@example.com',
  message: 'Urgent notification',
  priority: 'high'
}, {
  priority: 10,           // Higher number = higher priority
  delay: 5000,           // Delay 5 seconds before processing
  attempts: 3,           // Retry up to 3 times on failure
  backoff: {             // Exponential backoff between retries
    type: 'exponential',
    delay: 2000
  }
});
```

### Worker Event Handling

```javascript
const { Worker } = require('bullmq');

const worker = new Worker('Test-emailQueue', async (job) => {
  const { email, message, senderName } = job.data;
  
  // Simulate email sending
  try {
    await sendEmail({
      to: email,
      subject: 'Notification',
      body: message,
      from: senderName
    });
    
    // Update job progress
    await job.updateProgress(100);
    
    return { status: 'sent', timestamp: new Date() };
  } catch (error) {
    throw new Error(`Failed to send email to ${email}: ${error.message}`);
  }
});

// Event listeners
worker.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} failed:`, err.message);
});

worker.on('active', (job) => {
  console.log(`🔄 Processing job ${job.id} for ${job.data.email}`);
});
```

## 🎯 Best Practices

### 1. Queue Design Patterns

#### **Single Responsibility Principle**
```javascript
// ✅ Good: Separate queues for different job types
const emailQueue = new Queue('email-notifications');
const imageQueue = new Queue('image-processing');
const reportQueue = new Queue('report-generation');

// ❌ Bad: One queue for everything
const generalQueue = new Queue('everything');
```

#### **Job Naming Convention**
```javascript
// ✅ Good: Descriptive, hierarchical names
await emailQueue.add('user.welcome.send', data);
await emailQueue.add('user.password.reset', data);
await emailQueue.add('admin.report.weekly', data);

// ❌ Bad: Generic names
await emailQueue.add('email', data);
await emailQueue.add('job1', data);
```

### 2. Error Handling & Resilience

#### **Graceful Error Handling**
```javascript
const worker = new Worker('email-queue', async (job) => {
  try {
    // Validate job data
    if (!job.data.email || !job.data.message) {
      throw new Error('Missing required fields: email, message');
    }
    
    // Process with timeout
    const result = await Promise.race([
      processEmail(job.data),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
      )
    ]);
    
    return result;
  } catch (error) {
    // Log error details
    console.error(`Job ${job.id} failed:`, {
      error: error.message,
      jobData: job.data,
      attempts: job.attemptsMade
    });
    
    // Re-throw to trigger retry mechanism
    throw error;
  }
});
```

#### **Retry Configuration**
```javascript
// Configure intelligent retry behavior
await emailQueue.add('send-email', data, {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2000  // 2s, 4s, 8s, 16s, 32s
  },
  removeOnComplete: 10,    // Keep last 10 completed jobs
  removeOnFail: 50        // Keep last 50 failed jobs for debugging
});
```

### 3. Performance Optimization

#### **Connection Pooling**
```javascript
// ✅ Good: Shared Redis connection
const Redis = require('ioredis');
const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxLoadingTimeout: 1000
});

const emailQueue = new Queue('email-queue', { connection });
const worker = new Worker('email-queue', processor, { connection });
```

#### **Worker Concurrency**
```javascript
// Configure optimal concurrency based on resources
const worker = new Worker('email-queue', processor, {
  concurrency: process.env.NODE_ENV === 'production' ? 10 : 2,
  connection,
  settings: {
    stalledInterval: 30000,    // Check for stalled jobs every 30s
    maxStalledCount: 1         // Max times a job can be stalled
  }
});
```

### 4. Monitoring & Observability

#### **Structured Logging**
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'queue.log' })
  ]
});

worker.on('completed', (job, result) => {
  logger.info('Job completed', {
    jobId: job.id,
    jobName: job.name,
    duration: Date.now() - job.timestamp,
    result
  });
});
```

#### **Health Checks**
```javascript
// Health check endpoint
app.get('/health/queues', async (req, res) => {
  try {
    const waiting = await emailQueue.getWaiting();
    const active = await emailQueue.getActive();
    const completed = await emailQueue.getCompleted();
    const failed = await emailQueue.getFailed();
    
    res.json({
      status: 'healthy',
      queues: {
        email: {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});
```

### 5. Security Considerations

#### **Data Sanitization**
```javascript
// Sanitize job data before processing
const sanitizeJobData = (data) => {
  return {
    email: validator.isEmail(data.email) ? data.email : null,
    message: validator.escape(data.message || ''),
    senderName: validator.escape(data.senderName || 'System')
  };
};

const worker = new Worker('email-queue', async (job) => {
  const sanitizedData = sanitizeJobData(job.data);
  if (!sanitizedData.email) {
    throw new Error('Invalid email address');
  }
  // Process with sanitized data
});
```

#### **Rate Limiting**
```javascript
// Implement rate limiting for email sending
const rateLimiter = new Map();

const checkRateLimit = (email) => {
  const now = Date.now();
  const key = email;
  const limit = rateLimiter.get(key) || { count: 0, resetTime: now + 60000 };
  
  if (now > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = now + 60000;
  }
  
  if (limit.count >= 5) { // 5 emails per minute per address
    throw new Error('Rate limit exceeded');
  }
  
  limit.count++;
  rateLimiter.set(key, limit);
};
```

## 📊 Monitoring & Dashboard

### BullMQ Dashboard Setup

The project includes a built-in monitoring dashboard accessible at `http://localhost:3001/admin/queues`.

#### Dashboard Features

- **Real-time queue statistics**
- **Job state visualization** (waiting, active, completed, failed)
- **Job details and payloads**
- **Retry and failure analysis**
- **Performance metrics**

#### Custom Dashboard Integration

```javascript
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath('/admin/queues');
app.use('/admin/queues', serverAdapter.getRouter());
```

### Metrics Collection

```javascript
// Custom metrics for monitoring
class QueueMetrics {
  constructor() {
    this.metrics = {
      jobsProcessed: 0,
      jobsFailed: 0,
      avgProcessingTime: 0,
      errorRate: 0
    };
  }
  
  recordJobCompletion(duration) {
    this.metrics.jobsProcessed++;
    this.updateAvgProcessingTime(duration);
  }
  
  recordJobFailure() {
    this.metrics.jobsFailed++;
    this.updateErrorRate();
  }
  
  getMetrics() {
    return { ...this.metrics, timestamp: new Date() };
  }
}
```

## 🚨 Error Handling

### Common Error Scenarios

1. **Redis Connection Loss**
```javascript
worker.on('error', (err) => {
  console.error('Worker error:', err);
  if (err.code === 'ECONNREFUSED') {
    // Implement reconnection logic
    setTimeout(() => {
      worker.close();
      createNewWorker();
    }, 5000);
  }
});
```

2. **Job Processing Timeout**
```javascript
const worker = new Worker('email-queue', async (job) => {
  // Set job timeout
  const timeoutId = setTimeout(() => {
    throw new Error(`Job ${job.id} timed out after 30 seconds`);
  }, 30000);
  
  try {
    const result = await processEmail(job.data);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
});
```

3. **Invalid Job Data**
```javascript
const validateJobData = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    message: Joi.string().min(1).max(1000).required(),
    senderName: Joi.string().max(100)
  });
  
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Invalid job data: ${error.message}`);
  }
  return value;
};
```

## 🏭 Production Considerations

### Environment Configuration

```bash
# Production .env
NODE_ENV=production
REDIS_HOST=your-redis-cluster.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password
WORKER_CONCURRENCY=20
LOG_LEVEL=info
METRICS_ENABLED=true
```

### Deployment Checklist

- [ ] **Redis High Availability**: Use Redis Cluster or Sentinel
- [ ] **Worker Scaling**: Deploy multiple worker instances
- [ ] **Resource Limits**: Set memory and CPU limits
- [ ] **Logging**: Centralized logging with structured format
- [ ] **Monitoring**: Set up alerts for queue depth and error rates
- [ ] **Graceful Shutdown**: Handle SIGTERM signals properly
- [ ] **Health Checks**: Implement liveness and readiness probes
- [ ] **Security**: Network isolation and authentication

### Docker Configuration

```dockerfile
# Dockerfile for worker
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "workers/email.worker.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  app:
    build: .
    command: node server.js
    ports:
      - "3001:3001"
    depends_on:
      - redis
    environment:
      - HOST=redis
      - PORT=6379
  
  worker:
    build: .
    command: node workers/email.worker.js
    deploy:
      replicas: 3
    depends_on:
      - redis
    environment:
      - HOST=redis
      - PORT=6379
```

### Performance Tuning

```javascript
// Optimized queue configuration for production
const emailQueue = new Queue('email-queue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,    // Keep last 100 completed jobs
    removeOnFail: 50,         // Keep last 50 failed jobs
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  },
  settings: {
    stalledInterval: 30000,
    maxStalledCount: 1,
    retryProcessDelay: 5000
  }
});
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue: Jobs stuck in "active" state
**Cause**: Worker crashed without completing jobs
```bash
# Solution: Clean stalled jobs
redis-cli EVAL "return redis.call('del', unpack(redis.call('keys', 'bull:email-queue:*')))" 0
```

#### Issue: Memory leak in worker
**Cause**: Event listeners not properly removed
```javascript
// Solution: Proper cleanup
process.on('SIGTERM', async () => {
  await worker.close();
  process.exit(0);
});
```

#### Issue: High Redis memory usage
**Cause**: Too many completed/failed jobs retained
```javascript
// Solution: Aggressive cleanup
const emailQueue = new Queue('email-queue', {
  defaultJobOptions: {
    removeOnComplete: 5,     // Keep fewer completed jobs
    removeOnFail: 10         // Keep fewer failed jobs
  }
});
```

### Debug Commands

```bash
# Check queue status
redis-cli LLEN "bull:email-queue:waiting"
redis-cli LLEN "bull:email-queue:active"
redis-cli LLEN "bull:email-queue:completed"
redis-cli LLEN "bull:email-queue:failed"

# Monitor Redis commands
redis-cli MONITOR

# Check worker health
curl http://localhost:3001/health/queues
```

### Log Analysis

```bash
# Search for failed jobs
grep "Job failed" queue.log | jq .

# Monitor processing times
grep "Job completed" queue.log | jq '.duration' | awk '{sum+=$1; count++} END {print "Average:", sum/count "ms"}'

# Count error types
grep "ERROR" queue.log | jq -r '.error' | sort | uniq -c
```

---

## 📚 Additional Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Created**: November 2025  
**Version**: 1.0.0  
**License**: MIT