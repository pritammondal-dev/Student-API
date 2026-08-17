const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

const {
  register,
  login,
  logout
} = require("../controllers/auth.controller");

// Public Routes
router.post("/register", register);
router.post("/login", login);
// Protected Routes
router.post(
  "/logout",
  authenticateToken,
  authorizeRoles("admin"),
  logout
);

module.exports = router;