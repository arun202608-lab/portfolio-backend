import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    category: {
      type: String,
      required: [true, "Project category is required"],
      trim: true,
      maxlength: [80, "Category cannot exceed 80 characters"],
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    image: {
      type: String,
      trim: true,
      default: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80",
    },
    tech: {
      type: [String],
      required: [true, "At least one technology is required"],
      default: ["React"],
    },
    demo: {
      type: String,
      trim: true,
      default: "",
      set: (val) => {
        if (!val) return "";
        const trimmed = String(val).trim();
        if (!trimmed) return "";
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      },
    },
    github: {
      type: String,
      trim: true,
      default: "",
      set: (val) => {
        if (!val) return "";
        const trimmed = String(val).trim();
        if (!trimmed) return "";
        return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        return ret;
      },
    },
  }
);

// Index for chronological ordering
projectSchema.index({ order: 1, createdAt: -1 });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
