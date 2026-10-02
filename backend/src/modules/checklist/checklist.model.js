import mongoose from "mongoose";

const checklistItemSchema = new mongoose.Schema({
    text: { type: String, trim: true, required: true, maxlength: 200 },
    completed: { type: Boolean, default: false },
});

const checklistSchema = new mongoose.Schema(
    {
        trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
        type: { type: String, enum: ["packing", "to-do", "custom"], required: true },
        title: { type: String, trim: true, required: true, maxlength: 80 },
        items: { type: [checklistItemSchema], default: [] },
    },
    { timestamps: true },
);

checklistSchema.index({ trip: 1, createdAt: 1 });

export default mongoose.model("Checklist", checklistSchema);
