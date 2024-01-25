const { createTask } = require("./create-task");
const { toggleCompleteTask } = require("./toggle-complete-task");
const { fetchAllTasks } = require("./fetch-all-tasks");
const { fetchTask } = require("./fetch-task");
const { deleteTask } = require("./delete-task");
const { updateTask } = require("./update-task");

module.exports = {
    createTask,
    toggleCompleteTask,
    fetchAllTasks,
    fetchTask,
    deleteTask,
    updateTask,
};
