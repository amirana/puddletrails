import ApiError from "../../common/utils/api-error.js";
import Trip from "../trip/trip.model.js";
import Expense from "./expense.model.js";
import { CURRENCY_MINOR_UNIT_SCALE } from "./budget.constants.js";

const getScale = (currency) => CURRENCY_MINOR_UNIT_SCALE[currency] ?? 2;

const toMinorUnits = (amount, currency) => {
    const scale = getScale(currency);
    const multiplier = 10 ** scale;
    const minorUnits = Math.round((amount + Number.EPSILON) * multiplier);
    if (!Number.isSafeInteger(minorUnits) || Math.abs(amount * multiplier - minorUnits) > 1e-7) {
        throw ApiError.badRequest(`Amount cannot have more than ${scale} decimal places for ${currency}`);
    }
    return minorUnits;
};

const fromMinorUnits = (amountMinorUnits, currency) => amountMinorUnits / (10 ** getScale(currency));

const toExpenseResponse = (expense, currency) => {
    const item = expense.toObject ? expense.toObject() : expense;
    const { amountMinorUnits, ...rest } = item;
    return { ...rest, amount: fromMinorUnits(amountMinorUnits, currency) };
};

const getBudget = async (tripId) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw ApiError.notFound("Trip not found");

    const [summary] = await Expense.aggregate([
        { $match: { trip: trip._id } },
        { $group: { _id: null, totalSpent: { $sum: "$amountMinorUnits" } } },
    ]);
    const totalSpentMinorUnits = summary?.totalSpent || 0;
    const expenses = await Expense.find({ trip: trip._id }).sort({ date: -1, createdAt: -1 });
    const currency = trip.currency;
    const totalBudgetMinorUnits = trip.totalBudgetMinorUnits || 0;

    return {
        totalBudget: fromMinorUnits(totalBudgetMinorUnits, currency),
        currency,
        totalSpent: fromMinorUnits(totalSpentMinorUnits, currency),
        remaining: fromMinorUnits(totalBudgetMinorUnits - totalSpentMinorUnits, currency),
        expenses: expenses.map((expense) => toExpenseResponse(expense, currency)),
    };
};

const updateBudget = async (tripId, { totalBudget, currency }) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw ApiError.notFound("Trip not found");

    if (trip.currency && trip.currency !== currency) {
        throw ApiError.badRequest(
            "This trip’s currency is locked. Currency conversion isn’t available yet. To use another currency, create a new trip.",
        );
    }

    trip.totalBudgetMinorUnits = toMinorUnits(totalBudget, currency);
    trip.currency = currency;
    await trip.save();
    return getBudget(tripId);
};

const createExpense = async (tripId, expenseData) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw ApiError.notFound("Trip not found");
    if (!trip.currency) {
        throw ApiError.badRequest("Choose a budget currency before adding expenses");
    }

    if (expenseData.category === "transport" && !expenseData.transportType) {
        throw ApiError.badRequest("Choose a transport type");
    }

    const { amount, ...expenseFields } = expenseData;
    const expense = await Expense.create({
        ...expenseFields,
        amountMinorUnits: toMinorUnits(amount, trip.currency),
        trip: trip._id,
    });
    return toExpenseResponse(expense, trip.currency);
};

const updateExpense = async (tripId, expenseId, expenseData) => {
    const [existingExpense, trip] = await Promise.all([
        Expense.findOne({ _id: expenseId, trip: tripId }),
        Trip.findById(tripId).select("currency"),
    ]);
    if (!existingExpense) throw ApiError.notFound("Expense not found");
    if (!trip) throw ApiError.notFound("Trip not found");

    const category = expenseData.category ?? existingExpense.category;
    const transportType = category === "transport"
        ? expenseData.transportType ?? existingExpense.transportType
        : "";
    if (category === "transport" && !transportType) {
        throw ApiError.badRequest("Choose a transport type");
    }

    const updates = { ...expenseData, category, transportType };
    if (updates.amount !== undefined) {
        updates.amountMinorUnits = toMinorUnits(updates.amount, trip.currency);
        delete updates.amount;
    }

    const expense = await Expense.findOneAndUpdate(
        { _id: expenseId, trip: tripId },
        { $set: updates },
        { returnDocument: "after", runValidators: true },
    );
    if (!expense) throw ApiError.notFound("Expense not found");
    return toExpenseResponse(expense, trip.currency);
};

const deleteExpense = async (tripId, expenseId) => {
    const expense = await Expense.findOneAndDelete({ _id: expenseId, trip: tripId });
    if (!expense) throw ApiError.notFound("Expense not found");
    return expense;
};

const deleteExpensesForTrip = (tripId) => Expense.deleteMany({ trip: tripId });

export {
    getBudget,
    updateBudget,
    createExpense,
    updateExpense,
    deleteExpense,
    deleteExpensesForTrip,
};
