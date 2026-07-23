const express = require("express");

const router = express.Router();

const StudentController = require("../controllers/student.controller");


// Create a new student
router.post("/", StudentController.createStudent);


// Get all students
router.get("/", StudentController.getAllStudents);

// get student by ID
router.get("/:id", StudentController.getStudentById);

//update student data
router.put("/:id", StudentController.updateStudent);

router 

// console.log(StudentController);
module.exports = router;



