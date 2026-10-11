import mongoose from "mongoose";

const RESERVATION_TYPES = ["Flight", "Hotel", "Restaurant", "Transport", "Other"];
const reservationAttachmentSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, required: true },
    originalName: { type: String, required: true, maxlength: 255 },
    format: { type: String, default: "" },
    bytes: { type: Number, required: true },
});

const reservationSchema = new mongoose.Schema(
    {
        trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
        tripDayId: { type: mongoose.Schema.Types.ObjectId, ref: "TripDay", default: null },
        title: { type: String, trim: true, required: true, maxlength: 120 },
        type: { type: String, enum: RESERVATION_TYPES, required: true },
        date: { type: Date, required: true },
        time: {
            type: String,
            default: "",
            validate: (value) => value === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(value),
        },
        confirmationNumber: { type: String, trim: true, maxlength: 100, default: "" },
        confirmed: { type: Boolean, default: false },
        notes: { type: String, trim: true, maxlength: 2000, default: "" },
        attachments: { type: [reservationAttachmentSchema], default: [] },
    },
    { timestamps: true },
);

reservationSchema.index({ trip: 1, date: 1, time: 1 });

export { RESERVATION_TYPES };
export default mongoose.model("Reservation", reservationSchema);
