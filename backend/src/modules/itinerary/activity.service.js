import ApiError from "../../common/utils/api-error.js";
import Activity from "./activity.model.js";
import TripDay from "./trip-day.model.js";

const getActivitiesForDay = async (tripId, dayId) => {
    const day = await TripDay.findOne({ _id: dayId, trip: tripId });
    if (!day) throw ApiError.notFound("Trip day not found");

    return Activity.find({ trip: tripId, tripDay: dayId })
        .populate("createdBy", "firstName lastName")
        .populate("updatedBy", "firstName lastName")
        .sort({ order: 1, createdAt: 1 });
};

const validateTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) {
        throw ApiError.badRequest("Start time and end time are required");
    }
    if (startTime && endTime && startTime >= endTime) {
        throw ApiError.badRequest("End time must be later than start time");
    }
};

const createActivity = async (tripId, dayId, activityData, userId) => {
    validateTimeRange(activityData.startTime, activityData.endTime);
    const day = await TripDay.findOne({ _id: dayId, trip: tripId });
    if (!day) throw ApiError.notFound("Trip day not found");

    const lastActivity = await Activity.findOne({ trip: tripId, tripDay: dayId })
        .sort({ order: -1 })
        .select("order");

    return Activity.create({
        trip: tripId,
        tripDay: dayId,
        createdBy: userId,
        ...activityData,
        order: (lastActivity?.order ?? -1) + 1,
    }).then((activity) => activity.populate("createdBy", "firstName lastName"));
};

const updateActivity = async (tripId, activityId, activityData, userId) => {
    const current = await Activity.findOne({ _id: activityId, trip: tripId });
    if (!current) throw ApiError.notFound("Activity not found");
    validateTimeRange(
        activityData.startTime ?? current.startTime,
        activityData.endTime ?? current.endTime,
    );

    const activity = await Activity.findOneAndUpdate(
        { _id: activityId, trip: tripId },
        {
            $set: {
                ...activityData,
                updatedBy: userId,
                editedAt: new Date(),
            },
        },
        { returnDocument: "after", runValidators: true },
    );
    if (!activity) throw ApiError.notFound("Activity not found");
    return activity.populate([
        { path: "createdBy", select: "firstName lastName" },
        { path: "updatedBy", select: "firstName lastName" },
    ]);
};

const deleteActivity = async (tripId, activityId) => {
    const activity = await Activity.findOneAndDelete({ _id: activityId, trip: tripId });
    if (!activity) throw ApiError.notFound("Activity not found");

    const remaining = await Activity.find({ trip: tripId, tripDay: activity.tripDay })
        .sort({ order: 1, createdAt: 1 })
        .select("_id");
    if (remaining.length) {
        await Activity.bulkWrite(
            remaining.map((item, order) => ({
                updateOne: {
                    filter: { _id: item._id },
                    update: { $set: { order } },
                },
            })),
        );
    }
    return activity;
};

const reorderActivities = async (tripId, activityPositions) => {
    const tripDays = await TripDay.find({ trip: tripId }).select("_id");
    const validDayIds = new Set(tripDays.map((day) => day._id.toString()));
    if (activityPositions.some(({ tripDayId }) => !validDayIds.has(tripDayId))) {
        throw ApiError.badRequest("One or more destination days do not belong to this trip");
    }

    const allActivities = await Activity.find({ trip: tripId }).select("_id");
    const existingIds = new Set(allActivities.map((activity) => activity._id.toString()));
    const receivedIds = new Set(activityPositions.map(({ activityId }) => activityId));
    if (
        receivedIds.size !== activityPositions.length ||
        receivedIds.size !== existingIds.size ||
        [...existingIds].some((id) => !receivedIds.has(id))
    ) {
        throw ApiError.badRequest("The activity list changed. Refresh the itinerary and try again");
    }

    const positionsPerDay = new Map();
    for (const { tripDayId, order } of activityPositions) {
        const positions = positionsPerDay.get(tripDayId) || new Set();
        if (positions.has(order)) {
            throw ApiError.badRequest("Each activity needs a unique position within its day");
        }
        positions.add(order);
        positionsPerDay.set(tripDayId, positions);
    }
    for (const positions of positionsPerDay.values()) {
        if ([...positions].sort((a, b) => a - b).some((position, index) => position !== index)) {
            throw ApiError.badRequest("Activity order must be consecutive within each day");
        }
    }

    await Activity.bulkWrite(
        activityPositions.map(({ activityId, tripDayId, order }) => ({
            updateOne: {
                filter: { _id: activityId, trip: tripId },
                update: { $set: { tripDay: tripDayId, order } },
            },
        })),
    );

    return Activity.find({ trip: tripId })
        .populate("createdBy", "firstName lastName")
        .populate("updatedBy", "firstName lastName")
        .sort({ tripDay: 1, order: 1 });
};

export {
    getActivitiesForDay,
    createActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
};
