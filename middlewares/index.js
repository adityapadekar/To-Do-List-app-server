const { errorHandlerMiddleware } = require("./error-handler");
const { pageNotFoundMiddleware } = require("./page-not-found");
const { authenticationMiddleware } = require("./authentication");
const { userExistMiddleware } = require("./user-exists");

module.exports = {
    pageNotFoundMiddleware,
    errorHandlerMiddleware,
    authenticationMiddleware,
    userExistMiddleware,
};
