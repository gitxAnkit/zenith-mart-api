const mongoose = require('mongoose');
const dns = require('dns');

// Forces Node.js to use Google's DNS servers for SRV resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = () => {
    const dbUri = process.env.DB_URI || process.env.MONGODB_URI || process.env.DB_URL;

    if (!dbUri) {
        console.error("Database connection URI is not defined!");
        return;
    }

    // Mask password in logs to protect credentials
    const maskedUri = dbUri.replace(/:([^@]+)@/, ':****@');
    console.log(`Connecting to database at: ${maskedUri}`);

    mongoose
        .connect(dbUri)
        .then((data) => {
            console.log(`MongoDB connected with server ${data.connection.host}`);
        })
        .catch((err) => {
            console.error('Database connection error:', err);
        });
};

module.exports = connectDB;
