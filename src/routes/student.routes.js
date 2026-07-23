const express = require("express");

const router = express.Router();

const StudentController = require("../controllers/student.controller");


// Create a new student
router.post("/", StudentController.createStudent);


// Get all students
router.get("/", StudentController.getAllstudents);

// get student by ID
 router.get("/:id", StudentController.getStudentById);

// console.log(StudentController);
module.exports = router;



