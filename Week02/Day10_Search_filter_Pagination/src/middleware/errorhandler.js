// Global Error handler
const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    const message = err.message || "Global Error handler: Something went wrong";

    res.status(status).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = globalErrorHandler;