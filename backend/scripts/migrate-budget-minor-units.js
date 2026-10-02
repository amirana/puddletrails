import "dotenv/config";
import mongoose from "mongoose";
import { CURRENCY_MINOR_UNIT_SCALE } from "../src/modules/budget/budget.constants.js";

const toMinorUnits = (amount, currency) => {
    const scale = CURRENCY_MINOR_UNIT_SCALE[currency] ?? 2;
    const scaled = Number(amount || 0) * (10 ** scale);
    const result = Math.round(scaled);
    if (Math.abs(scaled - result) > 1e-7) {
        throw new Error(`Existing amount ${amount} has too many decimal places for ${currency}`);
    }
    if (!Number.isSafeInteger(result)) throw new Error(`Unsafe budget amount for currency ${currency}`);
    return result;
};

const migrate = async () => {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
    await mongoose.connect(process.env.MONGODB_URI);

    const trips = mongoose.connection.collection("trips");
    const expenses = mongoose.connection.collection("expenses");
    const currencyByTrip = new Map();

    for await (const trip of trips.find({}, { projection: { currency: 1, totalBudget: 1, totalBudgetMinorUnits: 1 } })) {
        currencyByTrip.set(String(trip._id), trip.currency);
        const update = { $unset: { totalBudget: "" } };
        if (trip.totalBudgetMinorUnits === undefined) {
            update.$set = { totalBudgetMinorUnits: toMinorUnits(trip.totalBudget, trip.currency) };
        }
        await trips.updateOne({ _id: trip._id }, update);
    }

    for await (const expense of expenses.find({}, { projection: { trip: 1, amount: 1, amountMinorUnits: 1 } })) {
        const update = { $unset: { amount: "" } };
        if (expense.amountMinorUnits === undefined) {
            const currency = currencyByTrip.get(String(expense.trip));
            if (!currency) throw new Error(`Trip currency missing for expense ${expense._id}`);
            update.$set = { amountMinorUnits: toMinorUnits(expense.amount, currency) };
        }
        await expenses.updateOne({ _id: expense._id }, update);
    }

    console.log("Budget data migrated to integer minor units.");
};

migrate()
    .catch((error) => {
        console.error("Budget migration failed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
