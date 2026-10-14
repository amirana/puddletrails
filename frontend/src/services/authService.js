const register = async (data) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        },
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
    }

    return result;
};

const resendVerificationEmail = async (email) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-verification`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        },
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to send a verification link.");
    }

    return result;
};

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

const logout = async (accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    );
    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};

const refresh = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
        {
            method: "POST",
            credentials: "include",
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};

const profile = async (accessToken) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
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
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};

const updateProfile = async (accessToken, data) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Unable to update your profile.");
    return result;
};

const updateAvatar = async (accessToken, file) => {
    const body = new FormData();
    body.append("avatar", file);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile/avatar`, {
        method: "PATCH",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` },
        body,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Unable to upload your profile photo.");
    return result;
};

const forgotPassword = async (data) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Forgot password failed");
    }

    return result;
};

const resetPassword = async (token, data) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
    }

    return result;
};

export {
    register,
    resendVerificationEmail,
    login,
    logout,
    refresh,
    profile,
    updateProfile,
    updateAvatar,
    forgotPassword,
    resetPassword,
};
