// Connect the db here 
const { createClient } = require("redis");
const config = require("../config");

// let redis;

// redis = createClient({
//     url: config.redis_db.uri
// });

const redis = createClient({
    username: config.redis_db.username,
    password: config.redis_db.password,
    socket: {
        host: config.redis_db.host,
        port: config.redis_db.port,
        reconnectStrategy: (retries) => {
            console.log(`Redis reconnect attempt #${retries}`);
            if (retries > 10) return new Error("Too many retries");
            return retries * 1000;
        }
    }
});

redis.on("connect", () => console.log(" Connected to Redis"));
// Local connection 
// redis.on("connect",()=>console.log("Connected to redish"));
redis.on("ready", () => console.log("🚀 Redis is ready"));
redis.on("error", (err) => console.log(" Redis Error:", err));
redis.on("end", () => console.log("🔚 Redis connection closed"));

const connectRedisDb = async () => {
    await redis.connect();
};
module.exports = { connectRedisDb, redis };

// Set the key and data
// kya chache se nikalna hai
// await client.set('foo', 'bar');

// kya pehle se cache me store hai
// const result = await client.get('foo');
// console.log(result)  // >>> bar


