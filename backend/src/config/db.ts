import mongoose from "mongoose";
import logger from "./logger.js";

async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    logger.info("Database connected successfully");
  } catch (error) {
    logger.fatal(error, "Failed to connect to database");

    process.exit(1);
  }
}
export default connectDb;
