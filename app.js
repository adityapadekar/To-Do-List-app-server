/*******************************************************************************
 * Server Setup
 ******************************************************************************/
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

const {
    errorHandlerMiddleware,
    pageNotFoundMiddleware,
} = require("./middlewares");

/*******************************************************************************
 * Testing Get Route
 ******************************************************************************/

app.get("/", (req, res) => {
    res.send("CodeFeast Server!");
});

/*******************************************************************************
 * HandleRouting
 ******************************************************************************/
const { authRouter } = require("./routes/authRouter");
const { taskRouter } = require("./routes/taskRouter");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);

/*******************************************************************************
 * Manage Unexpected Errors
 ******************************************************************************/
app.use(pageNotFoundMiddleware);
app.use(errorHandlerMiddleware);

/*******************************************************************************
 * Export app
 ******************************************************************************/
module.exports = { app };
