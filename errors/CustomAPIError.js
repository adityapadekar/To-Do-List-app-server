/**
 * CustomAPIError is a custom error class that extends the built-in Error class.
 * It is used to create custom error objects with a message.
 */
class CustomAPIError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = CustomAPIError;
