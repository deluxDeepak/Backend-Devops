const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const globalErrorHandler = require('../middleware/errorhandler');

// Clean api from routes/index.js 
const router = require('../routes/user.route');
const routes = require('../routes/index')

const loadExpress = (app) => {

    // Body parser 
    app.use(express.json({ limit: "16kb" }));
    app.use(cookieParser({ extended: true, limit: "16kb" }))

    // Securtiy 
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());

    if (process.env.NODE_ENV === "production") {

        app.use(cors({
            origin: process.env.FRONTEND_URL,
            credentials: true
        }))
    } else {
        app.use(cors());
    };

    // LOGGING ==========
    if (process.env.NODE_ENV === "production") {
        app.use(morgan("dev"));

    }

    // ===============Entry point of the API ========================
    app.use("/api/v2", routes);



    // Health check 
    app.use("/health", (req, res) => {
        res.status(200).json({
            message: "OK",
            uptime: process.uptime(),
            timestamp: Date.now()
        });
    });

    // Default 404 route 
    app.use((req, res) => {
        res.status(404).json({ message: "Route not Found" });
    });

    // Load the Global error handler here 
    app.use(globalErrorHandler);

    return app;
};

module.exports = loadExpress;