import { LogOut } from "lucide-react";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext.jsx";
import logo from "../../assets/logo.png";

const AppHeader = ({ compact = false }) => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email?.split("@")[0] || "Traveler";
    const initials = displayName
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <header className={`flex items-center justify-between border-b border-[#29201D]/10 bg-[#FFFCF7] px-5 sm:px-8 ${compact ? "py-2 sm:py-2.5" : "py-4"}`}>
            <Link to={user ? "/dashboard" : "/"} aria-label="PuddleTrails home" className="flex shrink-0 items-center">
                <img src={logo} alt="PuddleTrails" className={`w-auto mix-blend-multiply ${compact ? "h-10 sm:h-12" : "h-12 sm:h-16"}`} />
            </Link>
            <div className="flex items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-2.5" aria-label={`Signed in as ${displayName}`}>
                    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFE4D8] text-xs font-bold text-[#9B4A3E] ring-1 ring-[#F2D2C4]">{initials}</span>
                    <span className="hidden max-w-36 truncate text-sm font-semibold text-[#29201D] sm:block">{displayName}</span>
                </div>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-9 items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-[#65554D] transition-colors hover:bg-[#FFF0DF] hover:text-[#29201D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9573F] sm:px-3 sm:text-sm"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Log out</span>
                </button>
            </div>
        </header>
    );
};

export default AppHeader;
