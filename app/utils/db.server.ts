import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from 'path'

// * Load  environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), '.env') })

const MONGODB_URI = process.env.MONGODB_URI as string; // Store in .env

export const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "editor",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
