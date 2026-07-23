const express = require("express");

const router = express.Router();

const StudentController = require("../controllers/student.controller");
const {
    validateCreateStudent
} = require("../middlewares/validate.middleware");


// Create a new student
router.post("/", validateCreateStudent, StudentController.createStudent);


// Get all students
router.get("/", StudentController.getAllStudents);

// get student by ID
router.get("/:id", StudentController.getStudentById);

//update student data
router.put("/:id", StudentController.updateStudent);


// Delete a student data
router.delete("/:id", StudentController.deleteStudent);

// console.log(StudentController);
module.exports = router;



