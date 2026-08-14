const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Parse JSON
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Student API is running successfully",
    });
});

// Auth Routes
app.use("/api/v1/users", authRoutes);

// Student Routes
app.use("/api/v1/students", studentRoutes);

// 404 Handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;