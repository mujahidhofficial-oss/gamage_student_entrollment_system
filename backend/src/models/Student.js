const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
      match: [/^\d{10}$/, "Phone must be exactly 10 digits"]
      // If you want allow 9-12 digits use: /^\d{9,12}$/
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["Enrolled", "Pending", "Completed"], // optional but good for evaluation
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
