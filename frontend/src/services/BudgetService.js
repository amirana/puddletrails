const apiRequest = async (path, accessToken, options = {}) => {
    let response;
    try {
        response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
            ...options,
            credentials: "include",
            headers: {
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                Authorization: `Bearer ${accessToken}`,
                ...options.headers,
            },
        });
    } catch {
        throw new Error("Couldn’t connect to the trip budget. Check your connection and try again.");
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "The budget request failed.");
    return result;
};

const getBudget = (tripId, accessToken) =>
    apiRequest(`/api/trips/${tripId}/budget`, accessToken);

const updateBudget = (tripId, budget, accessToken) =>
    apiRequest(`/api/trips/${tripId}/budget`, accessToken, {
        method: "PATCH",
        body: JSON.stringify(budget),
    });

const createExpense = (tripId, expense, accessToken) =>
    apiRequest(`/api/trips/${tripId}/expenses`, accessToken, {
        method: "POST",
        body: JSON.stringify(expense),
    });

const updateExpense = (tripId, expenseId, expense, accessToken) =>
    apiRequest(`/api/trips/${tripId}/expenses/${expenseId}`, accessToken, {
        method: "PATCH",
        body: JSON.stringify(expense),
    });

const deleteExpense = (tripId, expenseId, accessToken) =>
    apiRequest(`/api/trips/${tripId}/expenses/${expenseId}`, accessToken, {
        method: "DELETE",
    });

export { getBudget, updateBudget, createExpense, updateExpense, deleteExpense };
