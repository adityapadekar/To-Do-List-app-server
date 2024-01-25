const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

/**
 * UnauthorizedError class which extends CustomAPIError.
 * It represents a 401 Not Found error with a custom error message.
 */
class UnauthorizedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthorizedError;
