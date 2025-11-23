// databse se redish me bhi store kar rehe hai agr db me aane ke baad 
const { NotFoundError, ApiError } = require("../error");
const User = require("../model/user.model");

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

// Yehan ab faiyada ye hai ki db request nahi marna parega 
// getProfile kar rehe hai wo login hai 
const getProfile = async (req, res, next) => {
    console.log("getting User from authentication method ", req.user);
    console.log("Chcking the Request object: ", req.hellow);

    const user = await User.findById(req.user.userData._id);

    // Minimum check is nessasry like user account is deleted or account is banned or something
    if (!user) {
        return next(new NotFoundError("User not Found or dleted"))

    }
    res.status(200).json({
        success: true,
        message: "Profile fetch successfully",
        data: user,
    })

}

module.exports = { getUser, getProfile };