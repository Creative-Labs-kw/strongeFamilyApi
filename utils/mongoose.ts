import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectToDatabase;
