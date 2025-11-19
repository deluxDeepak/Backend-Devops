## Rate limiting 
Restricting how many request a client can make in specif time 
** Route based  route limit **
write where we can use rate limiting 

### WRite the fucntion use case also and working radish how inc expire ttl work explain its argument also 
```java

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
```




## Throttling
SLowing down the client after certain limit is crossed 
- 1st 10reuest ->normal(fast)
- 2nd 10request ->slower reponse
- After that ->evne slower or blocked 

```java
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
```
Add soft,medium and hard throttle example?


*** Diffrence between rate limiting and thottling  ****

Why throtlling is needed ? 
- prevent service abuse 
- Avoid server overlaod 
- Fair usage for all user 
- Good UX during high trafic 
- Save money on cloud 

Where throttling is used ?

Types of thottling (Smart thottling)
1. Gradual throttling (Soft-hard)
2. User based throttling
3. Role-based throttling
    - Premium user ->high limit 
    - Free users ->low limit
4. Endpoint-specific throttling
    - Routes based throttling

Rate limiting ="Stop" after time 
Throtling ="Slow down" after limit
## Abuse protection:
This prevent bots or attacker from breaking your server 
We create three protection know 
1. Block IP after too many 429 response 
    - STore in reddis block for 2 hours 
2. Login brute-force protection
    - More than 10 failed password ->block
3. Signup spam protection 
    - Limit new account creation by IP/device

4. Api key protection 
    - Developer using the api need rate limit



Generate a summry of this poins ?