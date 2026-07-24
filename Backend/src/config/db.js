// Import the Mongoose library
// Mongoose is used to connect Node.js with MongoDB
import mongoose from "mongoose";

// Create an asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string stored in .env
    await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, print a success message
    console.log("✅ MongoDB Connected");
  } catch (error) {
    // If connection fails, print an error message
    console.log("❌ Database Connection Failed");

    // Print the actual error message
    console.log(error.message);

    // Stop the application because database connection is required
    process.exit(1);
  }
};

// Export the function so it can be called from server.js
export default connectDB;
