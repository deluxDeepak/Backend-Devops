const { ApiError, NotFoundError, UnauthorizedError, ValidationError } = require("../error");
const User = require("../model/user.model");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

// ===============Register modified with jwt Access and refresh token  
const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !name) {
        return next(new ApiError("Name and email required"));
    }

    // Find the user if already exist or not 
    const user = await User.find({ email });
    if (user) {
        return next(new ValidationError("User with email already exist"));
    }

    // If user email and name not exist then,Save the user to Db and create user 
    user = await User.create({ name, email, password });
    console.log("Created User with: ", user);

    // Give access and refresh token 
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();


    res.status(200).json({
        success: true,
        message: "User register",
        accessToken,
        refreshToken
    })
}

// Fake ===========login modified =================
const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError("Email or password is required"));
    }

    // Find the user + include password because select:false is used
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new NotFoundError("User not found. Provide correct email or password."));
    }

    // Compare password using model method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new UnauthorizedError("Invalid password"));
    }

    console.log("User loggedIn details ", user)
    // Create tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save();

    // Response
    res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        accessToken,
        refreshToken
    });
};

// logout->authenicate->req.user rehega 
const logout = async (req, res, next) => {
    const user = await User.findOne(req.user._id);

    user.refreshToken = null;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Logged Out !"
    })
}






module.exports = {
    login,
    register,
    logout,
}