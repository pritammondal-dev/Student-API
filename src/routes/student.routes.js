const express = require("express");

const router = express.Router();

const StudentController = require("../controllers/student.controller");


// Create a new student
router.post("/", StudentController.createStudent);


// Get all students
router.get("/", StudentController.getAllstudents);

// console.log(StudentController);
module.exports = router;



