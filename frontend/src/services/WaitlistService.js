const joinWaitlist = async (email) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Waitlist sign-up is temporarily unavailable. Please try again shortly.");
        }
        throw new Error(result.message || "We couldn’t add you to the waitlist.");
    }

    return result;
};

export { joinWaitlist };
