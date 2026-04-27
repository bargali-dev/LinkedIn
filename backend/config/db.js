import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Successfully Connected...");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

export default connectDb;
