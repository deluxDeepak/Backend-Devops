const express = require("express");
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const adminRoutes = require('./admin.route');
const searchRoutes = require('./search.route');
const uploadRoutes = require('./search.route');
const productRoutes = require('./product.route');


// Create central ROute Loader 
const router = express.Router();

// All main routes will be mounted here 

// ========================Authencated routes ===================
// api--->api/v2/auth/---
router.use("/auth", authRoutes);

// ============================Search Route====================
// api--->api/v2/search/---
router.use("/search", searchRoutes);

//================== Normal User routes =======================
// api--->api/v2/user/---
router.use("/user", userRoutes);

// ================Admin user routes =============
// api--->api/v2/admin/---
router.use("/admin", adminRoutes);

//================== Upload routes =======================
// api--->api/v2/uploads/---
router.use("/uploads",uploadRoutes);

//================== Products route =======================
// api--->api/v2/products/---
router.use("/products",productRoutes);

module.exports = router;


/*
    Clean app.js
    Scalabel 
    Add 10 routes files easily 
    Best practise for microservice 
*/
