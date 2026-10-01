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
    },
    { timestamps: true },
);

export default mongoose.model("WaitlistEntry", waitlistSchema);
