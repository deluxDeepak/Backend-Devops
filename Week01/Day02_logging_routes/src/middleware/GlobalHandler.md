# Why we need a Global Error Handler

A global error handler is a central place to catch and process errors that happen anywhere in your application. It improves reliability, consistency and maintainability.

## Key reasons

1. Prevent server crashes  
   - Unhandled errors can crash the process. A global handler ensures the server stays running, allowing you to return a controlled response and log the issue.

2. Consistent error responses  
   - Converts raw/uncaught errors into a uniform HTTP response format (status code, message, optional error details). This makes client handling predictable.

3. Centralized logging and monitoring  
   - Send all errors to a single logging pipeline (console, files, remote services). Easier to monitor, alert and aggregate logs.

4. Better debugging and troubleshooting  
   - Include structured details (timestamp, request id, stack trace in non-production) to speed diagnosis.

5. Security and privacy  
   - Hide sensitive error internals from clients in production while keeping enough info for developers in logs.

6. Easier maintenance and policy enforcement  
   - Apply consistent rules for mapping application errors to HTTP status codes, rate-limiting error responses, or notifying teams.

7. Handles async errors reliably  
   - Ensures rejected promises or thrown errors in async routes are caught and handled.

## Raw vs. Formatted error (example)

Raw error (ugly, inconsistent):
```json
{
  "message": "TypeError: Cannot read property 'x' of undefined",
  "stack": "TypeError: Cannot read property 'x' of undefined\n at ..."
}
```

Formatted API response:
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal server error",
  "errorId": "abc123"   // correlate with logs
}
```

## Minimal Express global error handler example

```javascript
// Example: error-handler.js (Express)
function errorHandler(err, req, res, next) {
  // ... log the error (winston/other) with request context ...
  const isProd = process.env.NODE_ENV === 'production';

  const response = {
    status: 'error',
    statusCode: err.statusCode || 500,
    message: isProd ? 'Internal server error' : err.message,
    // include an error id to correlate with logs
    errorId: req.id || undefined
  };

  if (!isProd && err.stack) response.stack = err.stack;
  res.status(response.statusCode).json(response);
}

module.exports = errorHandler;
```

Use it after all routes:
```javascript
app.use(errorHandler);
```

## Quick tips
- Always log full error details (stack, request info) to a secure log store.  
- Return minimal details to clients in production.  
- Map known error types to proper HTTP codes (400, 401, 403, 404, 422, 500).  
- Generate and return an error ID to allow quick log lookup.  
- Ensure async route handlers forward errors to next(err) or use a wrapper to catch promise rejections.

## Summary
A global error handler keeps the server stable, enforces consistent API behavior, centralizes logging, and helps maintain security and observability across your application.