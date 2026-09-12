const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    bookingDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "confirmed",
        "rejected",
        "cancelled"
      ],
      default: "confirmed"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
