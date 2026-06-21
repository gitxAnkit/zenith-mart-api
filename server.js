const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// config
// dotenv.config({ path: "backend/config/config.env" });
dotenv.config({ path: "./config/.env" });
// connection
connectDB();


// Handling uncaught exception
process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);

    process.exit(1);
})

const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started at PORT:${process.env.PORT}`)
})


// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Uhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
});