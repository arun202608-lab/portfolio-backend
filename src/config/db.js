import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas using Mongoose
 */
export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.warn(
        "⚠️ [MongoDB] MONGODB_URI is not defined in environment variables. Database operations will fail."
      );
      return null;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`📦 [MongoDB] Database name: ${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ [MongoDB] Connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ [MongoDB] Disconnected from MongoDB Atlas.");
    });

    return conn;
  } catch (error) {
    console.error("❌ [MongoDB] Connection failed:", error.message);
    // Don't kill the server process so that health endpoints still respond with status
    return null;
  }
}

export default connectDB;
