import express from "express";
import { loginAdmin, getAdminProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateLogin } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/login", validateLogin, loginAdmin);
router.get("/me", protect, getAdminProfile);

export default router;
