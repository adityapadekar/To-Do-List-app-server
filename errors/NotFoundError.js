const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

/**
 * NotFoundError is a custom error class that extends CustomAPIError.
 * It represents a 404 Not Found error with a custom error message.
 */
class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFoundError;
