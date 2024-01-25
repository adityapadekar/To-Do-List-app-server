const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const {
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
} = require("../../errors");

/**
 * login - Controller function to handle login.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Express request body object
 * @param {string} req.body.email - Email of user
 * @param {string} req.body.password - Password of user
 *
 * @param {Object} res - Express response object
 */
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate if required fields are provided
    if (!email || !password) {
        throw new BadRequestError(
            "Please provide required fields: email, password"
        );
    }

    // Find user by email 
    const user = await User.findOne({ email: email });

    // Throw error if user not found
    if (!user) {
        throw new NotFoundError("Invalid credentials");
    }

    // Check if password is correct
    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid credentials");
    }

    // Create JWT token
    const token = user.createJWT();

    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
    };

    // Send token as cookie, user details as JSON response and return status 200
    res.cookie("token", `Bearer ${token}`, {
        ...cookieOptions,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // expires in 30 days
    })
        .status(StatusCodes.OK)
        .json({
            message: "Login Successful",
            status: true,
            result: {
                name: user.name,
                email: user.email,
            },
        });
};
