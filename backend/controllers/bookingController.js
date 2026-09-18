const Booking = require("../models/Booking");
const Event = require("../models/Event");

// ======================================================
// CREATE BOOKING
// ======================================================

const createBooking = async (req, res) => {
  try {
    console.log("========== CREATE BOOKING ==========");

    const { eventId } = req.body;

    // --------------------------------------------------
    // CHECK USER
    // --------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const userId = req.user.id;

    console.log("User ID:", userId);
    console.log("Event ID:", eventId);

    // --------------------------------------------------
    // CHECK EVENT ID
    // --------------------------------------------------

    if (!eventId) {
      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    // --------------------------------------------------
    // FIND EVENT
    // --------------------------------------------------

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    console.log("Event found:", event.title);
    console.log("Event status:", event.status);
    console.log("Available seats:", event.availableSeats);

    // --------------------------------------------------
    // CHECK EVENT STATUS
    // --------------------------------------------------

    if (event.status !== "upcoming") {
      return res.status(400).json({
        message: "This event is not available for booking",
      });
    }

    // --------------------------------------------------
    // CHECK AVAILABLE SEATS
    // --------------------------------------------------

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "Sorry, this event is fully booked",
      });
    }

    // --------------------------------------------------
    // CHECK DUPLICATE BOOKING
    // --------------------------------------------------

    const existingBooking = await Booking.findOne({
      user: userId,
      event: eventId,
      status: {
        $ne: "cancelled",
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You have already booked this event",
      });
    }

    // --------------------------------------------------
    // CREATE BOOKING
    // IMPORTANT:
    // Booking model allows pending, approved,
    // rejected and cancelled.
    // --------------------------------------------------

    const booking = await Booking.create({
      user: userId,
      event: eventId,
      status: "pending",
    });

    console.log("Booking created:", booking._id);

    // --------------------------------------------------
    // DECREASE AVAILABLE SEATS
    // --------------------------------------------------

    event.availableSeats -= 1;

    await event.save();

    console.log(
      "Remaining seats:",
      event.availableSeats
    );

    // --------------------------------------------------
    // GET COMPLETE BOOKING
    // --------------------------------------------------

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate({
          path: "event",
          populate: {
            path: "category",
          },
        })
        .populate(
          "user",
          "name email phone"
        );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      message: "Event booked successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error(
      "Create Booking Error:",
      error
    );

    return res.status(500).json({
      message: "Server error while creating booking",
      error: error.message,
    });
  }
};

// ======================================================
// GET MY BOOKINGS
// ======================================================

const getMyBookings = async (req, res) => {
  try {
    console.log("========== GET MY BOOKINGS ==========");

    // --------------------------------------------------
    // CHECK USER
    // --------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const userId = req.user.id;

    console.log("User ID:", userId);

    // --------------------------------------------------
    // GET USER BOOKINGS
    // --------------------------------------------------

    const bookings = await Booking.find({
      user: userId,
    })
      .populate({
        path: "event",
        populate: {
          path: "category",
        },
      })
      .sort({
        createdAt: -1,
      });

    console.log(
      "Number of bookings:",
      bookings.length
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    console.error(
      "Get My Bookings Error:",
      error
    );

    return res.status(500).json({
      message: "Server error while fetching bookings",
      error: error.message,
    });
  }
};

// ======================================================
// CANCEL BOOKING
// ======================================================

const cancelBooking = async (req, res) => {
  try {
    console.log("========== CANCEL BOOKING ==========");

    const bookingId = req.params.id;

    // --------------------------------------------------
    // CHECK USER
    // --------------------------------------------------

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User authentication required",
      });
    }

    const userId = req.user.id;

    console.log("Booking ID:", bookingId);
    console.log("User ID:", userId);

    // --------------------------------------------------
    // FIND BOOKING
    // --------------------------------------------------

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // --------------------------------------------------
    // CHECK ALREADY CANCELLED
    // --------------------------------------------------

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // --------------------------------------------------
    // FIND EVENT
    // --------------------------------------------------

    const event = await Event.findById(
      booking.event
    );

    // --------------------------------------------------
    // CANCEL BOOKING
    // --------------------------------------------------

    booking.status = "cancelled";

    await booking.save();

    // --------------------------------------------------
    // RETURN SEAT
    // --------------------------------------------------

    if (event) {
      event.availableSeats += 1;

      await event.save();

      console.log(
        "Seat returned. Available seats:",
        event.availableSeats
      );
    }

    console.log(
      "Booking cancelled:",
      bookingId
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Cancel Booking Error:",
      error
    );

    return res.status(500).json({
      message: "Server error while cancelling booking",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};