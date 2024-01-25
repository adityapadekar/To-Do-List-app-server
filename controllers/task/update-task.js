const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const { BadRequestError, InternalServerError } = require("../../errors");

/**
 * Updates a task in the database by ID.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Express request params object
 * @param {string} req.params.taskId - ID of task to update
 * @param {Object} req.body - Request body containing updated task fields
 * @param {string} req.body.title - Updated title for task
 * @param {string} req.body.description - Updated description for task
 * @param {Date} req.body.dueDate - Updated due date for task
 * @param {string} req.body.category - Updated category for task
 *
 * @param {Object} res - Express response object
 */
module.exports.updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, dueDate, category } = req.body;

    // Validate if title is provided
    if (!title) {
        throw new BadRequestError("Title is required");
    }

    try {
        // Update task
        const task = await Task.findByIdAndUpdate(
            taskId,
            {
                title,
                description,
                dueDate,
                category,
            },
            {
                new: true,
            }
        );

        // Return updated task with status 200
        res.status(StatusCodes.OK).json({
            message: "Task Updated!",
            status: true,
            result: task,
        });
    } catch (error) {
        throw new InternalServerError("Unable to update task");
    }
};
