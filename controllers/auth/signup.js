const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const { BadRequestError } = require("../../errors");

/**
 * signUp - Controller function to handle sign up.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Express request body object
 * @param {string} req.body.name - Name of user
 * @param {string} req.body.email - Email of user
 * @param {string} req.body.password - Password of <PASSWORD>
 * 
 * @param {Object} res - Express response object
 */
module.exports.signUp = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate if required fields are provided
    if (!name || !email || !password) {
        throw new BadRequestError(
            "Please provide required fields: name, email, password"
        );
    }

    // Validate if user already exists with this email
    const user = await User.findOne({ email: email });
    if (user) {
        throw new BadRequestError("User already exists with this email");
    }

    // Create user
    await User.create({
        name: name,
        email: email,
        password: password,
    });

    // Return status 201
    res.status(StatusCodes.CREATED).json({
        message: "Signup Successful",
        status: true,
    });
};
