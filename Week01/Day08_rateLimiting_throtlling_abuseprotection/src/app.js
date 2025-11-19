const express = require('express');
const loadExpress = require('./load/express.load');
const connectMongoDb = require('./databse/mongo.db');
const { connectRedisDb } = require('./databse/redis.db');


const createApp = async () => {
    const app = express();
    // Connect the Db before app listining 
    await connectMongoDb();

    // connect redis BEFORE routes load
    try {
        await connectRedisDb()
        console.log("Redis DB Connected Successfully");

    } catch (error) {
        console.log("Redis Connection Failed", error);

    }

    loadExpress(app);
    return app;
}

module.exports = createApp;