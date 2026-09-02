import { useState, createContext } from "react";
import { login as loginUser } from "../services/authService.js";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const login = async (data) => {
        const result = await loginUser(data);

        setUser(result.user);
        setAccessToken(result.accessToken);

        return result;
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, login }}>
            {children}
        </AuthContext.Provider>
    );
}
export { AuthProvider };
export default AuthContext;
