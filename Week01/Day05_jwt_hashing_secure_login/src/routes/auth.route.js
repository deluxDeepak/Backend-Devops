// Authcontroller---->Authroutes 


// Usercontoller--->UserROutes 
const express = require('express');
const { register, login, logout } = require('../controller/auth.controller');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// api --->api/v2/auth/register
router.get("/register", register);

// api --->api/v2/auth/login
router.get("/login", login);

// api --->api/v2/auth/logout
router.get("/logout", authenticate, logout);

module.exports = router;