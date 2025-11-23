const { redis } = require("../databse/redis.db");
const Product = require("../model/product.model");
const ProductsApiFeature = require("../utils/productsApiFeature");

const createProduct = async (req, res) => {
    try {

        let result;

        // If array → Bulk insert kara sakte hai same schema level pe 
        if (Array.isArray(req.body)) {
            result = await Product.insertMany(req.body);
        }

        // Else single product kara sakte hai 
        else {
            result = await Product.create(req.body);
        }

        // Clear redis cache after insert==========
        const keys = await redis.keys("products:*");
        for (const key of keys) await redis.del(key);

        return res.status(201).json({
            success: true,
            message: "Product(s) created successfully",
            data: result
        });

    } catch (error) {
        console.error("Create Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};




const getProduct = async (req, res) => {
    try {

        // ==============================
        // 1. CHECK REDIS CACHE
        // ==============================
        const redisKey = `products:${JSON.stringify(req.query)}`;

        const cachedProducts = await redis.get(redisKey);

        if (cachedProducts) {
            console.log("Serving From Redis Cache");

            return res.status(200).json({
                success: true,
                cache: true,
                ...JSON.parse(cachedProducts)
            });
        }

        // ==============================
        // 2. Count documents
        // ==============================
        const totalProducts = await Product.countDocuments();

        // ==============================
        // 3. API FEATURES
        // ==============================
        const features = new ProductsApiFeature(Product.find(), req.query)
            .search()
            .filter()
            .limitFields()
            .paginate();

        const products = await features.query;

        const response = {
            success: true,
            cache: false,
            totalProducts,
            page: features.page,
            limit: features.limit,
            results: products.length,
            products
        };

        // ==============================
        // 4. SET REDIS CACHE (EXPIRE 60 sec)
        // ==============================
        await redis.set(redisKey, JSON.stringify(response), { EX: 60 });

        return res.status(200).json(response);

    } catch (error) {
        console.error("Get Products Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
};

module.exports = { getProduct,createProduct };
