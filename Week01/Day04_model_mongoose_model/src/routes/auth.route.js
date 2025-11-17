// Authcontroller---->Authroutes 


// Usercontoller--->UserROutes 
const express = require('express');
const { register, login } = require('../controller/auth.controller');

const router = express.Router();

// api --->api/v2/auth/register
router.get("/register", register);

// api --->api/v2/auth/login
router.get("/login", login);

module.exports = router;