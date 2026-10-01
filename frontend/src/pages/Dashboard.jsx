import { ArrowRight, CalendarDays, Compass, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppHeader from "../components/layout/AppHeader.jsx";
import Footer from "../components/layout/Footer.jsx";
import AuthContext from "../context/AuthContext.jsx";
import {
    deleteTrip as deleteTripService,
    getTrips as getTripsService,
} from "../services/TripService.js";

const formatDate = (date) =>
    date
        ? new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Date TBD";

const Dashboard = () => {
    const { user, accessToken } = useContext(AuthContext);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchTrips = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getTripsService(accessToken);
                if (!cancelled) setTrips(response.data || []);
            } catch (loadError) {
                if (!cancelled) setError(loadError.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        if (accessToken) fetchTrips();
        return () => {
            cancelled = true;
        };
    }, [accessToken]);

    const handleDelete = async (tripId) => {
        if (!window.confirm("Delete this trip? This cannot be undone.")) return;
        setDeletingId(tripId);
        setError("");
        try {
            await deleteTripService(tripId, accessToken);
            setTrips((current) => current.filter((trip) => trip._id !== tripId));
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setDeletingId("");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F8F6F2] text-[#172033]">
            <AppHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
                <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                            Your travel space
                        </p>
                        <h1 className="mb-0 mt-3 !text-4xl font-semibold tracking-tight text-[#172033] sm:!text-5xl">
                            Welcome, {user?.firstName || "traveler"}
                        </h1>
                        <p className="mt-3 text-sm text-slate-600 sm:text-base">
                            All your shared plans, gathered in one place.
                        </p>
                    </div>
                    <Link
                        to="/create-trip"
                        className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                        <Plus className="h-4 w-4" /> New trip
                    </Link>
                </div>

                {error && (
                    <p className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading trips">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
                        ))}
                    </div>
                ) : trips.length === 0 ? (
                    <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <Compass className="h-7 w-7" />
                        </span>
                        <h2 className="mb-0 mt-5 !text-2xl font-semibold text-slate-900">Your next trip starts here</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                            Create a trip to start collecting the details and planning with your group.
                        </p>
                        <Link to="/create-trip" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                            <Plus className="h-4 w-4" /> Create your first trip
                        </Link>
                    </section>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {trips.map((trip) => (
                            <article key={trip._id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.09)]">
                                <div className="h-2 bg-gradient-to-r from-emerald-600 via-teal-400 to-sky-400" />
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-800">
                                            {trip.role || "member"}
                                        </span>
                                        <Compass className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <h2 className="mb-0 mt-5 !text-2xl font-semibold tracking-tight text-slate-900">
                                        {trip.title || "Untitled trip"}
                                    </h2>
                                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-emerald-700" />
                                            {trip.destination || "Destination TBD"}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-emerald-700" />
                                            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                                        </p>
                                    </div>
                                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">
                                        {trip.description || "Your plans and trip details will live here."}
                                    </p>
                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <Link to={`/trips/${trip._id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950">
                                            Open trip <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        {trip.role === "owner" && (
                                            <button type="button" onClick={() => handleDelete(trip._id)} disabled={deletingId === trip._id} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
                                                {deletingId === trip._id ? "Deleting…" : "Delete"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
