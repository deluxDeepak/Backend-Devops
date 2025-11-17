// middleware/authenticate.js

const config = require("../config");
const { UnauthorizedError, ValidationError } = require("../error");
const jwt = require('jsonwebtoken');

// TODO:Add authenication JWT later 
const authenticate = (req, res, next) => {
    try {
        console.log("Req.user", req.user);
        // req.user jo token me decode karke dala hoga wahi ayega isme 
        // Is se user bar bar get nahi karna parta hai aur authenticated route safe rehta hai 

        console.log("Log the headers ", req.headers);
        const authHeader = req.headers.authorization;
        if (!authHeader || authHeader.startsWith("Bearer")) {
            return next(new ValidationError("Header is not persent: Token not provided"));
        }

        const token = authHeader.split(" ")[1];
        console.log("Token is :", token);

        // Now verify the token ===========
        const decodeToken = jwt.verify(token, config.jwt.acessSecret);

        // Decode token ko user ke sath attach karke bhej dena hai next ke pass
        console.log("req.user before token", req.user);
        req.user = decodeToken;
        console.log("\nreq.user after token", req.user);

        return next();
    } catch (err) {
        return next(err);
    }
};

module.exports = { authenticate };
