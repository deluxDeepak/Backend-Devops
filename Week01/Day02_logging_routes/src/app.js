const express = require('express')
const loadExpress = require('./loader/express.loader')

const createApp = () => {
    const app = express()

    // Load the all express and Routes 
    loadExpress(app);
    return app
}

module.exports = { createApp }