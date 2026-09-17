import { Compass, LogOut } from "lucide-react";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";

const AppHeader = () => {
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
        <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 sm:px-10">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[#172033]">
                <Compass className="h-5 w-5 text-[#3B82F6]" strokeWidth={2} />
                Traverse
            </Link>
            <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded text-sm font-medium text-[#172033]/70 transition-colors hover:text-[#172033] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
            >
                <LogOut className="h-4 w-4" />
                Log out
            </button>
        </header>
    );
};

export default AppHeader;
