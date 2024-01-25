const mongoose = require("mongoose");

/**
 * TaskSchema defines the schema for a Task model in MongoDB.
 * 
 * It contains fields for title, description, status, dueDate, category, and userId.
 * 
 * The userId field is a reference to the User model.
 * The timestamps option is set to true to include createdAt and updatedAt fields in the schema.
 */
const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide title"],
        },
        description: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
        dueDate: {
            type: Date,
        },
        category: {
            type: String,
            enum: ["general", "personal", "work", "school"],
            default: "general",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
