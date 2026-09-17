import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
    const { user, authLoading } = useContext(AuthContext);

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-[#172033]/60">
                Loading…
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
