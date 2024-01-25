const express = require("express");
const { authenticationMiddleware } = require("../middlewares");
const { login, signUp, fetchUserDetails } = require("../controllers/auth");

const authRouter = express.Router();

// Route to login
authRouter.route("/login").post(login);

// Route to signup
authRouter.route("/signup").post(signUp);

// Route to fetch user details
authRouter
    .route("/fetch-user-details")
    .get(authenticationMiddleware, fetchUserDetails);

module.exports = { authRouter };
