
// Import dotenv package to load environment variables from the .env file
import dotenv from "dotenv";

// Load all variables from .env into process.env
dotenv.config();

// Import the Express app from app.js
// app.js contains middleware, routes, and Express configuration
import app from "./app.js";

// Import the function that connects to MongoDB
import connectDB from "./config/db.js";

// Read PORT from .env file
// If PORT is not available, use 5000 as the default port
const PORT = process.env.PORT || 9000;

// ----------------------
// Connect to Database
// ----------------------

// Call the function to establish a connection with MongoDB
connectDB();

// ----------------------
// Start Express Server
// ----------------------

// Start the server and listen for incoming client requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
