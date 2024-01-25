const mongoose = require("mongoose");
const { InternalServerError } = require("../errors");

/**
 * Connects to the MongoDB database using the provided URL.
 *
 * @param {string} url - The URL of the MongoDB database to connect to.
 */
module.exports.connectDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("Connected to DB"); // eslint-disable-line
    } catch (error) {
        console.log(`Unable to connect \n\n ${error}`); // eslint-disable-line
        throw new InternalServerError("Unable to connect to database");
    }
};
