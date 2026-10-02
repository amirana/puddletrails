import mongoose from "mongoose";
import { CURRENCIES } from "../budget/budget.constants.js";

const tripSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, "Title is required"],
        },
        destination: {
            type: String,
            trim: true,
            required: [true, "Destination is required"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        description: {
            type: String,
        },
        totalBudgetMinorUnits: {
            type: Number,
            min: 0,
            default: 0,
            validate: Number.isSafeInteger,
        },
        currency: {
            type: String,
            enum: CURRENCIES,
            default: null,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

export default mongoose.model("Trip", tripSchema);
