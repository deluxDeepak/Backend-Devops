// middleware/authenticate.js

// TODO:Add authenication JWT later 
const authenticate = (req, res, next) => {
    try {
        // demo mode: directly attach user object (so authorizeRole works)
        req.user = { id: "demo", name: "Demo Admin", role: "admin" };
        return next();
    } catch (err) {
        return next(err);
    }
};

module.exports = { authenticate };
