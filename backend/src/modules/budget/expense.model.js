import mongoose from "mongoose";
import { EXPENSE_CATEGORIES, TRANSPORT_TYPES } from "./budget.constants.js";

const expenseSchema = new mongoose.Schema(
    {
        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true,
            index: true,
        },
        amountMinorUnits: {
            type: Number,
            required: true,
            min: 1,
            validate: Number.isSafeInteger,
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 200,
        },
        category: {
            type: String,
            enum: EXPENSE_CATEGORIES,
            required: true,
        },
        transportType: {
            type: String,
            enum: ["", ...TRANSPORT_TYPES],
            default: "",
        },
        date: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true },
);

expenseSchema.index({ trip: 1, date: -1, createdAt: -1 });

export default mongoose.model("Expense", expenseSchema);
