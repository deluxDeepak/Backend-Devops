const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true  //Imporve search performance 

    },
    description: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true,
        index: true  //Filter performance
    },
    catogory: {
        type: String,
        required: true,
        index: true  //Filter performace 
    },
    price: {
        type: Number,
        required: true,
        index: true  //Filter +sorting
    },

    // Persent me discount kitna hai 
    discount: {
        type: Number,
        default: 0, // percent
    },

    // Number of stock kitna hai 
    stock: {
        type: Number,
        default: 0,
    },

    rating: {
        type: Number,
        default: 0,
        index: true,            // Filter + sorting
    },

    // Array of images can be store 
    images: [
        {
            url: String,
            public_id: String,
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
        index: true,             // Cursor pagination + sorting
    },


}, { timestamps: true });

// ==================Compound Indexes ===============
productSchema.index(
    {
        name: "text",
        description: "text",
        brand: "text",
        category: "text",
    },
    {
        weights: {
            name: 5,         // Higher weight = higher search priority
            brand: 3,
            category: 2,
            description: 1,
        },
    }
);

/* =======================================================
   🔥 COMPOUND INDEX — Used for Cursor Pagination
   - createdAt: sort order
   - _id: tie-breaker to avoid duplicates
   ======================================================= */
productSchema.index({ createdAt: -1, _id: -1 });

/* =======================================================
   🔥 OPTIONAL: Filter Indexes (Highly Optimized)
   ======================================================= */
productSchema.index({ brand: 1, price: 1, rating: -1 });
productSchema.index({ category: 1, price: 1 });


const Product = mongoose.model("Product", productSchema)
module.exports = Product