const login = async (data) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        },
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to log in.");
    }

    return result;
};

export { login };
