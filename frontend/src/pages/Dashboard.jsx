import { ArrowRight, CalendarDays, Compass, MapPin, Plus, Plane } from "lucide-react";
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
    const { accessToken } = useContext(AuthContext);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

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

    const isPastTrip = (trip) => trip.endDate && new Date(trip.endDate) < new Date(new Date().setHours(0, 0, 0, 0));
    const visibleTrips = trips.filter((trip) => activeFilter === "all" || (activeFilter === "past" ? isPastTrip(trip) : !isPastTrip(trip)));
    const nextTrip = trips.filter((trip) => !isPastTrip(trip)).sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))[0];
    const filters = [
        { id: "all", label: "All trips", count: trips.length },
        { id: "upcoming", label: "Upcoming", count: trips.filter((trip) => !isPastTrip(trip)).length },
        { id: "past", label: "Past trips", count: trips.filter(isPastTrip).length },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] text-[#29201D]">
            <AppHeader />
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-8 sm:py-8">
                <div>
                    <div className="flex flex-col gap-5 border-b border-[#EEE7DF] py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE4D8] text-[#C94F46]"><Compass className="h-5 w-5" /></span>
                            <div><h1 className="mb-0 mt-0 text-xl font-extrabold leading-tight">Your trips</h1><p className="mt-1 text-xs leading-5 text-[#786A62]">A little space for big plans.</p></div>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <div role="tablist" aria-label="Filter trips" className="flex gap-1 overflow-x-auto rounded-xl bg-[#F8F6F2] p-1">
                                {filters.map(({ id, label, count }) => <button key={id} id={`dashboard-tab-${id}`} type="button" role="tab" aria-selected={activeFilter === id} aria-controls="dashboard-trip-list" tabIndex={activeFilter === id ? 0 : -1} onClick={() => setActiveFilter(id)} onKeyDown={(event) => {
                                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                                        event.preventDefault();
                                        const direction = event.key === "ArrowRight" ? 1 : -1;
                                        const currentIndex = filters.findIndex((filter) => filter.id === id);
                                        const next = filters[(currentIndex + direction + filters.length) % filters.length];
                                        setActiveFilter(next.id);
                                        document.getElementById(`dashboard-tab-${next.id}`)?.focus();
                                    }
                                }} className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition sm:text-sm ${activeFilter === id ? "bg-white text-[#29201D] shadow-sm" : "text-[#786A62] hover:text-[#29201D]"}`}>{label}<span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeFilter === id ? "bg-[#FFF0DF] text-[#9B4A3E]" : "bg-white/70 text-[#786A62]"}`}>{count}</span></button>)}
                            </div>
                            <Link to="/create-trip" className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full bg-[#E9573F] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#CF4639] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] sm:text-sm"><Plus className="h-4 w-4" /> New trip</Link>
                        </div>
                    </div>

                    <div className="mt-5 grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                        <aside className="self-start rounded-2xl bg-[#FFF4E3] p-5 sm:p-6">
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black">{trips.length}</p>
                                <p className="text-sm font-semibold text-[#786A62]">{trips.length === 1 ? "trip planned" : "trips planned"}</p>
                            </div>
                            {nextTrip ? (
                                <div className="mt-4 border-t border-[#EBDCC9] pt-4">
                                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.08em] text-[#9B4A3E]">Up next</p>
                                    <p className="mt-2 font-bold leading-snug">{nextTrip.title || nextTrip.destination || "Your next trip"}</p>
                                    <p className="mt-1 text-xs text-[#786A62]">{formatDate(nextTrip.startDate)}</p>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-[#786A62]">Your next trip starts here.</p>
                            )}
                        </aside>

                        <section id="dashboard-trip-list" role="tabpanel" aria-labelledby={`dashboard-tab-${activeFilter}`} tabIndex={0} className="min-w-0 p-1 outline-none sm:p-3" aria-label={`${filters.find((filter) => filter.id === activeFilter)?.label} list`}>
                            <div className="mb-7 flex items-center justify-between gap-4">
                                <div><p className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B4A3E]">Your crew’s adventures</p><h2 className="mb-0 mt-2 text-2xl font-extrabold">{filters.find((filter) => filter.id === activeFilter)?.label}</h2></div>
                                <span className="hidden items-center gap-2 rounded-full bg-[#FFF4E3] px-3 py-1.5 text-xs font-semibold text-[#65554D] sm:inline-flex"><Plane className="h-4 w-4 text-[#C94F46]" /> {visibleTrips.length} to explore</span>
                            </div>
                            {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
                            {loading ? (
                                <div className="space-y-3" aria-label="Loading trips">{[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl border border-[#EAE2D9] bg-white" />)}</div>
                            ) : visibleTrips.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-[#E8B899] bg-[#FFFCF7] px-6 py-14 text-center">
                                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE4D8] text-[#C94F46]"><Compass className="h-6 w-6" /></span>
                                    <h3 className="mb-0 mt-4 text-xl font-extrabold">{activeFilter === "past" ? "No past trips yet" : trips.length ? "Nothing on the calendar yet" : "Your next trip starts here"}</h3>
                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#786A62]">{activeFilter === "past" ? "Your finished adventures will show up here." : "Pick a place, invite your people, and start making plans."}</p>
                                    {activeFilter !== "past" && <Link to="/create-trip" className="mt-5 inline-flex min-h-9 items-center gap-2 rounded-full bg-[#E9573F] px-4 py-2 text-sm font-bold text-white hover:bg-[#CF4639]"><Plus className="h-4 w-4" /> Create a trip</Link>}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {visibleTrips.map((trip) => (
                                        <article key={trip._id} className="group flex flex-col gap-5 rounded-2xl border border-[#F0E5D9] bg-[#FFF9F1] p-5 transition hover:border-[#E8B899] hover:bg-white sm:flex-row sm:items-center sm:p-6">
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0DF] text-[#C94F46]"><MapPin className="h-5 w-5" /></span>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2"><h3 className="mb-0 text-lg font-extrabold">{trip.title || "Untitled trip"}</h3><span className="rounded-full bg-[#FFF4E3] px-2.5 py-1 text-[10px] font-bold capitalize text-[#9B4A3E]">{trip.role || "member"}</span></div>
                                                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#786A62]"><span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{trip.destination || "Destination TBD"}</span><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span></p>
                                                {trip.description && <p className="mt-2 line-clamp-1 text-xs text-[#786A62]">{trip.description}</p>}
                                            </div>
                                            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#EEE7DF] pt-3 sm:border-0 sm:pt-0">
                                                <Link to={`/trips/${trip._id}`} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#FFF0DF] px-4 py-2 text-xs font-bold text-[#9B4A3E] transition hover:bg-[#FFE4D8]">Open trip <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                                                {trip.role === "owner" && <button type="button" onClick={() => handleDelete(trip._id)} disabled={deletingId === trip._id} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">{deletingId === trip._id ? "Deleting…" : "Delete"}</button>}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
