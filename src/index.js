// Import necessary modules

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
import cors from 'cors';
// Library for loading environment variables from a .env file
import dotenv from 'dotenv';
// Main Express application
import app from './app.js';
// Connect to MongoDB database
import connectMongoDB from './db/db.config.js';

// Load environment variables from .env file
dotenv.config();

// Enable CORS middleware for the application
app.use(cors({
    origin: [process.env.CORS_ORIGIN],
    credentials: true
}));

// Define the port on which the server will listen
const PORT = process.env.PORT || 8080;

// The startServer function is called when the server is ready
const startServer = async () => {
    // Connect to MongoDB
    await connectMongoDB();
    // Log server's address upon successful startup
    console.log(`Store your task app is running at http://localhost:${PORT}/.`);
};

// Starts the server with startSever() and listens on the specified PORT
app.listen(PORT, startServer);
