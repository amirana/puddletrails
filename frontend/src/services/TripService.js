const getTrip = async (tripId, accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "No trip found.");
    }

    return result;
};

const getTrips = async (accessToken) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips`, {
        method: "GET",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "No trip found.");
    }

    return result;
};

export { getTrip, getTrips };
