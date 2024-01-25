const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const { InternalServerError } = require("../../errors");

/**
 * Deletes a task by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Express request params object
 * @param {string} req.params.taskId - ID of task to delete
 *
 * @param {Object} res - Express response object
 */
module.exports.deleteTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        // Find task by ID
        await Task.findByIdAndDelete(taskId);

        // Return status 200
        res.status(StatusCodes.OK).json({
            message: "Task Deleted!",
            status: true,
        });
    } catch (error) {
        throw new InternalServerError("Unable to delete task");
    }
};
