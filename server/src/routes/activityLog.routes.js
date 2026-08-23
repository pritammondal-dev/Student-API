const express = require("express");

const router = express.Router();

const ActivityLogController = require("../controllers/activityLog.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

// =============================
// Get Activity Logs
// Admin Only
// =============================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  ActivityLogController.getActivityLogs
);

module.exports = router;