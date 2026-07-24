// Import the Express framework
import express from "express";

// Create an Express application
const app = express();

// Middleware to parse incoming JSON data
// Without this, req.body will be undefined for JSON requests
app.use(express.json());

// Define the default route (Home Route)
// When a GET request is made to "/", send a response
app.get("/", (req, res) => {
  res.send("API is Running...");
});

// Export the app so it can be used in server.js
export default app;
