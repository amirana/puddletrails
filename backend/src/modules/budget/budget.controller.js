import * as budgetService from "./budget.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const getBudget = async (req, res) => {
    const budget = await budgetService.getBudget(req.params.tripId);
    ApiResponse.ok(res, "Trip budget fetched successfully", budget);
};

const updateBudget = async (req, res) => {
    const budget = await budgetService.updateBudget(req.params.tripId, req.body);
    ApiResponse.ok(res, "Trip budget updated successfully", budget);
};

const createExpense = async (req, res) => {
    const expense = await budgetService.createExpense(req.params.tripId, req.body);
    ApiResponse.created(res, "Expense created successfully", expense);
};

const updateExpense = async (req, res) => {
    const expense = await budgetService.updateExpense(
        req.params.tripId,
        req.params.expenseId,
        req.body,
    );
    ApiResponse.ok(res, "Expense updated successfully", expense);
};

const deleteExpense = async (req, res) => {
    await budgetService.deleteExpense(req.params.tripId, req.params.expenseId);
    ApiResponse.ok(res, "Expense deleted successfully");
};

export { getBudget, updateBudget, createExpense, updateExpense, deleteExpense };
