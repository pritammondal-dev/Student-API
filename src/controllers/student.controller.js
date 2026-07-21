const StudentModel = require("../models/student.model");

// Create a new student
const createStudent = (req, res) => {
    const studentData = req.body;

    StudentModel.createStudent(studentData, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            studentID: result.insertId
        });

    });

};

module.exports ={
    createStudent
};