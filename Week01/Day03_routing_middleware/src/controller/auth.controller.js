const { ApiError } = require("../error");

// Register the User 
const register = (req, res, next) => {
    const { name, email } = req.body;

    if (!email || !name) {
        // yehan se error global error ke pass jayega 
        return next(new ApiError("Name and email required"));
    }
    res.status(200).json({
        success: true,
        message: "User register",
        user: { name, email }
    })
}

// Fake login know 
const login = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ApiError("Email required"));

    }
    res.status(200).json({
        success: true,
        message: "Logged in !",
        token: "fake token now"
    })
}


module.exports = {
    login,
    register
}