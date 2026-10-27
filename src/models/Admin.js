import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Admin password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Do not return password by default in queries
    },
    name: {
      type: String,
      default: "Admin",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving if modified
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
