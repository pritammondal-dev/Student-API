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
router.get("/:id",authenticateToken, StudentController.getStudentById);

//update student data
router.put("/:id", authenticateToken, StudentController.updateStudent);


// Delete a student data
router.delete("/:id", authenticateToken, StudentController.deleteStudent);

// console.log(StudentController);
module.exports = router;



