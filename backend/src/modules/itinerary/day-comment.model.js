import mongoose from "mongoose";

const dayCommentSchema = new mongoose.Schema(
    {
        trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
        tripDay: { type: mongoose.Schema.Types.ObjectId, ref: "TripDay", required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "DayComment", default: null },
        text: { type: String, trim: true, required: true, maxlength: 1000 },
        editedAt: { type: Date, default: null },
    },
    { timestamps: true },
);

dayCommentSchema.index({ trip: 1, tripDay: 1, createdAt: 1 });

export default mongoose.model("DayComment", dayCommentSchema);
