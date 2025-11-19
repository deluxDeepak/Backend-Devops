// Get the cache from the Redis  or check the cache from redisdb

const { redis } = require("../databse/redis.db");

const checkCache = (key) => {
    return async (req, res, next) => {
        try {
            const data = await redis.get(key);

            if (data) {
                console.log("📦 Cache Hit");
                return res.json(JSON.parse(data));
            }

            console.log("❌ Cache Miss");
            next();
        } catch (err) {
            console.log("Redis error:", err);
            next();
        }
    };
};

module.exports = checkCache;
