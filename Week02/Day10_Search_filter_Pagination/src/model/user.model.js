const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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

    // dont send the refresh token in api response 
    // temporary refresh token store karna parega 
    refreshToken: {
        type: String,
        default: null,     // optional
        select: false
    }

}, { timestamps: true });


// ------------------------------
//  PASSWORD HASHING MIDDLEWARE
// ------------------------------
UserSchema.pre("save", async function (next) {

    // Agar password change hi nahi hua, skip hashing
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (error) {
        next(error);

    }
});

// --------------------------------------
// ADD A METHOD FOR PASSWORD COMPARISON
// --------------------------------------
UserSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};


// Generate refresh token and hash automatically ================
// --------------------------------------
// HASHING THE TOKEN for safety
// --------------------------------------
UserSchema.methods.setRefreshToken = async function (refreshToken) {

    if (typeof refreshToken != "string") {
        throw new Error("Reresh token must be a string");
    }
    const hasedToken = crypto.createHash("sha256")
        .update(refreshToken)
        .digest('hex')

    this.refreshToken = hasedToken
    return hasedToken;
}


// --------------------------------------------------------------------------
// createHmac difficult to manage 
// const { createHmac } = require('node:crypto');

// const secret = 'abcdefg';
// const hash = createHmac('sha256', secret)
//     .update('I love cupcakes')
//     .digest('hex');
// console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
// --------------------------------------------------------------------------


const User = mongoose.model("UserDay04", UserSchema);
module.exports = User;