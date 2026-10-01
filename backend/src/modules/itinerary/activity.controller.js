import * as activityService from "./activity.service.js";
import ApiResponse from "../../common/utils/api-response.js";

const getActivitiesForDay = async (req, res) => {
    const activities = await activityService.getActivitiesForDay(
        req.params.tripId,
        req.params.dayId,
    );
    ApiResponse.ok(res, "Activities fetched successfully", activities);
};

const createActivity = async (req, res) => {
    const activity = await activityService.createActivity(
        req.params.tripId,
        req.params.dayId,
        req.body,
        req.user.id,
    );
    ApiResponse.created(res, "Activity created successfully", activity);
};

const updateActivity = async (req, res) => {
    const activity = await activityService.updateActivity(
        req.params.tripId,
        req.params.activityId,
        req.body,
        req.user.id,
    );
    ApiResponse.ok(res, "Activity updated successfully", activity);
};

const deleteActivity = async (req, res) => {
    await activityService.deleteActivity(req.params.tripId, req.params.activityId);
    ApiResponse.ok(res, "Activity deleted successfully");
};

const reorderActivities = async (req, res) => {
    const activities = await activityService.reorderActivities(
        req.params.tripId,
        req.body.activities,
    );
    ApiResponse.ok(res, "Activities reordered successfully", activities);
};

export {
    getActivitiesForDay,
    createActivity,
    updateActivity,
    deleteActivity,
    reorderActivities,
};
