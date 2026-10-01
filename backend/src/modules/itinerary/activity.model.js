import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
            index: true,
        },
        tripDay: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TripDay",
            required: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        editedAt: {
            type: Date,
            default: null,
        },
        title: {
            type: String,
            trim: true,
            required: true,
            maxlength: 120,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        location: {
            type: String,
            trim: true,
            maxlength: 160,
            default: "",
        },
        startTime: {
            type: String,
            validate: (value) => value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
            default: "",
        },
        endTime: {
            type: String,
            validate: (value) => value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
            default: "",
        },
        order: {
            type: Number,
            min: 0,
            required: true,
        },
    },
    { timestamps: true },
);

activitySchema.index({ trip: 1, tripDay: 1, order: 1 });

export default mongoose.model("Activity", activitySchema);
