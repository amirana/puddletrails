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
        <main className="min-h-screen bg-[#f8f8f8] px-6 py-8 sm:py-10">
            <div className="mx-auto w-full max-w-5xl">
                <header className="flex items-center justify-between gap-4">
                    <p className="text-xl font-semibold tracking-tight text-[#08060d]">
                        Traverse
                    </p>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm font-medium text-[#4d8063] transition-colors hover:text-[#174c36] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Logout
                    </button>
                </header>

                <section className="mt-16 rounded-2xl border border-black/10 bg-white px-6 py-12 text-center shadow-sm sm:mt-20 sm:px-12 sm:py-16">
                    <p className="text-xs font-medium tracking-[0.16em] text-[#6b6375]">
                        YOUR TRIPS
                    </p>
                    <h1 className="mb-0 mt-3 text-3xl font-semibold leading-tight tracking-tight !text-[#08060d] sm:text-4xl">
                        Welcome, {user?.firstName}
                    </h1>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#6b6375]">
                        Your next adventure starts here. Create a trip to begin
                        planning with your group.
                    </p>
                    <button
                        type="button"
                        className="mt-8 rounded-full bg-[#b8dfc7] px-6 py-3 text-sm font-medium text-[#174c36] transition-colors hover:bg-[#9fd1b1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c36]"
                    >
                        Create trip
                    </button>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
