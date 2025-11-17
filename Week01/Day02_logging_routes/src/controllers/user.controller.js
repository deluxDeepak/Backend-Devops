const NotFoundError = require("../error/NotfoundError.js");


const getAllUsers = (req, res, next) => {
    try {
        const users = [
            { id: 1, name: "Deepak Kumar" },
            { id: 2, name: "Backend Developer" }
        ];
        res.status(200).json({ users });
    } catch (error) {
        next(new NotFoundError("User not Found"))
    }
}
module.exports = { getAllUsers }