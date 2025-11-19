const express = require("express");
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');


// Create central ROute Loader 
const router = express.Router();

// All main routes will be mounted here 

// api--->api/v2/auth/---
router.use("/auth", authRoutes);

//================== Normal User routes =======================
// api--->api/v2/user/---
router.use("/user", userRoutes);

// ================Admin user routes =============
// api--->api/v2/admin/---
router.use("/admin", adminRoutes);

module.exports = router;


/*
    Clean app.js
    Scalabel 
    Add 10 routes files easily 
    Best practise for microservice 
*/
