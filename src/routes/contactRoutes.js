import express from "express";
import {
  submitContactMessage,
  getAllMessages,
  getMessageById,
  toggleMessageReadStatus,
  deleteMessage,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateContact } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Public route: submit a message
router.post("/", validateContact, submitContactMessage);

// Protected routes: admin only
router.get("/", protect, getAllMessages);
router.get("/:id", protect, getMessageById);
router.patch("/:id/read", protect, toggleMessageReadStatus);
router.delete("/:id", protect, deleteMessage);

export default router;
