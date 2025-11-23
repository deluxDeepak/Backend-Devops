// Authcontroller---->Authroutes 

// Usercontoller--->UserROutes 
const express = require('express');
const { register, login, logout } = require('../controller/auth.controller');
const { authenticate } = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/auth.schema');
const rateLimit = require('../middleware/ratelimit');
const bruteForce = require('../middleware/bruteForece');

const router = express.Router();

// api --->api/v2/auth/register
// Signup spam protection by ratelimit karke 
// rateLimit(3,600) ->3 signup per 10 minute using ip 
router.post(
    "/register",
    validate(registerSchema),
    rateLimit(3, 600),
    register,
);

// api --->api/v2/auth/login
// schema ko validate karna hai 
// rateLimit(5,60)->5 login per minute 
// bruteForce(5,300) -> after 5 in 5 minute attemps say try after some time 
router.post(
    "/login",
    bruteForce(5, 300),
    rateLimit(5, 60),
    validate(loginSchema),
    login
);

// When you call /profile or /logout, add header:
// api --->api/v2/auth/logout
router.post("/logout", authenticate, logout);

module.exports = router;