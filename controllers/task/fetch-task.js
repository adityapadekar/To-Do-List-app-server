const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const { NotFoundError, InternalServerError } = require("../../errors");

/**
 * Fetches a task by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Express request params object
 * @param {string} req.params.taskId - ID of task to fetch
 *
 * @param {Object} res - Express response object
 */
module.exports.fetchTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        // Find task by ID
        const task = await Task.findById(taskId);

        // Throw error if task not found
        if (!task) {
            throw new NotFoundError("Task not found");
        }

        // Return fetched task with status 200
        res.status(StatusCodes.OK).json({
            message: "Task Fetched!",
            status: true,
            result: task,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new InternalServerError("Unable to fetch task");
    }
};
