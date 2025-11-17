// Usercontoller--->UserROutes 
const express=require('express');
const { getUser } = require('../controller/user.controller');

const router=express.Router();

// api--->api/v2/user/getUser
router.get("/getUser", getUser);

module.exports = router;