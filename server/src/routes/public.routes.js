const express = require("express");

const router = express.Router();

const PublicController = require("../controllers/public.controller");

// =============================
// Public Notes Shop
// No authentication required
// =============================
router.get(
  "/documents",
  PublicController.getPublicDocuments
);

module.exports = router;