import mongoose from "mongoose";

const tripInvitationSchema = new mongoose.Schema({
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trip",
        require: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 322,
        required: [true, "Email is required"],
    },
    role: {
        type: String,
        enum: ["editor", "viewer"],
        require: true,
    },
    token: {
        type: String,
        select: false,
        require: true,
        unique: false,
    },
    expiresAt: {
        type: Date,
        require: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
    },
});

tripInvitationSchema.index({ trip: 1, email: 1 }, { unique: true });

export default mongoose.model("tripInvitation", tripInvitationSchema);
