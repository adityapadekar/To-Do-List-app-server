const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const { NotFoundError } = require("../../errors");

/**
 * fetchUserDetails - Controller function to fetch user details.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.credentials - Logged in user credentials
 * @param {string} req.credentials.userId - ID of logged in user
 * 
 * @param {Object} res - Express response object
 */
module.exports.fetchUserDetails = async (req, res) => {
    const { userId } = req.credentials;

    // Find user by ID without password
    const user = await User.findById(userId).select("-password");

    // Throw error if user not found
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Return user details with status 200
    res.status(StatusCodes.OK).json({
        message: "User details fetched successfully!",
        status: true,
        result: user,
    });
};
