const express = require("express");

const router = express.Router();

const EventController = require("../controllers/event.controller");

const authenticateToken = require("../middlewares/auth.middleware");

const authorizeRoles = require("../middlewares/role.middleware");

// =============================
// Public Events
// No Authentication
// =============================

router.get(
  "/public",
  EventController.getPublicEvents
);

router.get(
  "/public/:id",
  EventController.getPublicEventById
);

// =============================
// Create Event
// Admin Only
// =============================

router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  EventController.createEvent
);

// =============================
// Get All Events
// Admin Only
// =============================

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  EventController.getAllEvents
);

// =============================
// Get Event By ID
// Admin Only
// =============================

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  EventController.getEventById
);

// =============================
// Update Event
// Admin Only
// =============================

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  EventController.updateEvent
);

// =============================
// Delete Event
// Admin Only
// =============================

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  EventController.deleteEvent
);

module.exports = router;