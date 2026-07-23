const StudentModel = require("../models/student.model");

// Create a new student
const createStudent = async (req, res, next) => {
    const studentData = req.body;

    try {
        const result = await StudentModel.createStudent(studentData);
        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            studentID: result.insertId
        });
    } catch (err) {
        next(err);
    }
};

// Get all students

const getAllStudents = async (req, res, next) => {

    try{
        const students = await StudentModel.getAllStudents();

        return res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            total: students.length,
            data: students
        });

    } catch (err){

       next(err);
    }
};


// get student by ID

const getStudentById = async (req, res, next) => {
    

    try {
        const studentId = req.params.id;

        const student = await StudentModel.getStudentById(studentId);

        if (!student){
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }


        return res.status(200).json({
            success: true,
            message: "Student retrieved successfully",
            data: student
        });

    }catch (err) {
        next(err);
    }

};

// Update students data
 const updateStudent = async (req, res, next) => {
    
    try{

        const studentId =req.params.id;

        const result =await StudentModel.updateStudent(
            studentId,
            req.body
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully"
        });

    } catch (err) {

      next(err);
    
    }
};

// delete student data

const deleteStudent = async (req, res, next) => {

    try{

        const studentId = req.params.id;

        const result= await StudentModel.deleteStudent(studentId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });

    }catch (err) {
       next(err);
    }
};




module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};

