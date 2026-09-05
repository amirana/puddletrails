import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, authLoading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error.message);
        }
    };

    if (authLoading) {
        return "Loading"
    }

    return (
        <section>
            <h1>Welcome, {user?.firstName}</h1>
            <button type="button" onClick={handleLogout}>
                Logout
            </button>
        </section>
    );
};

export default Dashboard;
