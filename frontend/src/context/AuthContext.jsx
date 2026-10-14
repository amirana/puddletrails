import { useState, createContext, useEffect, useRef } from "react";
import { login as loginUser } from "../services/authService.js";
import { logout as logoutUser } from "../services/authService.js";
import { refresh as refreshUser } from "../services/authService.js";
import { profile as profileUser } from "../services/authService.js";
import { updateProfile as updateProfileUser } from "../services/authService.js";
import { updateAvatar as updateAvatarUser } from "../services/authService.js";

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

    const updateProfile = async (data) => {
        const result = await updateProfileUser(accessToken, data);
        setUser(result.data);
        return result;
    };

    const updateAvatar = async (file) => {
        const result = await updateAvatarUser(accessToken, file);
        setUser(result.data);
        return result;
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
                updateProfile,
                updateAvatar,
                authLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
export { AuthProvider };
export default AuthContext;
