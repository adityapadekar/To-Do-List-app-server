const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * UserSchema defines the schema for a User model in MongoDB.
 *
 * It contains fields for name, email, and password.
 *
 * The name and email fields are required and email must match a regex.
 * Email is also set to a unique index.
 * The password field is required and will be hashed before saving to DB.
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name"],
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please provide email"],
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please provide valid email",
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
});


/**
 * Hash the password before saving the user model to the database.
 * This middleware generates a salt using bcrypt and hashes the password using that salt before saving.
 */
UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Create a JSON Web Token for the user.
 * Signs a JWT payload containing the user ID and email
 * Expires in 30 days.
 */
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            userId: this._id,
            email: this.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

/**
 * Compares a candidate password to the user's hashed password.
 * Returns true if the passwords match, false otherwise.
 */
UserSchema.methods.checkPassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
