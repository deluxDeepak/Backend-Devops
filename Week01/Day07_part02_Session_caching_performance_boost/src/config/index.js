// Load correct ENV configuartion 
const dotenv = require('dotenv')
// Absolute path de do idhar 
dotenv.config({ path: "./.env.development" })

// database ->mongo.db.js
// utils-->jwt.js

// ye undeifne ata hai jab tak .env sirf na lika ho 
// console.log(process.env.DB_MONGO_URI)
// console.log(process.env.PORT)
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
    // TODO:Add more config here like JWt Secret claudinary and aws or azura 
    jwt: {
        acessSecret: process.env.ACCESS_TOKEN_SECRET,
        acessExpire: process.env.ACCESS_TOKEN_EXPIRY,
        refreshSecret: process.env.REFRESH_TOKEN_SECRET,
        refreshExpire: process.env.REFRESH_TOKEN_EXPIRY
    }
}

module.exports = config
