const mongoose = require('mongoose');

// So password won't come inside API response unless we manually include it
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is required"],
        trim: true

    },
    email: {
        type: String,
        require: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    // select false means password user ke sath nahi ayege agr find karenge to 
    password: {
        type: String,
        require: [true, "Password is reuired"],
        select: false
    },
}, { timestamps: true });

const User = mongoose.model("UserDay04", UserSchema);
module.exports = User;