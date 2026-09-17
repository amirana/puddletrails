import { Link } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader.jsx";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-[#FFFDF8]">
            <AppHeader />
            <main className="flex flex-col items-center px-6 py-24 text-center sm:py-32">
                <p className="text-sm font-medium text-[#3B82F6]">Your trips</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                    Welcome, {user?.firstName}
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#172033]/60">
                    Your next adventure starts here. Create a trip to begin
                    planning with your group.
                </p>
                <Link
                    to="/create-trip"
                    className="mt-8 rounded-full bg-[#3B82F6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
                >
                    Create trip
                </Link>
            </main>
        </div>
    );
};

export default Dashboard;
