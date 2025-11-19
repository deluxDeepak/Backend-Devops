// Usercontoller--->UserROutes 
const express = require('express');
const { getUser} = require('../controller/user.controller');
const checkCache = require('../middleware/cacheRedis');

const router = express.Router();

// api--->api/v2/user/getUser
// curl http://localhost:3000/api/v2/user/getUser
router.get("/getUser", getUser);

// // api--->api/v2/user/products 
// // Using caching here also products route 
// router.get("/products", checkCache("products"), getProducts);

module.exports = router;