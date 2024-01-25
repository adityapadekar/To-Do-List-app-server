const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

/**
 * InternalServerError extends CustomAPIError to represent an internal server error.
 * It represents a 500 Not Found error with a custom error message.
 */
class InternalServerError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

module.exports = InternalServerError;
