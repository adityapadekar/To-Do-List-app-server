const supertest = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../app");
const User = require("../models/user");
const Task = require("../models/task");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("Task", () => {
    let user, task, token;
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        user = await User.create({
            name: "aditya",
            email: "aditya@gmail.com",
            password: "aditya123",
        });

        task = await Task.create({
            title: "task1",
            description: "task1 description",
            dueDate: new Date(),
            category: "general",
            status: "pending",
            userId: user._id.toString(),
        });

        const payload = {
            email: user.email,
            password: "aditya123",
        };
        const response = await supertest(app)
            .post("/api/v1/auth/login")
            .send(payload)
            .set("Content-Type", "application/json")
            .set("Accept", "application/json");

        token = response.headers["set-cookie"][0].split("=")[1].slice(9);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe("Create Task", () => {
        describe("Given no title", () => {
            it("should throw an error with 400 status code", async () => {
                const payload = {};

                const response = await supertest(app)
                    .post("/api/v1/task/create-task")
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Please provide required fields"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given invaid category", () => {
            it("should throw an error with 500 status code", async () => {
                const payload = {
                    title: "task1",
                    description: "task1 description",
                    category: "dwadadw",
                };

                const response = await supertest(app)
                    .post("/api/v1/task/create-task")
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Please provide required fields"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given valid payload", () => {
            it("should create a new task and return 201 status code", async () => {
                const payload = {
                    title: "task2",
                    description: "task2 description",
                    category: "general",
                };

                const response = await supertest(app)
                    .post("/api/v1/task/create-task")
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(201);
                expect(response.body.message).toBe("Task Created!");
                expect(response.body.status).toBe(true);
            });
            it("should create a new task and return 201 status code", async () => {
                const payload = {
                    title: "task3",
                };

                const response = await supertest(app)
                    .post("/api/v1/task/create-task")
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(201);
                expect(response.body.message).toBe("Task Created!");
                expect(response.body.status).toBe(true);
            });
            it("should create a new task and return 201 status code", async () => {
                const payload = {
                    title: "task4",
                    description: "task4 description",
                    dueDate: new Date(),
                    category: "general",
                };

                const response = await supertest(app)
                    .post("/api/v1/task/create-task")
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(201);
                expect(response.body.message).toBe("Task Created!");
                expect(response.body.status).toBe(true);
            });
        });
    });

    describe("Fetch Task", () => {
        describe("Given no task id", () => {
            it("should throw an error with 404 status code", async () => {
                const response = await supertest(app)
                    .get(`/api/v1/task/fetch-task`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Route does not exist");
                expect(response.body.status).toBe(false);
            });
        });
        describe("Given invalid taskId", () => {
            it("should throw an error with 500 status code it taskId is not a valid ObjectId", async () => {
                const taskId = "dwadadw";
                const response = await supertest(app)
                    .get(`/api/v1/task/fetch-task/${taskId}`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(500);
                expect(response.body.message).toBe("Unable to fetch task");
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 404 status code if taskId does not exist", async () => {
                const taskId = new mongoose.Types.ObjectId().toString();
                const response = await supertest(app)
                    .get(`/api/v1/task/fetch-task/${taskId}`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Task not found");
                expect(response.body.status).toBe(false);
            });
        });
        describe("Given valid taskId", () => {
            it("fetch a task and return 200 status code", async () => {
                const response = await supertest(app)
                    .get(`/api/v1/task/fetch-task/${task._id.toString()}`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Task Fetched!");
                expect(response.body.status).toBe(true);
                expect(response.body.result).toEqual({
                    __v: 0,
                    _id: task._id.toString(),
                    category: "general",
                    createdAt: expect.any(String),
                    description: "task1 description",
                    dueDate: task.dueDate.toISOString(),
                    status: "pending",
                    title: "task1",
                    updatedAt: expect.any(String),
                    userId: user._id.toString(),
                });
            });
        });
    });

    describe("Fetch All Tasks", () => {
        describe("Given no query parameters", () => {
            it("should return all tasks and return 200 status code", async () => {
                const response = await supertest(app)
                    .get("/api/v1/task/fetch-all-tasks")
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Tasks Fetched!");
                expect(response.body.status).toBe(true);
                expect(response.body.result).toBeInstanceOf(Array);
                expect(response.body.result).not.toHaveLength(0);
            });
        });
        describe("Given query parameters", () => {
            it("should return 0 tasks and return 404 status code", async () => {
                const response = await supertest(app)
                    .get("/api/v1/task/fetch-all-tasks?category=work")
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("No tasks found");
                expect(response.body.status).toBe(false);
            });

            it("should return all tasks and return 200 status code", async () => {
                const response = await supertest(app)
                    .get("/api/v1/task/fetch-all-tasks?category=general")
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Tasks Fetched!");
                expect(response.body.status).toBe(true);
                expect(response.body.result).toBeInstanceOf(Array);
                expect(response.body.result).not.toHaveLength(0);
            });
        });
    });

    describe("Update Task", () => {
        describe("Given invalid taskId", () => {
            it("should throw an error with 500 status code it taskId is not a valid ObjectId", async () => {
                const taskId = "dwadadw";
                const payload = { title: "task1" };

                const response = await supertest(app)
                    .patch(`/api/v1/task/update-task/${taskId}`)
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(500);
                expect(response.body.message).toBe("Unable to update task");
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 404 status code if taskId does not exist", async () => {
                const payload = {};

                const response = await supertest(app)
                    .patch(`/api/v1/task/update-task`)
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Route does not exist");
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given valid taskId", () => {
            it("should throw an error with 400 status code if title is not provided", async () => {
                const payload = { description: "task1 description" };

                const response = await supertest(app)
                    .patch(`/api/v1/task/update-task/${task._id.toString()}`)
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Title is required");
                expect(response.body.status).toBe(false);
            });

            it("should update task and return 200 status code", async () => {
                const payload = { title: "updated task1" };

                const response = await supertest(app)
                    .patch(`/api/v1/task/update-task/${task._id.toString()}`)
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Task Updated!");
                expect(response.body.status).toBe(true);
                expect(response.body.result).toEqual({
                    __v: 0,
                    _id: task._id.toString(),
                    category: "general",
                    createdAt: expect.any(String),
                    description: "task1 description",
                    dueDate: task.dueDate.toISOString(),
                    status: "pending",
                    title: payload.title,
                    updatedAt: expect.any(String),
                    userId: user._id.toString(),
                });
            });
        });
    });

    describe("Toggle Task Completion Status", () => {
        describe("Given invalid taskId", () => {
            it("should throw an error with 500 status code it taskId is not a valid ObjectId", async () => {
                const taskId = "dwadadw";
                const payload = { event: "completed" };

                const response = await supertest(app)
                    .patch(`/api/v1/task/toggle-complete-task/${taskId}`)
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(500);
                expect(response.body.message).toBe(
                    "Unable to toggle task status"
                );
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 404 status code if taskId does not exist", async () => {
                const response = await supertest(app)
                    .patch(`/api/v1/task/toggle-complete-task`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Route does not exist");
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given valid taskId", () => {
            it("should throw an error with 400 status code if event is not provided", async () => {
                const payload = { description: "task1 description" };

                const response = await supertest(app)
                    .patch(
                        `/api/v1/task/toggle-complete-task/${task._id.toString()}`
                    )
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Please provide required fields : event"
                );
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 400 status code if event is not valid", async () => {
                const payload = { event: "invalid" };

                const response = await supertest(app)
                    .patch(
                        `/api/v1/task/toggle-complete-task/${task._id.toString()}`
                    )
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Please provide required fields : event"
                );
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 404 status code if task with provided id does not exist", async () => {
                const taskId = new mongoose.Types.ObjectId().toString();
                const payload = { event: "completed" };

                const response = await supertest(app)
                    .patch(`/api/v1/task/toggle-complete-task/${taskId}`)
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Task not found");
                expect(response.body.status).toBe(false);
            });

            it("should toggle task status and return 200 status code", async () => {
                const payload = { event: "completed" };

                const response = await supertest(app)
                    .patch(
                        `/api/v1/task/toggle-complete-task/${task._id.toString()}`
                    )
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Task in completed state!");
                expect(response.body.status).toBe(true);
            });

            it("should throw an error with 400 status code if task is already completed", async () => {
                const payload = { event: "completed" };

                const response = await supertest(app)
                    .patch(
                        `/api/v1/task/toggle-complete-task/${task._id.toString()}`
                    )
                    .send(payload)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe("Task already completed");
                expect(response.body.status).toBe(false);
            });
        });
    });

    describe("Delete Task", () => {
        describe("Given invalid taskId", () => {
            it("should throw an error with 500 status code it taskId is not a valid ObjectId", async () => {
                const taskId = "61445646546546546546546";

                const response = await supertest(app)
                    .delete(`/api/v1/task/delete-task/${taskId}`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(500);
                expect(response.body.message).toBe("Unable to delete task");
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 404 status code if taskId does not exist", async () => {
                const response = await supertest(app)
                    .delete("/api/v1/task/delete-task")
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Route does not exist");
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given valid taskId", () => {
            it("should delete task and return 200 status code", async () => {
                const response = await supertest(app)
                    .delete(`/api/v1/task/delete-task/${task._id.toString()}`)
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.body.message).toBe("Task Deleted!");
                expect(response.body.status).toBe(true);
            });
        });
    });
});
