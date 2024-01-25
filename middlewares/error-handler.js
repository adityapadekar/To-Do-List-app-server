const { StatusCodes } = require("http-status-codes");

/**
 * errorHandlerMiddleware handles errors by setting a custom error response.
 * 
 * It responds with status code, message, and status false.
 */
// eslint-disable-next-line no-unused-vars
module.exports.errorHandlerMiddleware = async (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,

        message: err.message || "Something went wrong, Please try again",
    };

    return res
        .status(customError.statusCode)
        .json({ message: customError.message, status: false });
};
