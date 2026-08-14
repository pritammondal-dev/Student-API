// const db = require("../config/database");

// // Create a Student model
// const createStudent = async (studentData) => {
//     const sql = `
//         INSERT INTO students 
//         (student_id, name, email, phone, age)
//         VALUES (?, ?, ?, ?, ?)
//         `;

//         const values = [
//             studentData.student_id,
//             studentData.name,
//             studentData.email,
//             studentData.phone,
//             studentData.age
//         ];

//         const [result] = await db.query(sql, values);
//         return result;
// };


// // Get all students

// const getAllStudents = async () => {
//         const sql = `
//            SELECT
//     id,
//     student_id,
//     name,
//     email,
//     phone,
//     age,
//     created_at,
//     updated_at
// FROM students
// ORDER BY id DESC;
//         `;
//     const [rows] = await db.query(sql);
//     return rows;
// };



// // get student by ID
// const getStudentById = async (studentId) => {
//     const sql = `
//         SELECT
//     id,
//     student_id,
//     name,   
//     email,
//     phone,
//     age,
//     created_at,
//     updated_at
//     FROM students
//     WHERE id = ?
//     `;

//     const [rows] = await db.execute(sql, [studentId]);

//     return rows.length > 0 ? rows[0] : null;
// };


// // Update student data

// const updateStudent = async(studentId, studentData) => {

//     const sql = `
//     UPDATE students 
//     SET 
//         student_id = ?,
//         name = ?,
//         email = ?,
//         phone = ?,
//         age = ?
//         WHERE id = ?    
//     `;


//     const values = [
//         studentData.student_id,
//         studentData.name,
//         studentData.email,
//         studentData.phone,
//         studentData.age,
//         studentId
//     ];

//     const [result] = await db.execute(sql, values);

//     return result;
// };

// // delete student data

// const deleteStudent = async(studentId, studentData) => {
//     const sql = `
//     DELETE FROM students 
//     WHERE id = ?
//     `;

//     const [result] = await db.execute(sql, [studentId]);

//     return  result;
// };

// module.exports = {
//     createStudent,
//     getAllStudents,
//     getStudentById,
//     updateStudent,
//     deleteStudent
// };


