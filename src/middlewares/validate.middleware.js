const { body, validationResult } = require("express-validator");

const validateCreateStudent = [

    body("student_id")
        .notEmpty()
        .withMessage("Student ID is required"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("phone")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits"),

    body("age")
        .isInt({ min: 1 })
        .withMessage("Age must be greater than 0"),

    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });

        }

        next();

    }

];

module.exports = {
    validateCreateStudent
};