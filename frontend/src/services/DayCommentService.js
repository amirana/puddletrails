const request = async (path, accessToken, options = {}) => {
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
    if (!response.ok) throw new Error(result.message || "The comment request failed.");
    return result;
};

const createDayComment = (tripId, dayId, comment, accessToken) =>
    request(`/api/trips/${tripId}/days/${dayId}/comments`, accessToken, {
        method: "POST",
        body: JSON.stringify(comment),
    });

const updateDayComment = (tripId, commentId, text, accessToken) =>
    request(`/api/trips/${tripId}/comments/${commentId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify({ text }),
    });

const deleteDayComment = (tripId, commentId, accessToken) =>
    request(`/api/trips/${tripId}/comments/${commentId}`, accessToken, { method: "DELETE" });

export { createDayComment, updateDayComment, deleteDayComment };
