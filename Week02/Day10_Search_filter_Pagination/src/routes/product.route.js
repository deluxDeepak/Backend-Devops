
const express = require('express');
const checkCache = require('../middleware/cacheRedis');
const { getProduct, createProduct } = require('../controller/product.controller');

const router = express.Router();

// GET: /api/v2/products/productNew
// Search the products  =============
//1. http://localhost:3000/api/v2/products/productNew?search=iphone

// COnverted into mongo query
/**
 * find({
        name: { $regex: "iphone", $options: "i" }
    })
*/

// Filter The products =========================
// 2.http://localhost:3000/api/v2/products/productNew?brand=Apple&catogory=Smartphone
/**
 * find({
        brand: "Apple",
        catogory: "Smartphone",
        price: { $gte: 50000 }
    })
*/

// Sort the products
// 3. http://localhost:3000/api/v2/products/productNew?sort=price 
// query.sort("price")

// Pagination example 
//4. http://localhost:3000/api/v2/products/productNew?page=2&limit=5

/**
 * query.skip(10).limit(10)
*/

// /api/v2/products/productNew?search=iphone&brand=Apple&page=1&limit=5
/**
 * Product.find({
        name: { $regex: "iphone", $options: "i" },
        brand: "Apple"
    })
    .skip(0)
    .limit(5)
    .select("name price brand rating images")

 */


router.get("/productNew", checkCache("products"), getProduct);

// POST: /api/v2/products/productNew
router.post("/productNew", createProduct);

module.exports = router;
