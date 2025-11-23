const { ApiError, NotFoundError, UnauthorizedError, ValidationError } = require("../error");
const User = require("../model/user.model");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");
// SignInacessstoken --->utitls --->jwt 

// ===============Register modified with jwt Access and refresh token  
const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !name) {
        return next(new ApiError("Name and email required"));
    }

    // Find the user if already exist or not 
    const existUser = await User.findOne({ email });
    if (existUser) {
        return next(new ValidationError("User with email already exist"));
    }

    // If user email and name not exist then,Save the user to Db and create user 
    const user = await User.create({ name, email, password });
    console.log("Created User with: ", user);

    // Give access and refresh token 
    // senging the user with all details except password 
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // setRefreshToken is not static method, it belongs to user instance.
    user.setRefreshToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })


    res.status(200).json({
        success: true,
        message: "User register",
        accessToken,
    })
}

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

    // Compare password using model method==========using bcrypt
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return next(new UnauthorizedError("Invalid password"));
    }

    console.log("User loggedIn details ", user)
    // Create tokens
    // refresh token ko hamesha cookie me set karte hain instead of sending in JSON to avoid theft via XSS.
    const accessToken = signAccessToken(user);
    // Genrate refreshToken from jwt 
    const refreshToken = signRefreshToken(user);

    // SetRefresh token to db --Model will hash the password before saving 
    user.setRefreshToken(refreshToken);

    // // Save refresh token to DB
    // user.refreshToken = refreshToken;
    await user.save();

    // ==============================================================
    // Cookies send 
    // ==============================================================

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    // AccessToken -->Send 
    // ResponseToken -->Dotn't send 
    res.status(200).json({
        success: true,
        message: "Logged in successfully!",
        accessToken,
    });
};


// protection of cookies 
// Which token to send in cookies & WHY?
// Send in cookie?	
// Refresh Token → Cookie ✔	Should be protected from JavaScript (HttpOnly). Very sensitive, long lived
// Access Token → No cookie ❌	CSRF attacks ho sakte hain, short lived hai, header me safe hai

// logout->authenicate->req.user rehega 
const logout = async (req, res, next) => {
    // req.user._id jo hai ye autenicate jab karte hai tab ata hai 
    const userData = await User.findById(req.user.userData._id);
    console.log("logging out the user", userData);
    if (!userData) {
        return next(new NotFoundError("User not Found or deleted"));
    }

    userData.refreshToken = null;
    await userData.save();

    // Clear refresh token cookie from browser also 
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logged Out Sucessfully!"
    })
}






module.exports = {
    login,
    register,
    logout,
}