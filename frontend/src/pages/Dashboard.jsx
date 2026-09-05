import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <button type="button" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Dashboard;
