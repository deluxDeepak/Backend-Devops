// databse se redish me bhi store kar rehe hai agr db me aane ke baad 
const { redis } = require("../databse/redis.db");
const { NotFoundError, ApiError } = require("../error");

const getUser = (req, res, next) => {
    try {
        // Dummy data; if you intend to fetch by id use req.params.id
        const users = [
            { name: "Deepak", age: "12" },
            { name: "Rishi", age: "22" }
        ];

        // Example: return all users
        if (!users || users.length === 0) {
            // Ye response ke trah jayega global handler ke pass se 
            return next(new NotFoundError("User not found"));
        }

        return res.status(200).json({
            success: true,
            message: "Successfully fetched users",
            users,
        });

    } catch (error) {
        // forward unexpected error
        return next(new ApiError("Something went wrong with the API"));
    }
};

// Todo:Fetech the products original value  
const getProducts = async (req, res) => {

    // Dummy products 
    const products = [
        { name: "01product", details: "A new product added for dummy data " },
        { name: "02product", details: "A new product added for dummy data " }
    ]
    // const products = await Product.find(); // from DB


    // save in redis for next requests
    // EX: 60 means expire in 60 seconds

    // =====================================================
    //  Cache should store the full response object:
    // =====================================================
    const response = {
        success: true,
        message: "Products fetched Successfully",
        products: products

    }
    // =====================================================
    //  If Redis is down → your controller should still work.
    // =====================================================
    await redis
        .set("products", JSON.stringify(response), { EX: 60 })
        .catch(err => console.log("Redis set Error", err));
    return res.status(200).json(response);
};


module.exports = { getUser, getProducts };