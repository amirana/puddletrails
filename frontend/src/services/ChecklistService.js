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
    if (!response.ok) throw new Error(result.message || "The checklist request failed.");
    return result;
};

const getChecklists = (tripId, accessToken) => request(`/api/trips/${tripId}/checklists`, accessToken);
const createChecklist = (tripId, data, accessToken) => request(`/api/trips/${tripId}/checklists`, accessToken, {
    method: "POST", body: JSON.stringify(data),
});
const updateChecklist = (tripId, checklistId, data, accessToken) => request(`/api/trips/${tripId}/checklists/${checklistId}`, accessToken, {
    method: "PATCH", body: JSON.stringify(data),
});
const deleteChecklist = (tripId, checklistId, accessToken) => request(`/api/trips/${tripId}/checklists/${checklistId}`, accessToken, { method: "DELETE" });
const createChecklistItem = (tripId, checklistId, text, accessToken) => request(`/api/trips/${tripId}/checklists/${checklistId}/items`, accessToken, {
    method: "POST", body: JSON.stringify({ text }),
});
const updateChecklistItem = (tripId, checklistId, itemId, updates, accessToken) => request(`/api/trips/${tripId}/checklists/${checklistId}/items/${itemId}`, accessToken, {
    method: "PATCH", body: JSON.stringify(updates),
});
const deleteChecklistItem = (tripId, checklistId, itemId, accessToken) => request(`/api/trips/${tripId}/checklists/${checklistId}/items/${itemId}`, accessToken, { method: "DELETE" });

export { getChecklists, createChecklist, updateChecklist, deleteChecklist, createChecklistItem, updateChecklistItem, deleteChecklistItem };
