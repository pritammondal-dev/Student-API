const StudentModel = require("../models/student.model");

// Create a new student
const createStudent = async (req, res) => {
    const studentData = req.body;

    try {
        const result = await StudentModel.createStudent(req.body);
        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            studentID: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Get all students

const getAllstudents = async (req, res) => {

    try{
        const students = await StudentModel.getAllstudents();

        return res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            total: students.length,
            data: students
        });

    } catch (err){

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving students",
        });
    }
};


// get student by ID

const getStudentById = async (req, res) => {
    

    try {
        const studentId = req.params.id;

        const student = await StudentModel.getStudentById(studentId);

        if (!student){
            return res.status(404).json({
                sucess: false,
                message: "Student not found"
            });
        }


        return res.status(200).json({
            sucess: true,
            message: "Student retrieved successfully",
            data: student
        });

    }catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the student",
        });
    }

};

module.exports = {
    createStudent,
    getAllstudents,
    getStudentById
};

