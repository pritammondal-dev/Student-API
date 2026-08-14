const express = require("express");

const router = express.Router();

const StudentController = require("../controllers/student.controller");
const {
    validateCreateStudent
} = require("../middlewares/validate.middleware");

const authenticateToken = require("../middlewares/auth.middleware");


// Create a new student
router.post("/", validateCreateStudent, StudentController.createStudent);


// Get all students
router.get("/",authenticateToken, StudentController.getAllStudents);

// get student by ID
router.get("/:studentId",authenticateToken, StudentController.getStudentById);

//update student data
router.put("/:studentId", authenticateToken, StudentController.updateStudent);


// Delete a student data
router.delete("/:studentId", authenticateToken, StudentController.deleteStudent);

// console.log(StudentController);
module.exports = router;



