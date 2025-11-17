// Global Error handler 
const globalErrorHandler = (err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        success: false,
        message: err.meassage || "Global Error handler: Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,

    })
}
module.exports = globalErrorHandler;