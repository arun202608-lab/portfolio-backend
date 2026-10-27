import mongoose from "mongoose";
import Project from "../models/Project.js";

const DEFAULT_PROJECTS = [
  {
    title: "Food Delivery System",
    category: "Full Stack Development",
    description:
      "A food delivery application with user authentication, cart management, order placement and an admin panel.",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    tech: ["React", "Node.js", "MongoDB"],
    demo: "",
    order: 1,
  },
  {
    title: "Employee Portal",
    category: "Web Application",
    description:
      "An employee portal with role-based access management and organized employee information.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    tech: ["React", "Express.js", "MongoDB"],
    demo: "",
    order: 2,
  },
  {
    title: "Vessel Rental Website",
    category: "Frontend Development",
    description:
      "A responsive vessel rental website with rental information, service details and an interactive map.",
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80",
    tech: ["React", "CSS", "Leaflet"],
    demo: "",
    order: 3,
  },
  {
    title: "Helppme NGO Website",
    category: "NGO Website",
    description:
      "An NGO website showcasing community initiatives, social activities and healthcare camps.",
    image:
      "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=900&q=80",
    tech: ["React", "Node.js", "MongoDB"],
    demo: "https://helppme.in",
    order: 4,
  },
  {
    title: "Developer Portfolio",
    category: "Frontend Development",
    description:
      "A personal portfolio website presenting technical skills, projects and contact information.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    tech: ["React", "JavaScript", "CSS"],
    demo: "",
    order: 5,
  },
];

/**
 * @desc    Get all portfolio projects
 * @route   GET /api/projects
 * @access  Public
 */
export async function getAllProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Get single project by ID
 * @route   GET /api/projects/:id
 * @access  Public
 */
export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin)
 */
export async function createProject(req, res, next) {
  try {
    const { title, category, description, image, tech, demo, github, order } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project category is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project description is required.",
      });
    }

    // Normalize tech stack array
    let normalizedTech = [];
    if (Array.isArray(tech)) {
      normalizedTech = tech.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tech === "string") {
      normalizedTech = tech.split(",").map((t) => t.trim()).filter(Boolean);
    }

    if (normalizedTech.length === 0) {
      normalizedTech = ["React"];
    }

    const newProject = await Project.create({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      image: image && image.trim() ? image.trim() : undefined,
      tech: normalizedTech,
      demo: demo ? demo.trim() : "",
      github: github ? github.trim() : "",
      order: typeof order === "number" ? order : 0,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: newProject,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Update an existing project
 * @route   PUT /api/projects/:id
 * @access  Private (Admin)
 */
export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { title, category, description, image, tech, demo, github, order } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    if (title && title.trim()) project.title = title.trim();
    if (category && category.trim()) project.category = category.trim();
    if (description && description.trim()) project.description = description.trim();
    if (image !== undefined) project.image = image.trim();
    if (demo !== undefined) project.demo = demo.trim();
    if (github !== undefined) project.github = github.trim();
    if (order !== undefined) project.order = Number(order) || 0;

    if (tech !== undefined) {
      if (Array.isArray(tech)) {
        project.tech = tech.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tech === "string") {
        project.tech = tech.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: project,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private (Admin)
 */
export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      data: { id: project._id },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Auto-seed default projects if collection is empty
 */
export async function seedInitialProjects() {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const count = await Project.countDocuments();
    if (count === 0) {
      console.log("🌱 [Seed] No portfolio projects found. Initializing default projects...");
      await Project.insertMany(DEFAULT_PROJECTS);
      console.log(`✅ [Seed] Initialized ${DEFAULT_PROJECTS.length} default portfolio projects.`);
    }
  } catch (error) {
    console.warn("⚠️ [Seed] Could not initialize default projects:", error.message);
  }
}
