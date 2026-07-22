const db = require("../config/database");

// Create a Student model
const createStudent = async (studentData) => {
    const sql = `
        INSERT INTO students 
        (student_id, name, email, phone, age)
        VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            studentData.student_id,
            studentData.name,
            studentData.email,
            studentData.phone,
            studentData.age
        ];

        const [result] = await db.query(sql, values);
        return result;
};


// Get all students

const getAllstudents = async () => {
        const sql = `
           SELECT
    id,
    student_id,
    name,
    email,
    phone,
    age,
    created_at,
    updated_at
FROM students
ORDER BY id DESC;
        `;
    const [rows] = await db.query(sql);
    return rows;
};

module.exports = {
    createStudent,
    getAllstudents
};


