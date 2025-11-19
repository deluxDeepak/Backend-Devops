// databse se redish me bhi store kar rehe hai agr db me aane ke baad 
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

module.exports = { getUser };