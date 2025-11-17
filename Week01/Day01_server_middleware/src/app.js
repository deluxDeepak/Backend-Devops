// Create a main app for routing and middleware implement here 

const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const createApp = () => {
    const app = express()

    // =====================Middleware ================

    // Morgan and Winston used both combinally for logging 
    app.use(cors())
    app.use(helmet())
    app.use(express.json())
    app.use(morgan("dev")) //Loggin for devlopment 

    // =================Health check Route ==============
    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok", uptime: process.uptime() });
    })

    // Not found route  remove the star 
    app.use((req, res) => {
        res.status(404).json({ message: "Not found Route" })
    })

    return app

}

module.exports = { createApp }