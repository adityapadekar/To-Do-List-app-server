const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const { NotFoundError } = require("../../errors");

/**
 * Fetches all tasks.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query params
 * @param {string} req.query.category - Category of tasks to fetch
 * @param {Object} req.user - Logged in user
 *
 * @param {Object} res - Express response object
 */

module.exports.fetchAllTasks = async (req, res) => {
    const { category } = req.query;
    const user = req.user;

    /**
     * Validate if category is provided then it is valid
     *
     * If category is not provided then it is invalid
     */
    const categoryList = ["general", "personal", "work", "school"];
    const isCategoryCorrect = category
        ? categoryList.includes(category)
        : false;

    /**
     * If category is provided then query is made with category
     *
     * If category is not provided then query is made without category
     */
    const query =
        category && isCategoryCorrect
            ? { category, userId: user._id }
            : { userId: user._id };

    // Find tasks
    const tasks = await Task.find(query).sort("-createdAt");

    // Throw error if tasks not found
    if (tasks.length === 0) {
        throw new NotFoundError("No tasks found");
    }

    // Return fetched tasks with status 200
    res.status(StatusCodes.OK).json({
        message: "Tasks Fetched!",
        status: true,
        result: tasks,
    });
};
