// middleware/authenticate.js

// Jab routes like logout,profile,changePicture,updateInfo etc 

const config = require("../config");
const { UnauthorizedError } = require("../error");
const jwt = require('jsonwebtoken');


// Frontend kuch aisa send karta hai logout ke time wahan se hum accesstoken lete hai 
// fetch("/api/logout", {
//   method: "GET",
//   headers: {
//     "Authorization": `Bearer ${accessToken}`
//   }
// });


// Authenticate Logout ke time karte hai 
const authenticate = (req, res, next) => {
    try {

        console.log("Log the headers ", req.headers);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return next(new UnauthorizedError("Header is not persent: Token not provided"));
        }

        const token = authHeader.split(" ")[1];
        console.log("AccessToken from the header logout--->Authencate file is  :", token);

        // Verify the token ===========
        const decodeToken = jwt.verify(token, config.jwt.acessSecret);
        console.log("DecodeToken User from authencate.js ", decodeToken);

        // Decode token ko user ke sath attach karke bhej dena hai next ke pass
        // ====================================================
        // Request object is expandabale 
        // ====================================================
        req.user = decodeToken; //Custome object attach
        req.hellow = "hellow world  ";
        return next();
    } catch (err) {
        return next(new UnauthorizedError(`Token invalid or Expire ${err} `));
    }
};

module.exports = { authenticate };
