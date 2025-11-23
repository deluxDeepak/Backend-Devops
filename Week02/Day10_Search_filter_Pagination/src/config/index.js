// Load correct ENV configuartion 
const dotenv = require('dotenv')
// Absolute path de do idhar 
dotenv.config({ path: "./.env.development" })
// For deployement azure will ignore the upper line 
// dotenv.config();

// database ->mongo.db.js
// utils-->jwt.js

// ye undeifne ata hai jab tak .env sirf na lika ho 
// console.log(process.env.DB_MONGO_URI)
// console.log(process.env.PORT)

// DB_REDIS_USERNAME=default
// DB_REDIS_PASSWORD=VIAoY9CteW0ODSLI6UCEfIbJpNDZjjE5
// DB_REDIS_HOST=redis-17511.c301.ap-south-1-1.ec2.cloud.redislabs.com
// DB_REDIS_PORT=17511
const config = {
    app: {
        port: process.env.PORT || 5000,
        nodeEnv: process.env.NODE_ENV
    },
    MOGO_db: {
        uri: process.env.DB_MONGO_URI,
        pass: process.env.DB_MONGO_PASS,
        user: process.env.DB_MONGO_USER
    },

    redis_db: {
        // uri:process.env.DB_REDIS_URI
        username: process.env.DB_REDIS_USERNAME,
        password: process.env.DB_REDIS_PASSWORD,
        host: process.env.DB_REDIS_HOST,
        port: process.env.DB_REDIS_PORT,


    },

    jwt: {
        acessSecret: process.env.ACCESS_TOKEN_SECRET,
        acessExpire: process.env.ACCESS_TOKEN_EXPIRY,
        refreshSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshExpire: process.env.REFRESH_TOKEN_EXPIRY
    },
    azure: {
        accountName: process.env.AZURE_STORAGE_NAME,
        accountKey: process.env.AZURE_STORAGE_KEY,
        containerName: process.env.AZURE_CONTAINER_NAME,
    }
}

module.exports = config
