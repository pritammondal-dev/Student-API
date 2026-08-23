const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/student.routes");
const authRoutes = require("./routes/auth.routes");
const documentRoutes = require("./routes/document.routes");
const errorHandler = require("./middlewares/error.middleware");
const paymentRoutes = require("./routes/payment.routes");
const libraryRoutes = require("./routes/library.routes");
const adminRoutes = require("./routes/admin.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const activityLogRoutes = require("./routes/activityLog.routes");

const app = express();

// =============================
// JSON
// =============================
app.use(express.json());

// =============================
// CORS
// =============================
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =============================
// Test Route
// =============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student API is running successfully",
  });
});

// =============================
// Auth Routes
// =============================
app.use("/api/v1/users", authRoutes);

// =============================
// Student Routes
// =============================
app.use("/api/v1/students", studentRoutes);

// =============================
// Document Routes
// =============================
app.use("/api/v1/documents", documentRoutes);

// =============================
// Payment Routes
// =============================
app.use("/api/v1/payments", paymentRoutes);

// =============================
// Purchase Routes
// =============================
app.use("/api/v1/purchases", purchaseRoutes);

// =============================
// Library Routes
// =============================
app.use("/api/v1/library", libraryRoutes);

// =============================
// Admin Routes
// =============================
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/activity-logs", activityLogRoutes);

// =============================
// 404 Handler
// =============================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =============================
// Global Error Handler
// =============================
app.use(errorHandler);

module.exports = app;