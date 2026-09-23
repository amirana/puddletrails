import mongoose from "mongoose";

const tripMemberSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.ObjectId,
            ref: "Trip",
            require: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: true,
        },
        role: {
            type: String,
            enum: ["owner", "editor", "viewer"],
            default: "owner",
        },
    },
    { timestamps: true },
);

tripMemberSchema.index(
    {
        trip: 1,
        user: 1,
    },
    { unique: true },
);

export default mongoose.model("TripMember", tripMemberSchema);
