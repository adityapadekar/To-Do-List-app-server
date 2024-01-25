const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./CustomAPIError");

/**
 * BadRequestError is a custom error class that extends CustomAPIError.
 * It represents a 400 Bad Request client error response.
 */
class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = BadRequestError;
