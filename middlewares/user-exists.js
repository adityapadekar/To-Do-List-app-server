const User = require("../models/user");
const { NotFoundError } = require("../errors");

/**
 * userExistMiddleware - Middleware to check if user exists.
 *
 * Checks if a user with the given ID in the request credentials exists.
 * Throws NotFoundError if user does not exist.
 * Adds found user to request object.
 * Calls next() if user is found.
 */
module.exports.userExistMiddleware = async (req, res, next) => {
    const { userId } = req.credentials;
    
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new NotFoundError("Invalid credentials");
    }

    req.user = user;

    next();
};
