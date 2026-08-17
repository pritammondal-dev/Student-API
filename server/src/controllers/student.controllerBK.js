

const Student = require("../models/student.model");

// Create Student
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (err) {
    next(err);
  }
};

// Get All Students
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

// Get Student By ID
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

// Update Student
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

// Delete Student
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
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};