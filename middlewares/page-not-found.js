const { StatusCodes } = require("http-status-codes");

/**
 * Middleware function to handle 404 page not found errors.
 *
 * Sends a 404 status code and JSON response with a message.
 */
// eslint-disable-next-line no-unused-vars
module.exports.pageNotFoundMiddleware = async (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).json({
        message: "Route does not exist",
        status: false,
    });
};
