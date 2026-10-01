const joinWaitlist = async (email, source = "landing_page") => {
    let response;
    try {
        response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, source }),
        });
    } catch {
        throw new Error("Couldn’t connect to the waitlist. Check your connection and try again.");
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Waitlist sign-up is temporarily unavailable. Please try again shortly.");
        }
        throw new Error(result.message || "We couldn’t add you to the waitlist.");
    }

    return result;
};

export { joinWaitlist };
