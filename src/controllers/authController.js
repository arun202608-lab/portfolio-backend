import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Generate a signed JWT token
 */
function generateToken(adminId, email) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign({ id: adminId, email }, secret, {
    expiresIn: "7d",
  });
}

/**
 * @desc    Authenticate admin and obtain JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    const normalizedIdentifier = email.trim().toLowerCase();

    // Find admin by email or username
    const admin = await Admin.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: normalizedIdentifier },
      ],
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password.",
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/username or password.",
      });
    }

    const token = generateToken(admin._id, admin.email);

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful.",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Get currently logged in admin profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export async function getAdminProfile(req, res) {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
}

/**
 * Auto-seed initial admin account if none exists and env credentials provided
 */
export async function seedInitialAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return;
    }

    // Only proceed if database is actively connected
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    const existingAdminCount = await Admin.countDocuments();
    if (existingAdminCount === 0) {
      console.log("🌱 [Seed] No admin accounts found. Initializing default admin from environment...");
      await Admin.create({
        email: adminEmail.trim().toLowerCase(),
        username: adminEmail.split("@")[0].toLowerCase(),
        password: adminPassword,
        name: "Portfolio Administrator",
      });
      console.log(`✅ [Seed] Admin account initialized for: ${adminEmail.trim().toLowerCase()}`);
    }
  } catch (error) {
    console.warn("⚠️ [Seed] Could not initialize default admin:", error.message);
  }
}
