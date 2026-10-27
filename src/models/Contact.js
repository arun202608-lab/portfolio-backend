import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [emailRegex, "Please provide a valid email address"],
      maxlength: [254, "Email cannot exceed 254 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [150, "Subject cannot exceed 150 characters"],
    },
    message: {
      type: String,
      required: [true, "Message body is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
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

// Index for chronological querying
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
