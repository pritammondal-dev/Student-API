const express = require("express");

const router = express.Router();

const PurchaseController = require("../controllers/purchase.controller");

const authenticateToken = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

// =============================
// Get My Purchased Documents
// Student Only
// =============================

router.get(
  "/my-purchases",
  authenticateToken,
  authorizeRoles("student"),
  PurchaseController.getMyPurchases
);

router.get(
  "/admin",
  authenticateToken,
  authorizeRoles("admin"),
  PurchaseController.getAllPurchases
);

module.exports = router;