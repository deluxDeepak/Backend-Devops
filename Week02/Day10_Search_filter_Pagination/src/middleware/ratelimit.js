// Rate limitting middleware basic 

const { redis } = require("../databse/redis.db");


// ratelimit on route ->login 
const rateLimit = (limit, windowSec) => {
    return async (req, res, next) => {
        const key = `rate:${req.ip}`;
        const current = await redis.incr(key);
        console.log("Current value from redis: ", current);

        // If initial request 1 pe set ho jayega iska key and expiry 
        if (current === 1) {
            await redis.expire(key, windowSec);
        }
        if (current > limit) {
            return res.status(429).json({
                messgae: "Too many reuests. Try agin later after Sometime.",
                retryAfter: await redis.ttl(key)
            });

        }
        next();
    }
}

module.exports = rateLimit;