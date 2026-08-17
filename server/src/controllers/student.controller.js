const Student = require("../models/student.model");
const createActivityLog = require("../utils/activityLogger");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// =============================
// Create Student / Register
// =============================
const createStudent = async (req, res, next) => {
  try {
    const { student_id, name, email, password, phone, age, gender } = req.body;

    // Check required password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Check Student ID
    const existingStudentId = await Student.findOne({
      where: { student_id },
    });

    if (existingStudentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID already exists",
      });
    }

    // Check Email
    const existingEmail = await Student.findOne({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Student
    const student = await Student.create({
      student_id,
      name,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: {
        id: student.id,
        student_id: student.student_id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        gender: student.gender,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// Student Login
// =============================
const loginStudent = async (req, res, next) => {
  try {
    const { student_id, password } = req.body;

    // Validate input
    if (!student_id || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID and password are required",
      });
    }

    // Find Student
    const student = await Student.findOne({
      where: { student_id },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Existing students may not have a password
    if (!student.password) {
      return res.status(403).json({
        success: false,
        message:
          "Password is not set for this student. Please contact the administrator.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    await createActivityLog({
      userId: student.id,
      userType: "student",
      action: "login",
      req,
    });

    // Generate JWT
    const token = generateToken(student, "student");
    return res.status(200).json({
      success: true,
      message: "Student login successful",
      token,
      data: {
        id: student.id,
        student_id: student.student_id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const studentLogout = async (req, res, next) => {
  try {
  await createActivityLog({
  userId: req.user.id,
  userType: "student",
  action: "logout",
  req,
});

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// Get All Students
// =============================
const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Students retrieved successfully",
      total: students.length,
      data: students,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// Get Student By ID
// =============================
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      where: {
        student_id: req.params.studentId,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// Update Student
// =============================
const updateStudent = async (req, res, next) => {
  try {
    const [updatedRows] = await Student.update(req.body, {
      where: {
        student_id: req.params.studentId,
      },
    });

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = await Student.findOne({
      where: {
        student_id: req.params.studentId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
// Delete Student
// =============================
const deleteStudent = async (req, res, next) => {
  try {
    const deletedRows = await Student.destroy({
      where: {
        student_id: req.params.studentId,
      },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createStudent,
  loginStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  studentLogout,
};
