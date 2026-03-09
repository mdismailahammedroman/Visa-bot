/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { envVar } from "./EnvVar";
import logger from "./logger";


export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envVar.MONGODB_URL);
    logger.info("MongoDB connected", {
      db: mongoose.connection.name,
      host: mongoose.connection.host,
    });
  } catch (error: any) {
    logger.error("❌ MongoDB connection failed:", error?.message || error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
     logger.info("✅ MongoDB disconnected");
  } catch (error: any) {
    logger.error("❌ MongoDB disconnect failed:", error?.message || error);
  }
};
