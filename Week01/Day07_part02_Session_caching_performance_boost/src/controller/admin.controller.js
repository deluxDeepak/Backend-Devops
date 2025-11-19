const { NotFoundError, ApiError } = require("../error");

// Example admin controller. Keep handlers small and forward errors to the
// global error handler via next().
const getUser = (req, res, next) => {
    try {
        // If token verification middleware populated req.user, return that.
        // agr req.user mil gya to yehi se back kar do 
        if (req.user) {
            return res.status(200).json({
                success: true,
                message: "Admin user fetched from token",
                user: req.user,
            });
        }

        // Otherwise return some dummy admin data for demo purposes
        const admins = [
            { name: "Admin Deepak", role: "admin" },
            { name: "Admin Rishi", role: "admin" },
        ];

        if (!admins || admins.length === 0) {
            return next(new NotFoundError("Admin not found"));
        }

        return res.status(200).json({
            success: true,
            message: "Successfully fetched admins",
            admins,
        });
    } catch (error) {
        return next(new ApiError("Something went wrong in admin controller"));
    }
};

module.exports = { getUser };
