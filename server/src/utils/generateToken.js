const jwt = require("jsonwebtoken");

const generateToken = (user, role = "admin") => {
  return jwt.sign(
    {
      id: user.id,
      role: role,

      // Admin
      ...(role === "admin" && {
        username: user.username,
      }),

      // Student
      ...(role === "student" && {
        student_id: user.student_id,
      }),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

module.exports = generateToken;