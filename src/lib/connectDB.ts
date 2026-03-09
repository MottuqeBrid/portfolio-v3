import mongoose from "mongoose";

const DB_URL =
  process.env.DB_URL || ("mongodb://localhost:27017/portfolio-v3" as string);

export async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
