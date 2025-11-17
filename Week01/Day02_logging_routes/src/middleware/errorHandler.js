// Global Error Handler :Jab bhi koi errror ayega(Controller,Services,Db ,middleware) express use Error ko ek Central middleware ko bhej deta hai 

// Find all types of error 
// ✔ Logs errors (File or console me dikahata hai )
// ✔ Sends structured response
// ✔ Prevents server crash

// Simple Error handler 
// =======================Errorhandler==============
const errorHandler = (err, req, res, next) => {
    //TODO:  Use winston here 
    // To show the eeror at terminal 
    console.error(err);

    const status = err.statusCode || 500;

    res.status(status).json({
        success: false,
        mesage: err.message || "Error from the Error handler:Something went wrong",
        satck: process.env.NODE_ENV === "development" ? err.satck : undefined
    });
}

module.exports = errorHandler



// ======================With LOgger-Winston =======================
// const logger = require("../utils/logger");

// // err is comming from the error handler
// const errorHandler = (err, req, res, next) => {

//     // For message
//     logger.error({
//         message: err.message,
//         stack: err.stack,
//         statusCode: err.statusCode || 500,
//     })

//     // For status code
//     res.status(err.statusCode || 500).json({
//         status: err.status || "error",
//         message: err.message || "Something went wrong"
//     });

// };

// module.exports = errorHandler;







