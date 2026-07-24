<<<<<<< HEAD
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ Database Connection Failed");
=======
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
>>>>>>> 18731c1e572976ee0c0efff05250075da39d744f
    process.exit(1);
  }
};

<<<<<<< HEAD
export default connectDB;
=======
// Export the function so it can be called from server.js
export default connectDB;
>>>>>>> 18731c1e572976ee0c0efff05250075da39d744f
