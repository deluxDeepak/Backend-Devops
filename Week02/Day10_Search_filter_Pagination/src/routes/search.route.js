const express = require('express');
const throttle = require('../middleware/throttle');
const { searchController } = require('../controller/search.controller');

const router = express.Router();

// Use throttling here if it is busy rote 
// after 20 request/min slow down 
// api--->api/v2/search/dynamic---
// TODO:make search route dnamic 
router.get("/dynamic", throttle(20, 60), searchController)

module.exports = router;