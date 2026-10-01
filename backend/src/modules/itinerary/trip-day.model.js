import mongoose from "mongoose";

const tripDaySchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
        },
        dayNumber: {
            type: Number,
            required: true,
            min: 1,
        },
        date: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

tripDaySchema.index({ trip: 1, dayNumber: 1 }, { unique: true });

export default mongoose.model("TripDay", tripDaySchema);
