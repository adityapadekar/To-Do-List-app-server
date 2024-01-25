const { login } = require("../auth/login");
const { signUp } = require("./signup");
const { fetchUserDetails } = require("./fetch-user-details");

module.exports = {
    login,
    signUp,
    fetchUserDetails,
};
