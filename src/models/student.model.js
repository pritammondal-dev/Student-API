const db = require("../config/database");

// Create a Student model
const createStudent = (studentData, callback) => {
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

        db.query(sql, values, callback);
};

module.exports = {
    createStudent
}