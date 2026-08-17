const express = require("express");

const router = express.Router();

const StudentController = require("../controllers/student.controller");

const {
  validateCreateStudent,
} = require("../middlewares/validate.middleware");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");


// =============================
// Student Registration
// =============================
router.post(
  "/",
  validateCreateStudent,
  StudentController.createStudent
);


// =============================
// Student Login
// =============================
router.post(
  "/login",
  StudentController.loginStudent
);


// =============================
// Admin Only - Get All Students
// =============================
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  StudentController.getAllStudents
);


// =============================
// Admin Only - Get Student
// =============================
router.get(
  "/:studentId",
  authenticateToken,
  authorizeRoles("admin"),
  StudentController.getStudentById
);


// =============================
// Admin Only - Update Student
// =============================
router.put(
  "/:studentId",
  authenticateToken,
  authorizeRoles("admin"),
  StudentController.updateStudent
);


// =============================
// Admin Only - Delete Student
// =============================
router.delete(
  "/:studentId",
  authenticateToken,
  authorizeRoles("admin"),
  StudentController.deleteStudent
);

router.post(
  "/logout",
  authenticateToken,
  authorizeRoles("student"),
  StudentController.studentLogout
);


module.exports = router;