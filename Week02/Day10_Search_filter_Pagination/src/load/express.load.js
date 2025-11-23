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
    app.use(express.urlencoded({ extended: true }));
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

    // ⭐⭐ HOME ROUTE HERE (welcome message) ⭐⭐
    // ⭐⭐ HOME ROUTE WITH HTML ⭐⭐
    app.get("/", (req, res) => {
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome</title>

            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    background: #0d0d0d;
                    color: white;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .box {
                    padding: 30px 40px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.1);
                    backdrop-filter: blur(12px);
                }
                h1 {
                    font-size: 2rem;
                    color: #00eaff;
                }
                a {
                    display: inline-block;
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: #00eaff;
                    color: black;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 6px;
                }
            </style>
        </head>

        <body>
            <div class="box">
                <h1>🚀 Welcome to the Backend API</h1>
                <p>Your API is running successfully on Azure.</p>
                <a href="/api/v2">Go to API v2</a>
            </div>
        </body>
        </html>
    `);
    });


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