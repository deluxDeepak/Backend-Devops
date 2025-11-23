// Throttling ->Slow down the request 
// RateLimiting -> Stop(Block)

const { redis } = require("../databse/redis.db");

// Use throttle on high traffic route 
// Search ,chat,feed, infinite scroll etc

const throttle = (limit, windowSec) => {
    return async (req, res, next) => {
        const key = `throttle:${req.ip}`;
        const current = await redis.incr(key);

        if (current === 1) {
            await redis.expire(limit, windowSec);
        }

        // If user exceeds limit slow down instead of bloacking 
        if (current > limit) {
            // 2ms ka extra delay ho jayega yehan pe 
            const delay = (current - limit) * 200;
            await new Promise((resolve) => setTimeout(resolve, delay))
        }

        next();
    }
}
// Use only in busy route 
module.exports = throttle;