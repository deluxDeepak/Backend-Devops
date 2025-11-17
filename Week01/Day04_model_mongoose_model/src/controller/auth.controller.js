const { ApiError, NotFoundError, UnauthorizedError } = require("../error");
const User = require("../model/user.model");

// ===============Register modified ============== the User 
const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !name) {
        return next(new ApiError("Name and email required"));
    }

    // If user email and name then,Save the user to Db 
    const user = await User.create({ name, email, password });


    res.status(200).json({
        success: true,
        message: "User register",
        user
    })
}

// Fake ===========login modified =================
const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ApiError("Email or Password is required"));

    }
    // check if the email and password match with the db also 

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new NotFoundError("User not Found Provide Corret email or password"))
    };

    // TODO:Add real password hashing 
    if (user.password != password) {
        return next(new UnauthorizedError("Password not matched"));
    }

    // If password matched then give this reposnse 
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