# Winston: createLogger() — Quick Guide

createLogger() Winston ka main function hai jo ek logger object banata hai.  
Yeh logger kuch options accept karta hai jisse aap logging behaviour customize kar sakte ho.

## Options overview
1. level  
   - Minimum severity jo record hogi.  
   - Example: `level: "info"` → logs: `info`, `warn`, `error` (debug ignored).

2. format  
   - Log ka shape/structure define karta hai.  
   - Common format options:
     - add timestamp
     - output as JSON
     - colorize console output
     - customize message structure

3. transports  
   - Logs kahan bhejne hain (destination):  
     - Console  
     - File  
     - HTTP  
     - Database  
     - Cloud services (AWS, GCP, etc.)

## Example usage
Ek basic logger example (Winston v3+):

```javascript
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    }),
    new transports.File({ filename: 'app.log', level: 'info' })
  ]
});

logger.info('Server started on port %d', 3000);
logger.error('Unexpected error: %o', new Error('boom'));
```

## Quick tips
- Development: use Console transport with colorized, human-readable format.  
- Production: prefer JSON + File/remote transport (for log aggregation).  
- Use `format.errors({ stack: true })` to include error stacks.  
- Use log levels consistently across services for easier filtering.

## Summary
createLogger() se aap flexible, configurable logging setup bana sakte ho — level decide karo, format choose karo aur transports specify karo jahan logs store/forward karne ho.