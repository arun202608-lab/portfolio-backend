import mongoose from "mongoose";

/**
 * Connect to MongoDB Atlas using Mongoose
 */
export async function connectDB() {
  // If already connected, return existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

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
    return null;
  }
}

export default connectDB;
