// Usercontoller--->UserROutes 
const express = require('express');
const { getUser, getProfile} = require('../controller/user.controller');
const checkCache = require('../middleware/cacheRedis');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

// api--->api/v2/user/getUser
// curl http://localhost:3000/api/v2/user/getUser
router.get("/getUser", getUser);


// When you call /profile or /logout, add header:
// profile dekhna hai to login karna parega 
// api--->api/v2/user/profile 
router.get("/profile",authenticate,getProfile);


module.exports = router;