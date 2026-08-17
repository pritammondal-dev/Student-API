const express = require("express");

const router = express.Router();

const LibraryController = require("../controllers/library.controller");

const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

// Student Library
router.get(
  "/",
  authenticateToken,
  authorizeRoles("student"),
  LibraryController.getMyLibrary
);

// Securely view document file
router.get(
  "/:documentId/view",
  authenticateToken,
  authorizeRoles("student"),
  LibraryController.viewDocumentFile
);


// Get document information
router.get(
  "/:documentId",
  authenticateToken,
  authorizeRoles("student"),
  LibraryController.viewDocument
);

module.exports = router;