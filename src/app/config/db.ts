import mongoose from "mongoose";
import { envVar } from "./EnvVar";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envVar.MONGODB_URL);
    console.log("✅ MongoDB connected");
    console.log("🗄️ DB Name:", mongoose.connection.name);
    console.log("🌐 DB Host:", mongoose.connection.host);
  } catch (error: any) {
    console.error("❌ MongoDB connection failed:", error?.message || error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB disconnected");
  } catch (error: any) {
    console.error("❌ MongoDB disconnect failed:", error?.message || error);
  }
};
