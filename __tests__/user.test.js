const supertest = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../app");
const User = require("../models/user");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("User", () => {
    let user;
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        user = await User.create({
            name: "aditya",
            email: "aditya@gmail.com",
            password: "aditya123",
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe("Signup", () => {
        describe("Given no credentials", () => {
            it("should throw an error with 400 status code", async () => {
                const payload = {};

                const response = await supertest(app)
                    .post("/api/v1/auth/signup")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Please provide required fields: name, email, password"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given invaid email", () => {
            it("should throw an error with 500 status code", async () => {
                const payload = {
                    name: "aditya",
                    email: "aditya",
                    password: "aditya123",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/signup")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(500);
                expect(response.body.message).toBe(
                    "User validation failed: email: Please provide valid email"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given Email is already taken", () => {
            it("should throw an error with 400 status code", async () => {
                const payload = {
                    name: "aditya",
                    email: "aditya@gmail.com",
                    password: "aditya123",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/signup")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "User already exists with this email"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given valid credentials", () => {
            it("should create a new user and return 201 status code", async () => {
                const payload = {
                    name: "aditya",
                    email: "aditya1@gmail.com",
                    password: "password",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/signup")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(201);
                expect(response.body.message).toBe("Signup Successful");
                expect(response.body.status).toBe(true);
            });
        });
    });

    describe("Login", () => {
        describe("Given no credentials", () => {
            it("should throw an error with 400 status code", async () => {
                const payload = {};

                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(400);
                expect(response.body.message).toBe(
                    "Please provide required fields: email, password"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given invalid credentials", () => {
            it("should throw an error with 404 status code if email is invalid", async () => {
                const payload = {
                    email: "invalid",
                    password: "invalid",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(404);
                expect(response.body.message).toBe("Invalid credentials");
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 401 status code if password is incorrect", async () => {
                const payload = {
                    email: "aditya@gmail.com",
                    password: "invalid",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(401);
                expect(response.body.message).toBe("Invalid credentials");
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given valid credentials", () => {
            it("should return a JWT token and 200 status code", async () => {
                const payload = {
                    email: "aditya@gmail.com",
                    password: "aditya123",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(200);
                expect(response.headers["set-cookie"][0]).toMatch(
                    /token=Bearer/
                );
                expect(response.body.status).toBe(true);
                expect(response.body.message).toBe("Login Successful");
                expect(response.body.result).toHaveProperty("name");
                expect(response.body.result).toHaveProperty("email");
                expect(response.body.result.name).toBe("aditya");
                expect(response.body.result.email).toBe("aditya@gmail.com");
            });
        });
    });

    describe("Fetch user details", () => {
        describe("Given no token", () => {
            it("should throw an error with 401 status code", async () => {
                const response = await supertest(app)
                    .get("/api/v1/auth/fetch-user-details")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(401);
                expect(response.body.message).toBe("No token provided");
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given an invalid token", () => {
            it("should throw an error with 404 status code if token does not start with Bearer", async () => {
                const token = "invalid";

                const response = await supertest(app)
                    .get("/api/v1/auth/fetch-user-details")
                    .set("Cookie", `token=${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(401);
                expect(response.body.message).toBe("No token provided");
                expect(response.body.status).toBe(false);
            });

            it("should throw an error with 401 status code if token is invalid", async () => {
                const token = "invalid";

                const response = await supertest(app)
                    .get("/api/v1/auth/fetch-user-details")
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(response.status).toBe(401);
                expect(response.body.message).toBe(
                    "Not authorized to access this route"
                );
                expect(response.body.status).toBe(false);
            });
        });

        describe("Given a valid token", () => {
            it("should return user details and 200 status code", async () => {
                const payload = {
                    email: user.email,
                    password: "aditya123",
                };

                const response = await supertest(app)
                    .post("/api/v1/auth/login")
                    .send(payload)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                const token = response.headers["set-cookie"][0]
                    .split("=")[1]
                    .slice(9);

                const userResponse = await supertest(app)
                    .get("/api/v1/auth/fetch-user-details")
                    .set("Cookie", `token=Bearer ${token}`)
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json");

                expect(userResponse.status).toBe(200);
                expect(userResponse.body.status).toBe(true);
                expect(userResponse.body.message).toBe(
                    "User details fetched successfully!"
                );

                expect(userResponse.body.result).toEqual({
                    __v: 0,
                    _id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                });
            });
        });
    });
});
