const request = async (path, accessToken, options = {}) => {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.body && !isFormData ? { "Content-Type": "application/json" } : {}),
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
        },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "The reservation request failed.");
    return result;
};

const getReservations = (tripId, accessToken) => request(`/api/trips/${tripId}/reservations`, accessToken);
const createReservation = (tripId, data, accessToken) => request(`/api/trips/${tripId}/reservations`, accessToken, {
    method: "POST", body: JSON.stringify(data),
});
const updateReservation = (tripId, reservationId, data, accessToken) => request(`/api/trips/${tripId}/reservations/${reservationId}`, accessToken, {
    method: "PATCH", body: JSON.stringify(data),
});
const deleteReservation = (tripId, reservationId, accessToken) => request(`/api/trips/${tripId}/reservations/${reservationId}`, accessToken, { method: "DELETE" });
const uploadReservationAttachment = (tripId, reservationId, file, accessToken) => {
    const body = new FormData();
    body.append("attachment", file);
    return request(`/api/trips/${tripId}/reservations/${reservationId}/attachments`, accessToken, { method: "POST", body });
};
const deleteReservationAttachment = (tripId, reservationId, attachmentId, accessToken) =>
    request(`/api/trips/${tripId}/reservations/${reservationId}/attachments/${attachmentId}`, accessToken, { method: "DELETE" });

export {
    getReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    uploadReservationAttachment,
    deleteReservationAttachment,
};
