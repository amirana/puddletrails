import { Router } from "express";
import * as tripController from "./trip.controller.js";
import CreateTripDto from "./dto/create-trip.dto.js";
import { authenticate } from "../auth/auth.middleware.js";
import validate from "../../common/middleware/validate.middleware.js";
import UpdateTripDto from "./dto/update-trip.dto.js";
import TripDaysParamsDto from "./dto/trip-days-params.dto.js";
import * as itineraryController from "../itinerary/itinerary.controller.js";
import * as activityController from "../itinerary/activity.controller.js";
import * as dayCommentController from "../itinerary/day-comment.controller.js";
import DayActivitiesParamsDto from "../itinerary/dto/day-activities-params.dto.js";
import DayCommentParamsDto from "../itinerary/dto/day-comment-params.dto.js";
import DayCommentDto from "../itinerary/dto/day-comment.dto.js";
import UpdateDayCommentDto from "../itinerary/dto/update-day-comment.dto.js";
import ActivityParamsDto from "../itinerary/dto/activity-params.dto.js";
import CreateActivityDto from "../itinerary/dto/create-activity.dto.js";
import UpdateActivityDto from "../itinerary/dto/update-activity.dto.js";
import ReorderActivitiesDto from "../itinerary/dto/reorder-activities.dto.js";
import * as budgetController from "../budget/budget.controller.js";
import TripBudgetParamsDto from "../budget/dto/trip-budget-params.dto.js";
import ExpenseParamsDto from "../budget/dto/expense-params.dto.js";
import UpdateBudgetDto from "../budget/dto/update-budget.dto.js";
import CreateExpenseDto from "../budget/dto/create-expense.dto.js";
import UpdateExpenseDto from "../budget/dto/update-expense.dto.js";
import * as checklistController from "../checklist/checklist.controller.js";
import ChecklistParamsDto from "../checklist/dto/checklist-params.dto.js";
import ChecklistItemParamsDto from "../checklist/dto/checklist-item-params.dto.js";
import CreateChecklistDto from "../checklist/dto/create-checklist.dto.js";
import UpdateChecklistDto from "../checklist/dto/update-checklist.dto.js";
import ChecklistItemDto from "../checklist/dto/checklist-item.dto.js";
import CreateChecklistItemDto from "../checklist/dto/create-checklist-item.dto.js";
import {
    loadMembership,
    requireRole,
} from "../../common/middleware/trip-permission.middleware.js";

const tripRoute = Router();

tripRoute.get(
    "/:tripId/checklists",
    authenticate,
    validate(TripBudgetParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    checklistController.getChecklists,
);

tripRoute.post(
    "/:tripId/checklists",
    authenticate,
    validate(TripBudgetParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(CreateChecklistDto),
    checklistController.createChecklist,
);

tripRoute.patch(
    "/:tripId/checklists/:checklistId",
    authenticate,
    validate(ChecklistParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(UpdateChecklistDto),
    checklistController.updateChecklist,
);

tripRoute.delete(
    "/:tripId/checklists/:checklistId",
    authenticate,
    validate(ChecklistParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    checklistController.deleteChecklist,
);

tripRoute.post(
    "/:tripId/checklists/:checklistId/items",
    authenticate,
    validate(ChecklistParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(CreateChecklistItemDto),
    checklistController.createItem,
);

tripRoute.patch(
    "/:tripId/checklists/:checklistId/items/:itemId",
    authenticate,
    validate(ChecklistItemParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    validate(ChecklistItemDto),
    checklistController.updateItem,
);

tripRoute.delete(
    "/:tripId/checklists/:checklistId/items/:itemId",
    authenticate,
    validate(ChecklistItemParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    checklistController.deleteItem,
);

tripRoute.get(
    "/:tripId/budget",
    authenticate,
    validate(TripBudgetParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    budgetController.getBudget,
);

tripRoute.patch(
    "/:tripId/budget",
    authenticate,
    validate(TripBudgetParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(UpdateBudgetDto),
    budgetController.updateBudget,
);

tripRoute.post(
    "/:tripId/expenses",
    authenticate,
    validate(TripBudgetParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(CreateExpenseDto),
    budgetController.createExpense,
);

tripRoute.post(
    "/:tripId/days/:dayId/comments",
    authenticate,
    validate(DayActivitiesParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    validate(DayCommentDto),
    dayCommentController.createComment,
);

tripRoute.patch(
    "/:tripId/comments/:commentId",
    authenticate,
    validate(DayCommentParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    validate(UpdateDayCommentDto),
    dayCommentController.updateComment,
);

tripRoute.delete(
    "/:tripId/comments/:commentId",
    authenticate,
    validate(DayCommentParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    dayCommentController.deleteComment,
);

tripRoute.patch(
    "/:tripId/expenses/:expenseId",
    authenticate,
    validate(ExpenseParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(UpdateExpenseDto),
    budgetController.updateExpense,
);

tripRoute.delete(
    "/:tripId/expenses/:expenseId",
    authenticate,
    validate(ExpenseParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    budgetController.deleteExpense,
);

tripRoute.get(
    "/:tripId/days/:dayId/activities",
    authenticate,
    validate(DayActivitiesParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    activityController.getActivitiesForDay,
);

tripRoute.post(
    "/:tripId/days/:dayId/activities",
    authenticate,
    validate(DayActivitiesParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(CreateActivityDto),
    activityController.createActivity,
);

tripRoute.patch(
    "/:tripId/activities/reorder",
    authenticate,
    validate(TripDaysParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(ReorderActivitiesDto),
    activityController.reorderActivities,
);

tripRoute.patch(
    "/:tripId/activities/:activityId",
    authenticate,
    validate(ActivityParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    validate(UpdateActivityDto),
    activityController.updateActivity,
);

tripRoute.delete(
    "/:tripId/activities/:activityId",
    authenticate,
    validate(ActivityParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor"),
    activityController.deleteActivity,
);

tripRoute.get(
    "/:tripId/days",
    authenticate,
    validate(TripDaysParamsDto, "params"),
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    itineraryController.getTripDays,
);

tripRoute.post(
    "/",
    authenticate,
    validate(CreateTripDto),
    tripController.createTrip,
);

tripRoute.get("/", authenticate, tripController.getTrips);
tripRoute.get(
    "/:tripId",
    authenticate,
    loadMembership,
    requireRole("owner", "editor", "viewer"),
    tripController.getTrip,
);

tripRoute.patch(
    "/:tripId",
    authenticate,
    loadMembership,
    requireRole("owner", "editor"),
    validate(UpdateTripDto),
    tripController.updateTrip,
);

tripRoute.delete(
    "/:tripId/members/me",
    authenticate,
    loadMembership,
    requireRole("editor", "viewer"),
    tripController.leaveTrip,
);

tripRoute.patch(
    "/:tripId/members/:memberId",
    authenticate,
    loadMembership,
    requireRole("owner"),
    tripController.updateTripMember,
);

tripRoute.delete(
    "/:tripId/members/:memberId",
    authenticate,
    loadMembership,
    requireRole("owner"),
    tripController.removeTripMember,
);

tripRoute.delete(
    "/:tripId",
    authenticate,
    loadMembership,
    requireRole("owner"),
    tripController.deleteTrip,
);

tripRoute.post(
    "/:tripId/invitations",
    authenticate,
    loadMembership,
    requireRole("owner"),
    tripController.tripInvitation,
);

tripRoute.post(
    "/invitations/:token/accept",
    authenticate,
    tripController.acceptInvitation,
);

tripRoute.post(
    "/invitations/:token/decline",
    authenticate,
    tripController.declineInvitation,
);

tripRoute.get(
    "/invitations/:token",
    authenticate,
    tripController.getInvitation,
);

export default tripRoute;
