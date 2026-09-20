const Event = require("../models/Event");
const Category = require("../models/Category");

// ======================================================
// CREATE EVENT
// ADMIN ONLY
// ======================================================

const createEvent = async (req, res) => {
  try {
    console.log("========== CREATE EVENT ==========");

    // This is an extra safety check.
    // The route already uses adminOnly middleware.
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      address,
      image,
      organizer,
      capacity,
      price,
    } = req.body;

    // ==================================================
    // REQUIRED FIELDS
    // ==================================================

    if (
      !title ||
      !description ||
      !category ||
      !date ||
      !time ||
      !venue ||
      !organizer ||
      !capacity
    ) {
      return res.status(400).json({
        message:
          "Please provide all required event details",
      });
    }

    // ==================================================
    // CHECK CATEGORY
    // ==================================================

    const categoryExists =
      await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // ==================================================
    // CREATE EVENT
    // ==================================================

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      address,
      image,
      organizer,
      capacity,
      availableSeats: capacity,
      price: price || 0,
    });

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    console.error(
      "Create Event Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while creating event",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL EVENTS
// PUBLIC
// ======================================================

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate(
        "category",
        "name description"
      )
      .sort({
        date: 1,
      });

    return res.status(200).json({
      count: events.length,
      events,
    });

  } catch (error) {
    console.error(
      "Get Events Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching events",
      error: error.message,
    });
  }
};

// ======================================================
// GET UPCOMING EVENTS
// PUBLIC
// ======================================================

const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      date: {
        $gte: new Date(),
      },
      status: "upcoming",
    })
      .populate(
        "category",
        "name"
      )
      .sort({
        date: 1,
      });

    return res.status(200).json({
      count: events.length,
      events,
    });

  } catch (error) {
    console.error(
      "Upcoming Events Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching upcoming events",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE EVENT
// PUBLIC
// ======================================================

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(
      req.params.id
    ).populate(
      "category",
      "name description"
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.status(200).json({
      event,
    });

  } catch (error) {
    console.error(
      "Get Event Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while fetching event",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE EVENT
// ADMIN ONLY
// ======================================================

const updateEvent = async (req, res) => {
  try {
    console.log("========== UPDATE EVENT ==========");

    // Extra safety check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    const { id } = req.params;

    // ==================================================
    // FIND EVENT
    // ==================================================

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // ==================================================
    // REQUEST DATA
    // ==================================================

    const {
      title,
      description,
      category,
      date,
      time,
      venue,
      address,
      image,
      organizer,
      capacity,
      price,
      status,
    } = req.body;

    // ==================================================
    // CATEGORY VALIDATION
    // ==================================================

    if (category !== undefined) {
      const categoryExists =
        await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          message: "Category not found",
        });
      }

      event.category = category;
    }

    // ==================================================
    // CAPACITY
    // ==================================================

    if (capacity !== undefined) {
      const bookedSeats =
        event.capacity -
        event.availableSeats;

      if (capacity < bookedSeats) {
        return res.status(400).json({
          message:
            "Capacity cannot be less than already booked seats",
        });
      }

      event.availableSeats =
        capacity - bookedSeats;

      event.capacity = capacity;
    }

    // ==================================================
    // UPDATE FIELDS
    // ==================================================

    if (title !== undefined) {
      event.title = title;
    }

    if (description !== undefined) {
      event.description =
        description;
    }

    if (date !== undefined) {
      event.date = date;
    }

    if (time !== undefined) {
      event.time = time;
    }

    if (venue !== undefined) {
      event.venue = venue;
    }

    if (address !== undefined) {
      event.address = address;
    }

    if (image !== undefined) {
      event.image = image;
    }

    if (organizer !== undefined) {
      event.organizer = organizer;
    }

    if (price !== undefined) {
      event.price = price;
    }

    if (status !== undefined) {
      event.status = status;
    }

    // ==================================================
    // SAVE
    // ==================================================

    await event.save();

    // ==================================================
    // GET UPDATED EVENT
    // ==================================================

    const updatedEvent =
      await Event.findById(id)
        .populate(
          "category",
          "name description"
        );

    return res.status(200).json({
      message:
        "Event updated successfully",
      event: updatedEvent,
    });

  } catch (error) {
    console.error(
      "Update Event Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while updating event",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE EVENT
// ADMIN ONLY
// ======================================================

const deleteEvent = async (req, res) => {
  try {
    console.log("========== DELETE EVENT ==========");

    // Extra safety check
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    // ==================================================
    // FIND EVENT
    // ==================================================

    const event =
      await Event.findByIdAndDelete(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      message:
        "Event deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Event Error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error while deleting event",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createEvent,
  getEvents,
  getUpcomingEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};