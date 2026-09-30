import { ArrowRight, CalendarDays, Compass, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader.jsx";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext.jsx";
import {
    getTrips as getTripsService,
    deleteTrip as deleteTripService,
} from "../services/TripService.js";
import Footer from "../components/layout/Footer.jsx";

const Dashboard = () => {
    const { user, accessToken } = useContext(AuthContext);

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        try {
            const fetchTrips = async () => {
                const response = await getTripsService(accessToken);
                console.log(response);
                setTrips(response.data);
            };

            fetchTrips();
        } catch (error) {
            throw new Error("No trips found", error.message);
        }
    }, [accessToken]);

    const handleDelete = async (tripId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?",
        );

        if (!confirmed) return;

        await deleteTripService(tripId, accessToken);

        setTrips((prevTrip) => prevTrip.filter((trip) => trip._id !== tripId));
    };

    if (trips.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F6F2] text-[#172033]">
                <AppHeader />
                <main className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
                    <div className="mx-auto max-w-xl rounded-[2rem] border border-[#DCE8F7] bg-white/80 px-6 py-12 shadow-[0_24px_80px_rgba(148,163,184,0.08)] backdrop-blur-sm sm:px-10">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3B82F6]">
                            Your trips
                        </p>
                        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#172033] sm:text-5xl">
                            Welcome, {user?.firstName || "traveler"}
                        </h1>
                        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#172033]/65 sm:text-base">
                            Your next adventure starts here. Create a trip to
                            begin planning with your group.
                        </p>
                        <Link
                            to="/create-trip"
                            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
                        >
                            <Plus className="h-4 w-4" />
                            Create trip
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F6F2] text-[#172033]">
            <AppHeader />
            <main className="mx-auto max-w-[1180px] px-6 py-10 sm:px-8 lg:px-12">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">
                            Dashboard
                        </p>

                        <p className="mt-4 text-lg font-semibold tracking-[-0.04em] text-[#172033] sm:text-2xl">
                            Welcome, {user?.firstName || "traveler"}
                        </p>
                        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#172033] sm:text-6xl">
                            Your trips
                        </h1>
                    </div>

                    <Link
                        to="/create-trip"
                        className="hidden items-center gap-2 rounded-full border border-[#CFDDF7] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9DBDFF] hover:shadow-[0_12px_28px_rgba(59,130,246,0.10)] sm:inline-flex"
                    >
                        <Plus className="h-4 w-4 text-[#3B82F6]" />
                        New trip
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {trips.map((trip) => (
                        <div>
                            <Link
                                to={`/trips/${trip._id}`}
                                key={trip._id}
                                className="group relative overflow-hidden rounded-[1.6rem] border border-[#DEE7F2] bg-[#F4F5F6] p-4 shadow-[0_14px_32px_rgba(23,32,51,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#BDD5FF] hover:shadow-[0_20px_40px_rgba(59,130,246,0.12)]"
                            >
                                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#EAF2FF] via-[#F5F9FF] to-[#F8EEE2] opacity-80" />
                                <div className="relative">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3159BB]">
                                            Trip
                                        </span>
                                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172033] text-white shadow-sm">
                                            <Compass className="h-4 w-4" />
                                        </span>
                                        <span>{trip.role}</span>
                                    </div>

                                    <div className="rounded-[1.2rem] bg-[#F0F2F4] px-3 py-3">
                                        <h2 className="text-2xl font-semibold tracking-[-0.05em] text-[#172033]">
                                            {trip?.title || "Untitled trip"}
                                        </h2>
                                    </div>

                                    <div className="mt-4 space-y-2.5 text-sm text-[#172033]/70">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                                            <span>
                                                {trip?.destination ||
                                                    "Destination TBD"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-[#3B82F6]" />
                                            <span>
                                                {new Date(
                                                    trip.startDate,
                                                ).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}{" "}
                                                -{" "}
                                                {new Date(
                                                    trip.endDate,
                                                ).toLocaleDateString("en-GB", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm leading-relaxed text-[#172033]/65">
                                        {trip?.description ||
                                            "A thoughtful journey waiting to be planned."}
                                    </p>

                                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E3E8EE] pt-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-[#172033]/70">
                                            <span>View itinerary</span>
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] transition-transform duration-200 group-hover:translate-x-1">
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {trip.role === "owner" && (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(trip._id)}
                                    disabled={trip.owner !== user._id}
                                    className="rounded-full border border-[#F5C2C2] bg-[#FFF1F1] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#B42318] transition-colors hover:bg-[#FEE2E2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCA5A5] disabled:cursor-not-allowed disabled:border-[#E5E7EB] disabled:bg-[#F3F4F6] disabled:text-[#94A3B8] disabled:hover:bg-[#F3F4F6] disabled:opacity-70"
                                    aria-label={`Delete ${trip?.title || "trip"}`}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
