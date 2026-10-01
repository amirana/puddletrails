const apiRequest = async (path, accessToken, options = {}) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
        },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "The activity request failed.");
    return result;
};

const createActivity = (tripId, dayId, activity, accessToken) =>
    apiRequest(`/api/trips/${tripId}/days/${dayId}/activities`, accessToken, {
        method: "POST",
        body: JSON.stringify(activity),
    });

const updateActivity = (tripId, activityId, activity, accessToken) =>
    apiRequest(`/api/trips/${tripId}/activities/${activityId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify(activity),
    });

const deleteActivity = (tripId, activityId, accessToken) =>
    apiRequest(`/api/trips/${tripId}/activities/${activityId}`, accessToken, {
        method: "DELETE",
    });

const reorderActivities = (tripId, activities, accessToken) =>
    apiRequest(`/api/trips/${tripId}/activities/reorder`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({ activities }),
    });

export { createActivity, updateActivity, deleteActivity, reorderActivities };
