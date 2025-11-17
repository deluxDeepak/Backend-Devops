const express = require('express');
const loadExpress = require('./load/express.load');

const createApp = () => {
    const app = express();


    loadExpress(app);
    return app;
}

module.exports =  createApp ;