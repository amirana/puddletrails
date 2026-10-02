import ApiError from "../../common/utils/api-error.js";
import Trip from "../trip/trip.model.js";
import TripDay from "./trip-day.model.js";
import Activity from "./activity.model.js";
import DayComment from "./day-comment.model.js";
import { deleteCommentsForDays } from "./day-comment.service.js";

const utcDate = (value) => {
    const date = new Date(value);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

const numberOfTripDays = (startDate, endDate) =>
    Math.floor((utcDate(endDate) - utcDate(startDate)) / 86_400_000) + 1;

const assertDateChangeKeepsActivities = async (trip, startDate, endDate, confirmCommentDeletion = false) => {
    const nextStartDate = utcDate(startDate);
    const nextEndDate = utcDate(endDate);
    if (nextEndDate < nextStartDate) {
        throw ApiError.badRequest("Trip end date must be on or after its start date");
    }

    const nextDayCount = numberOfTripDays(nextStartDate, nextEndDate);
    const currentDayCount = numberOfTripDays(trip.startDate, trip.endDate);
    if (nextDayCount >= currentDayCount) return;

    const daysToRemove = await TripDay.find({
        trip: trip._id,
        dayNumber: { $gt: nextDayCount },
    }).select("_id");
    const activityCount = await Activity.countDocuments({
        trip: trip._id,
        tripDay: { $in: daysToRemove.map((day) => day._id) },
    });
    if (activityCount) {
        throw ApiError.badRequest(
            "Move or remove activities from the days being removed before shortening this trip",
        );
    }
    const removedDayIds = daysToRemove.map((day) => day._id);
    const commentsExist = await DayComment.exists({ trip: trip._id, tripDay: { $in: removedDayIds } });
    if (commentsExist && !confirmCommentDeletion) {
        throw ApiError.badRequest("Shortening this trip will delete comments on the removed days. Confirm to continue.");
    }
};

const syncTripDays = async (trip) => {
    const startDate = utcDate(trip.startDate);
    const endDate = utcDate(trip.endDate);
    const days = [];

    for (let current = new Date(startDate), dayNumber = 1; current <= endDate; dayNumber += 1) {
        days.push({ dayNumber, date: new Date(current) });
        current.setUTCDate(current.getUTCDate() + 1);
    }

    if (days.length) {
        await TripDay.bulkWrite(
            days.map(({ dayNumber, date }) => ({
                updateOne: {
                    filter: { trip: trip._id, dayNumber },
                    update: { $set: { date } },
                    upsert: true,
                },
            })),
        );
    }

    const removedDays = await TripDay.find({ trip: trip._id, dayNumber: { $gt: days.length } }).select("_id");
    if (removedDays.length) {
        const removedDayIds = removedDays.map((day) => day._id);
        await Activity.deleteMany({ trip: trip._id, tripDay: { $in: removedDayIds } });
        await deleteCommentsForDays(trip._id, removedDayIds);
        await TripDay.deleteMany({ _id: { $in: removedDayIds } });
    }
    return days;
};

const getTripDays = async (tripId) => {
    const trip = await Trip.findById(tripId);
    if (!trip) throw ApiError.notFound("Trip not found");

    // Syncing on reads also fills in days for trips created before this feature.
    await syncTripDays(trip);
    const days = await TripDay.find({ trip: tripId }).sort({ dayNumber: 1 }).lean();
    const activities = await Activity.find({ trip: tripId })
        .populate("createdBy", "firstName lastName")
        .populate("updatedBy", "firstName lastName")
        .sort({ tripDay: 1, order: 1, createdAt: 1 })
        .lean();
    const activitiesByDay = new Map();
    for (const activity of activities) {
        const dayId = activity.tripDay.toString();
        const dayActivities = activitiesByDay.get(dayId) || [];
        dayActivities.push(activity);
        activitiesByDay.set(dayId, dayActivities);
    }

    const comments = await DayComment.find({ trip: tripId })
        .populate("createdBy", "firstName lastName")
        .sort({ createdAt: 1 })
        .lean();
    const commentsByDay = new Map();
    for (const comment of comments) {
        const dayId = comment.tripDay.toString();
        const dayComments = commentsByDay.get(dayId) || [];
        dayComments.push(comment);
        commentsByDay.set(dayId, dayComments);
    }

    return days.map((day) => ({
        ...day,
        activities: activitiesByDay.get(day._id.toString()) || [],
        comments: commentsByDay.get(day._id.toString()) || [],
    }));
};

const deleteTripDays = async (tripId) => {
    await Activity.deleteMany({ trip: tripId });
    await DayComment.deleteMany({ trip: tripId });
    await TripDay.deleteMany({ trip: tripId });
};

export {
    syncTripDays,
    getTripDays,
    deleteTripDays,
    assertDateChangeKeepsActivities,
};
