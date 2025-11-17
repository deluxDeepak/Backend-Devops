const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const errorHandler = require('../middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const router = require('../routes/user.routes');

const loadExpress = (app) => {

    // ================Middleware setup =============
    // Body parser
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));

    // Security middleware
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    // CORS setup only production me frontendurl lega nahi to development me sab jagah se allow hai 
    if (process.env.NODE_ENV === "production") {
        app.use(cors({
            origin: process.env.FRONTEND_URL,
            credentials: true
        }));
    } else {
        app.use(cors());
    }

    // Rate limit package use kar sakte hai 
    app.use("/api", rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200
    }));


    // Logging(Console pe) only in Development  production me cpu usage badh jayega 
    if (process.env.NODE_ENV === "development") {
        // Console me log karta hai  GET /favicon.ico 404 0.228 ms - 29
        app.use(morgan("dev"))
    }

    app.get("/health", (req, res) => {
        res.status(200).json({
            message: "OK",
            uptime: process.uptime(),
            timestamp: Date.now()
        })
    })

    // Entry point of every Routes 
    app.use("/api/v1",router);

    // Default 404 route - always before error handler
    app.use((req, res) => {
        res.status(404).json({ message: "Route not Found" })
    })

    // GLobal Error hanlder- Always in the last 
    app.use(errorHandler)
    return app;
}

module.exports = loadExpress;
