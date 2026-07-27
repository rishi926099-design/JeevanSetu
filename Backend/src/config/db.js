import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
<<<<<<< HEAD
    console.error("❌ Database Connection Failed:", error.message);
=======
    console.error("❌ Database Connection Failed");
    console.error(error.message);
>>>>>>> e74025c (Updated login page)
    process.exit(1);
  }
};

export default connectDB;