import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { seedInitialAdmin } from "./controllers/authController.js";
import { seedInitialProjects } from "./controllers/projectController.js";

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB Database
connectDB().then(() => {
  seedInitialAdmin();
  seedInitialProjects();
});

// Configure CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If no CORS_ORIGIN is specified, allow all in development
    if (allowedOrigins.length === 0) {
      return callback(null, true);
    }

    const isExplicitlyAllowed = allowedOrigins.includes(origin);
    const isVercelPreview =
      origin.endsWith(".vercel.app") &&
      allowedOrigins.some((allowed) => allowed.includes("vercel.app"));
    const isLocalhost =
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:");

    if (isExplicitlyAllowed || isVercelPreview || isLocalhost) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Health check endpoint
const healthHandler = (req, res) => {
  const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbStatus = dbStates[mongoose.connection.readyState] || "unknown";

  res.status(200).json({
    status: "ok",
    service: "portfolio-backend-api",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
  });
};

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Portfolio REST API is running.",
    documentation: "/api/health",
  });
});

// Ensure database connection for incoming requests (vital for serverless lambdas)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error("DB connection error in middleware:", err.message);
    }
  }
  next();
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", contactRoutes); // Alias for flexibility
app.use("/api/projects", projectRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 [Server] Portfolio backend running on port ${PORT}`);
  console.log(`📡 [Server] Health check: http://localhost:${PORT}/api/health`);
});

export default app;
