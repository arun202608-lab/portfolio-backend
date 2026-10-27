import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes: view projects
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Protected routes: admin management
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.patch("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

export default router;
