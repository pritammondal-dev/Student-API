const express = require("express");

const router = express.Router();

const NoticeController = require("../controllers/notice.controller");

const authenticateToken = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

// =============================
// Public Notices
// No Authentication
// =============================

router.get(
  "/public",
  NoticeController.getPublicNotices
);

router.get(
  "/public/:id",
  NoticeController.getPublicNoticeById
);

// =============================
// Create Notice
// Admin Only
// =============================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  NoticeController.createNotice
);

// =============================
// Get All Notices
// Admin Only
// =============================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  NoticeController.getAllNotices
);

// =============================
// Get Notice By ID
// Admin Only
// =============================

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  NoticeController.getNoticeById
);

// =============================
// Update Notice
// Admin Only
// =============================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  NoticeController.updateNotice
);

// =============================
// Delete Notice
// Admin Only
// =============================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  NoticeController.deleteNotice
);

module.exports = router;