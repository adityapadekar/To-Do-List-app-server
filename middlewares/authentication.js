const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

/**
 * Middleware to handle JWT authentication.
 *
 * Checks for valid JWT auth token in cookies.
 *
 * Throws UnauthorizedError if token is invalid or missing.
 */
module.exports.authenticationMiddleware = async (req, res, next) => {
    const { token } = req.cookies;

    // Check if token is present
    if (!token || !token.startsWith("Bearer ")) {
        throw new UnauthorizedError("No token provided");
    }

    // Extract token from string
    const authToken = token.split(" ")[1];

    try {
        // Verify token
        const payload = jwt.verify(authToken, process.env.JWT_SECRET);

        req.credentials = {
            userId: payload?.userId,
            email: payload?.email,
        };

        next();
    } catch (error) {
        throw new UnauthorizedError("Not authorized to access this route");
    }
};
