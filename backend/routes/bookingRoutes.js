const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================================
// CREATE BOOKING
// POST /api/bookings
// ======================================================

router.post(
  "/",
  protect,
  createBooking
);


// ======================================================
// GET MY BOOKINGS
// GET /api/bookings/my
// ======================================================

router.get(
  "/my",
  protect,
  getMyBookings
);


// ======================================================
// CANCEL BOOKING
// DELETE /api/bookings/:id
// ======================================================

router.delete(
  "/:id",
  protect,
  cancelBooking
);


module.exports = router;