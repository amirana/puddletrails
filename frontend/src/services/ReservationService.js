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

export { getReservations, createReservation, updateReservation, deleteReservation };
