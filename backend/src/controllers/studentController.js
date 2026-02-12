const Student = require("../models/Student");

// GET /students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students", error: error.message });
  }
};

// POST /students
exports.createStudent = async (req, res) => {
  try {
    const { name, email, phone, course, status } = req.body;

    const student = await Student.create({
      name,
      email,
      phone,
      course,
      status
    });

    res.status(201).json(student);
  } catch (error) {
    // Mongoose validation errors should be 400
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Failed to create student", error: error.message });
  }
};

// PUT /students/:id
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true // IMPORTANT: runs schema validation on update also
    });

    if (!updated) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};

// DELETE /students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};
