const { StatusCodes } = require("http-status-codes");
const Task = require("../../models/task");
const {
    BadRequestError,
    NotFoundError,
    CustomAPIError,
    InternalServerError,
} = require("../../errors");

/**
 * Toggles the status of a task between pending and completed.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.params - Express request params object
 * @param {string} req.params.taskId - The ID of the task to toggle
 * @param {Object} req.body - Request body containing updated task fields
 * @param {string} req.body.event - The new status - 'pending' or 'completed'
 *
 * @param {Object} res - Express response object
 */
module.exports.toggleCompleteTask = async (req, res) => {
    const { taskId } = req.params;
    const { event } = req.body;

    // Validate if required fields are provided and if the event is valid
    const eventTypes = ["pending", "completed"];
    if (!event || !eventTypes.includes(event)) {
        throw new BadRequestError("Please provide required fields : event");
    }

    try {
        // Find task by ID
        const task = await Task.findById(taskId);

        // Throw error if task not found
        if (!task) {
            throw new NotFoundError("Task not found");
        }

        // Throw error if task is already in the desired state
        if (task.status === event) {
            throw new BadRequestError(`Task already ${event}`);
        }

        // Update task status
        await Task.findByIdAndUpdate(taskId, {
            status: event,
        });

        // Return status 200
        res.status(StatusCodes.OK).json({
            message: `Task in ${event} state!`,
            status: true,
        });
    } catch (error) {
        if (error instanceof CustomAPIError) {
            throw error;
        }
        throw new InternalServerError("Unable to toggle task status");
    }
};
