const { ValidationError, UniqueConstraintError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Sequelize Validation Error
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors.map(error => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

    // Sequelize Unique Constraint Error
    if (err instanceof UniqueConstraintError) {
    const field = err.errors[0].path;

    const messages = {
        student_id: "Student ID already exists.",
        email: "Email already exists.",
        username: "Username already exists.",
    };

    return res.status(409).json({
        success: false,
        message: messages[field] || `${field} already exists.`,
  });
}

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired.",
    });
  }

  // Default Error
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;