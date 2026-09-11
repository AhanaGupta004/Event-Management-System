const express = require("express");

const {
  createEvent,
  getEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

const {
  adminOnly,
} = require("../middleware/adminMiddleware");

const router = express.Router();

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all events
router.get("/", getEvents);

// Get upcoming events
router.get("/upcoming", getUpcomingEvents);

// Get single event
router.get("/:id", getEventById);


// ======================================================
// ADMIN ONLY ROUTES
// ======================================================

// Create event
router.post(
  "/",
  protect,
  adminOnly,
  createEvent
);

// Update event
router.put(
  "/:id",
  protect,
  adminOnly,
  updateEvent
);

// Delete event
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteEvent
);

module.exports = router;