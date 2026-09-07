import { useState, createContext, useEffect, useRef } from "react";
import { login as loginUser } from "../services/AuthService.js";
import { logout as logoutUser } from "../services/AuthService.js";
import { refresh as refreshUser } from "../services/AuthService.js";
import { profile as profileUser } from "../services/AuthService.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const authCheckStarted = useRef(false);

    const login = async (data) => {
        const result = await loginUser(data);

        setUser(result.data.user);
        setAccessToken(result.data.accessToken);

        return result;
    };

    const logout = async () => {
        const result = await logoutUser(accessToken);

        setUser(null);
        setAccessToken(null);

        return result;
    };

    const refresh = async () => {
        const result = await refreshUser();

        setAccessToken(result.data.accessToken);

        return result;
    };

    const profile = async () => {
        const result = await refreshUser();
        const newAccessToken = result.data.accessToken;
        setAccessToken(newAccessToken);
        const getProfile = await profileUser(newAccessToken);
        setUser(getProfile.data);

        return getProfile;
    };

    useEffect(() => {
        const userProfile = async () => {
            if (authCheckStarted.current) return;

            authCheckStarted.current = true;
            try {
                await profile();
            } catch (error) {
                console.error(error.message);
            } finally {
                setAuthLoading(false);
            }
        };

        userProfile();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                refresh,
                profile,
                authLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export { AuthProvider };
export default AuthContext;
