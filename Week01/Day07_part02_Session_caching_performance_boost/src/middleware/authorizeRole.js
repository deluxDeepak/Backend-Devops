const { UnauthorizedError } = require("../error")

// Authorize role means only particular can access this 
const authorizeRole = (role) => {
    return (req, res, next) => {
        // If req.user is missing, treat as unauthorized
        if (!req.user || req.user.role !== role) {
            return next(new UnauthorizedError("Access denied from authorizeRole.js"))
        }
        
        // Authorized - continue
        return next();
    }
};

module.exports = authorizeRole;