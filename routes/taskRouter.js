const express = require("express");
const {
    userExistMiddleware,
    authenticationMiddleware,
} = require("../middlewares");
const {
    createTask,
    toggleCompleteTask,
    fetchAllTasks,
    fetchTask,
    deleteTask,
    updateTask,
} = require("../controllers/task");

const taskRouter = express.Router();

// Route to create task
taskRouter
    .route("/create-task")
    .post(authenticationMiddleware, userExistMiddleware, createTask);

// Route to toggle complete task
taskRouter
    .route("/toggle-complete-task/:taskId")
    .patch(authenticationMiddleware, userExistMiddleware, toggleCompleteTask);

// Route to fetch all tasks
taskRouter
    .route("/fetch-all-tasks")
    .get(authenticationMiddleware, userExistMiddleware, fetchAllTasks);

// Route to fetch task
taskRouter
    .route("/fetch-task/:taskId")
    .get(authenticationMiddleware, userExistMiddleware, fetchTask);

// Route to delete task
taskRouter
    .route("/delete-task/:taskId")
    .delete(authenticationMiddleware, userExistMiddleware, deleteTask);

// Route to update task
taskRouter
    .route("/update-task/:taskId")
    .patch(authenticationMiddleware, userExistMiddleware, updateTask);

module.exports = { taskRouter };
