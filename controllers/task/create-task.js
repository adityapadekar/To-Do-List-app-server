const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const { BadRequestError } = require("../../errors");

/**
 * Creates a new task.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing task details
 * @param {string} req.body.title - Title of task
 * @param {string} req.body.description - Description of task
 * @param {Date} req.body.dueDate - Due date of task
 * @param {string} req.body.category - Category of task
 * @param {Object} req.user - Logged in user
 * @param {string} req.user._id - ID of logged in user
 *
 * @param {Object} res - Express response object
 */
module.exports.createTask = async (req, res) => {
    const { title, description, dueDate, category } = req.body;
    const user = req.user;

    /**
     * Validate if category is provided then it is valid
     *
     * If category is not provided then it is valid
     */
    const categoryList = ["general", "personal", "work", "school"];
    const isCategoryCorrect = category ? categoryList.includes(category) : true;

    // Validate if required fields are provided
    if (!title || !isCategoryCorrect) {
        throw new BadRequestError("Please provide required fields");
    }

    // Create task
    await Task.create({
        title,
        description,
        dueDate,
        category,
        userId: user._id,
    });

    // Return status 201
    res.status(StatusCodes.CREATED).json({
        message: "Task Created!",
        status: true,
    });
};
