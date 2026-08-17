const express = require("express");

const router = express.Router();

const AdminController = require("../controllers/admin.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

// Get all activity logs
router.get(
  "/activity-logs",
  authenticateToken,
  authorizeRoles("admin"),
  AdminController.getActivityLogs
);


router.get(
  "/payment-logs",
  authenticateToken,
  authorizeRoles("admin"),
  AdminController.getPaymentLogs
);

// Purchase History
router.get(
  "/purchases",
  authenticateToken,
  authorizeRoles("admin"),
  AdminController.getPurchases
);

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles("admin"),
  AdminController.getDashboardStats
);

module.exports = router;