// Authcontroller---->Authroutes 


// Usercontoller--->UserROutes 
const express = require('express');
const { register, login, logout } = require('../controller/auth.controller');
const { authenticate } = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/auth.schema');

const router = express.Router();

// api --->api/v2/auth/register
// schema ko validate karna hai
// validate ->middleware->registerSchema->validationFolder ->authSchema se 
router.get("/register", validate(registerSchema), register);

// api --->api/v2/auth/login
// schema ko validate karna hai 
router.get("/login", validate(loginSchema), login);

// api --->api/v2/auth/logout
router.get("/logout", authenticate, logout);

module.exports = router;