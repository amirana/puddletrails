import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            maxlength: 322,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            trim: true,
            maxlength: 100,
            default: "landing_page",
        },
    },
    { timestamps: true },
);

export default mongoose.model("WaitlistEntry", waitlistSchema);
