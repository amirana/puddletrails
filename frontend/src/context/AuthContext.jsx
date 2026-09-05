import { useState, createContext } from "react";
import { login as loginUser } from "../services/authService.js";
import { logout as logoutUser } from "../services/authService.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

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

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthProvider };
export default AuthContext;
