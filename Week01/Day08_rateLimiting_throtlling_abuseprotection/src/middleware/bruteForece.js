// Logging Brute Forece Proection 

const { redis } = require("../databse/redis.db");

const bruteForce = (limit = 5, windowSec) => {
    return async (req, res, next) => {
        const key = `login-fail:${req.ip}`;
        const fail = await redis.incr(key);

        if (fail === 1) {
            await redis.expire(key, windowSec);
        }

        if (fail > limit) {
            return res.status(229).json({
                success: false,
                message: "To many fail attemp try agin later ",
            });
        }

        next();
    };
};

// Use on login 
module.exports = bruteForce;