const { app } = require("./app");
const { connectDB } = require("./db/connect");

/*******************************************************************************
 * Start Server
 ******************************************************************************/
const port = process.env.PORT || 8080;
const mongoDBConnectionUri = process.env.MONGO_DB_URI;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB(mongoDBConnectionUri);

        // Start Server
        app.listen(
            port,
            () => console.log(`Server is listening on port : ${port}`) // eslint-disable-line
        );
    } catch (error) {
        console.log(error); // eslint-disable-line
    }
};

startServer();
