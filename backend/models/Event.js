const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        venue: {
            type: String,
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        image: {
            type: String,
            default: ""
        },

        organizer: {
            type: String,
            required: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        availableSeats: {
            type: Number,
            required: true,
            min: 0
        },

        price: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "upcoming",
                "ongoing",
                "completed",
                "cancelled"
            ],
            default: "upcoming"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Event", eventSchema);