import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

/**
 * Middleware to protect admin routes using JWT verification
 */
export async function protect(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token is missing.",
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ [Auth] JWT_SECRET is not configured on the server.");
      return res.status(500).json({
        success: false,
        message: "Server authentication is misconfigured.",
      });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account associated with this token no longer exists.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or malformed authentication token.",
    });
  }
}

export default protect;
