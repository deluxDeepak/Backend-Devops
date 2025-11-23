# Redis Caching — Middleware Guide

A concise, practical guide to using Redis as a cache in a Node/Express backend. Focus: cache-aside pattern, correct async middleware, key strategy, TTL, invalidation and architecture.

## Overview
Redis as a cache reduces DB load and latency by serving frequently requested data from memory. The most common approach is the "cache-aside" pattern: the application checks cache first, falls back to the database when needed, and stores DB results back into cache.

## Cache-aside (How it works)
When a request arrives:
1. Check Redis for the key.
   - If found -> return cached value (no DB call).
2. If not found -> query the DB.
   - Store the DB result in Redis with a TTL.
   - Return the DB response to the client.

Benefits:
- Fast responses for repeated requests
- Lower DB reads and cost
- Fine-grained control over what to cache and when to invalidate

## Architecture (simple)
![Redis cache-aside architecture](REPLACE_WITH_DIAGRAM_URL_OR_LEAVE_BLANK)
Replace the image URL with your diagram link. Typical components:
- Client (browser/mobile)
- API Gateway / Backend (Express)
- Redis (cache)
- Primary Database (Postgres/MongoDB)

Flow: Client → Backend → (Redis check) → DB if miss → Backend → Redis (set) → Client

## Correct Redis cache middleware (Express example)
- Use async/await.
- Serialize/deserialize JSON.
- Use a clear key naming strategy.
- Set sensible TTL and handle errors gracefully.

```javascript
// Example Express middleware using cache-aside pattern with ioredis or redis client
const DEFAULT_TTL_SEC = 60; // adjust per-data type

function redisCacheMiddleware({ redisClient, getCacheKey, ttl = DEFAULT_TTL_SEC }) {
  return async function cacheMiddleware(req, res, next) {
    try {
      const key = getCacheKey(req); // e.g., `products:list:page=1`
      if (!key) return next();

      const cached = await redisClient.get(key);
      if (cached) {
        // Serve from cache
        const data = JSON.parse(cached);
        return res.json({ source: 'cache', data });
      }

      // Override res.json to capture DB response and cache it
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          // Cache only successful responses and small enough payloads
          await redisClient.setex(key, ttl, JSON.stringify(body));
        } catch (err) {
          // Logging only; do not block response on cache failures
          console.error('Redis set failed', err);
        }
        return originalJson(body);
      };

      next();
    } catch (err) {
      // On cache errors, continue to DB route handler
      console.error('Redis error', err);
      return next();
    }
  };
}

// Usage example:
// getCacheKey: (req) => `products:list:page=${req.query.page || 1}`
// Plug middleware before route handler that reads from DB.
```

## Key naming strategy
- Use predictable, hierarchical keys: resource:action:identifier e.g. products:list:page=1 or user:profile:123
- Include versioning if schema changes: products:v2:list:...
- Avoid extremely long keys; keep human-readable for debugging.

## TTL and sizing
- Set TTL per data volatility (e.g., 30s–5min for fast-changing, hours/days for stable).
- Limit cached object size to avoid memory pressure.
- Monitor cache hit ratio and memory usage.

## Invalidation strategies
- Time-based expiry (TTL) — simplest and reliable.
- Explicit invalidation on write/update/delete: delete relevant keys after DB mutation.
- Use a topic/notification approach for multi-node invalidation if needed.

## Best practices & tips
- Never expose account credentials; Redis should be accessed only by the backend.
- Handle Redis failures gracefully — fail open to keep the app available.
- Use metrics: cache hit ratio, latency, memory usage.
- Consider cache warming for known hot datasets.
- For large payloads (videos/files), prefer signed URLs instead of caching binary blobs.

## Testing checklist
- Verify cache hit/miss behavior and that DB isn't called on hit.
- Test TTL expiry and post-expiry behavior.
- Test invalidation after create/update/delete operations.
- Load test to validate memory and throughput.

## Further reading
- Redis docs: https://redis.io
- Patterns: cache-aside, read-through, write-through, write-behind