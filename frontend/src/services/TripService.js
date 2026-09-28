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

const updateTrip = async (tripId, tripData, accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(tripData),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "No trip found.");
    }

    return result;
};

const deleteTrip = async (tripId, accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to delete trip.");
    }

    return result;
};

const sendInvitation = async (tripId, email, role, accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/${tripId}/invitations`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ email, role }),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to send a trip invitation.");
    }

    return result;
};

const acceptInvitation = async (token, accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/invitations/${token}/accept`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
};

const declineInvitation = async (token, accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/trips/invitations/${token}/decline`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
};

export {
    getTrip,
    getTrips,
    updateTrip,
    deleteTrip,
    sendInvitation,
    acceptInvitation,
    declineInvitation,
};
