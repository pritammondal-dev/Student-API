const express = require("express");

const router = express.Router();

const DocumentController = require("../controllers/document.controller");

const authenticateToken = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

const upload = require("../middlewares/upload.middleware");

// =============================
// Create Document
// Admin Only
// =============================
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("document"),
  DocumentController.createDocument
);

// =============================
// Get All Documents
// Admin + Student
// =============================
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin", "student"),
  DocumentController.getAllDocuments
);

// =============================
// Get Document By ID
// Admin + Student
// =============================
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin", "student"),
  DocumentController.getDocumentById
);

// =============================
// View / Download Document File
// Admin + Student
// =============================
router.get(
  "/:id/file",
  authenticateToken,
  authorizeRoles("admin", "student"),
  DocumentController.getDocumentFile
);

// =============================
// Update Document
// Admin Only
// =============================
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  upload.single("document"),
  DocumentController.updateDocument
);

// =============================
// Delete Document
// Admin Only
// =============================
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  DocumentController.deleteDocument
);

module.exports = router;