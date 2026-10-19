import {
    ArrowRight,
    CalendarDays,
    Compass,
    MapPin,
    Plus,
    Plane,
} from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, Suspense, useCallback, useContext, useEffect, useState } from "react";
import AppHeader from "../components/layout/AppHeader.jsx";
import Footer from "../components/layout/Footer.jsx";
import AuthContext from "../context/AuthContext.jsx";
import posthog, { isPostHogConfigured } from "../services/posthog.js";
import {
    deleteTrip as deleteTripService,
    getTrips as getTripsService,
} from "../services/TripService.js";

const CreateTrip = lazy(() => import("./trip/CreateTrip.jsx"));

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
    const [createTripOpen, setCreateTripOpen] = useState(false);
    const closeCreateTrip = useCallback(() => setCreateTripOpen(false), []);

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
            if (isPostHogConfigured) {
                posthog.capture("trip_deleted");
            }
            setTrips((current) =>
                current.filter((trip) => trip._id !== tripId),
            );
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setDeletingId("");
        }
    };

    const isPastTrip = (trip) =>
        trip.endDate &&
        new Date(trip.endDate) < new Date(new Date().setHours(0, 0, 0, 0));
    const visibleTrips = trips.filter(
        (trip) =>
            activeFilter === "all" ||
            (activeFilter === "past" ? isPastTrip(trip) : !isPastTrip(trip)),
    );
    const nextTrip = trips
        .filter((trip) => !isPastTrip(trip))
        .sort(
            (a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0),
        )[0];
    const filters = [
        { id: "all", label: "All trips", count: trips.length },
        {
            id: "upcoming",
            label: "Upcoming",
            count: trips.filter((trip) => !isPastTrip(trip)).length,
        },
        {
            id: "past",
            label: "Past trips",
            count: trips.filter(isPastTrip).length,
        },
    ];
    const tripAccentTones = [
        "bg-[#FFE4D8] text-[#C94F46]",
        "bg-[#FFF0C4] text-[#9B4A3E]",
        "bg-[#E7EFD9] text-[#5F7F59]",
    ];

    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] text-[#29201D]">
            <AppHeader />
            <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-8 sm:py-6">
                <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 inline-flex items-center gap-2 font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">
                            <Compass
                                className="h-4 w-4 text-[#E9573F]"
                                aria-hidden="true"
                            />{" "}
                            Your travel desk
                        </p>
                        <h1 className="mb-0 mt-0 text-3xl font-black sm:text-4xl">
                            Your trips, all in one place.
                        </h1>
                        <p className="mt-2 text-sm text-[#786A62] sm:text-base">
                            A little space for big plans with your crew.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCreateTripOpen(true)}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#E9573F] px-5 py-2.5 text-sm font-bold text-white shadow-[0_5px_0_#C94F46] transition hover:-translate-y-0.5 hover:bg-[#D94F3B] hover:shadow-[0_6px_0_#C94F46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29201D] sm:self-auto"
                    >
                        <Plus className="h-4 w-4" /> New trip
                    </button>
                </div>

                <div className="grid items-start gap-5 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-6">
                    <aside className="grid gap-4 sm:grid-cols-2 lg:sticky lg:top-6 lg:grid-cols-1">
                        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#FFF0DF] p-4 sm:p-5">
                            <span
                                className="absolute -right-4 -top-4 flex h-16 w-16 rotate-12 items-center justify-center rounded-[1.25rem] bg-[#FFD34E] text-[#29201D]"
                                aria-hidden="true"
                            >
                                <Plane className="h-7 w-7" />
                            </span>
                            <p className="font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">
                                On the horizon
                            </p>
                            <p className="mb-0 mt-3 text-4xl font-black leading-none text-[#D95140]">
                                {trips.length}
                            </p>
                            <p className="mt-2 text-sm font-semibold text-[#65554D]">
                                {trips.length === 1
                                    ? "trip planned"
                                    : "trips planned"}
                            </p>
                            <p className="mt-4 border-t border-[#E9D9CA] pt-3 text-[11px] text-[#786A62]">
                                Every good trip starts with an idea.
                            </p>
                        </section>

                        <section className="rounded-[1.75rem] border border-[#EEE7DF] bg-white p-3.5 sm:p-4">
                            <p className="mb-3 px-2 font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#786A62]">
                                Trip views
                            </p>
                            <div
                                role="tablist"
                                aria-label="Filter trips"
                                aria-orientation="vertical"
                                className="grid gap-1"
                            >
                                {filters.map(({ id, label, count }) => {
                                    const FilterIcon =
                                        id === "past"
                                            ? CalendarDays
                                            : id === "upcoming"
                                              ? Plane
                                              : Compass;
                                    return (
                                        <button
                                            key={id}
                                            id={`dashboard-tab-${id}`}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeFilter === id}
                                            aria-controls="dashboard-trip-list"
                                            tabIndex={
                                                activeFilter === id ? 0 : -1
                                            }
                                            onClick={() => setActiveFilter(id)}
                                            onKeyDown={(event) => {
                                                if (
                                                    [
                                                        "ArrowDown",
                                                        "ArrowUp",
                                                        "ArrowLeft",
                                                        "ArrowRight",
                                                    ].includes(event.key)
                                                ) {
                                                    event.preventDefault();
                                                    const direction =
                                                        event.key ===
                                                            "ArrowDown" ||
                                                        event.key ===
                                                            "ArrowRight"
                                                            ? 1
                                                            : -1;
                                                    const currentIndex =
                                                        filters.findIndex(
                                                            (filter) =>
                                                                filter.id ===
                                                                id,
                                                        );
                                                    const next =
                                                        filters[
                                                            (currentIndex +
                                                                direction +
                                                                filters.length) %
                                                                filters.length
                                                        ];
                                                    setActiveFilter(next.id);
                                                    document
                                                        .getElementById(
                                                            `dashboard-tab-${next.id}`,
                                                        )
                                                        ?.focus();
                                                }
                                            }}
                                            className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition ${activeFilter === id ? "bg-[#FFF0DF] text-[#9B4A3E]" : "text-[#786A62] hover:bg-[#FFFCF7] hover:text-[#29201D]"}`}
                                        >
                                            <FilterIcon
                                                className={`h-4 w-4 ${activeFilter === id ? "text-[#E9573F]" : "text-[#8C7D74]"}`}
                                                aria-hidden="true"
                                            />
                                            <span className="flex-1">
                                                {label}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] ${activeFilter === id ? "bg-white text-[#9B4A3E]" : "bg-[#F4EEE6] text-[#786A62]"}`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    </aside>

                    <section
                        id="dashboard-trip-list"
                        role="tabpanel"
                        aria-labelledby={`dashboard-tab-${activeFilter}`}
                        tabIndex={0}
                        className="min-w-0 outline-none"
                        aria-label={`${filters.find((filter) => filter.id === activeFilter)?.label} list`}
                    >
                        {nextTrip && (
                            <Link
                                to={`/trips/${nextTrip._id}`}
                                className="group relative mb-5 block overflow-hidden rounded-[1.75rem] bg-[#FFF4E3] p-4 transition-transform hover:-translate-y-0.5 sm:p-5"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-6 -top-8 hidden h-36 w-36 rotate-12 items-center justify-center rounded-[2rem] bg-[#FFD34E] text-[#29201D] sm:flex"
                                >
                                    <Plane className="h-16 w-16 -rotate-12" />
                                </span>
                                <div className="relative max-w-2xl">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B4A3E]">
                                        <Compass className="h-3.5 w-3.5" /> Your
                                        next adventure
                                    </span>
                                    <h2 className="mb-0 mt-3 text-xl font-black sm:text-2xl">
                                        {nextTrip.title ||
                                            "A trip with your crew"}
                                    </h2>
                                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-[#65554D]">
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="h-4 w-4 text-[#E9573F]" />
                                            {nextTrip.destination ||
                                                "Destination TBD"}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays className="h-4 w-4 text-[#7D9869]" />
                                            {formatDate(nextTrip.startDate)} –{" "}
                                            {formatDate(nextTrip.endDate)}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    aria-hidden="true"
                                    className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#9B4A3E] transition-transform group-hover:translate-x-1 sm:bottom-5 sm:right-5"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </span>
                            </Link>
                        )}

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="mb-1 font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#C94F46]">
                                    Your crew’s adventures
                                </p>
                                <h2 className="mb-0 text-xl font-extrabold">
                                    {
                                        filters.find(
                                            (filter) =>
                                                filter.id === activeFilter,
                                        )?.label
                                    }
                                </h2>
                            </div>
                            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E7EFD9] px-3 py-1.5 text-xs font-semibold text-[#4F6B49]">
                                <Plane className="h-4 w-4" />{" "}
                                {visibleTrips.length}{" "}
                                {visibleTrips.length === 1 ? "trip" : "trips"}
                            </span>
                        </div>

                        {error && (
                            <p
                                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}
                        {loading ? (
                            <div
                                className="grid gap-4 sm:grid-cols-2"
                                aria-label="Loading trips"
                            >
                                {[1, 2, 3].map((item) => (
                                    <div
                                        key={item}
                                        className="h-56 animate-pulse rounded-[1.5rem] bg-[#F5EFE8]"
                                    />
                                ))}
                            </div>
                        ) : visibleTrips.length === 0 ? (
                            <div className="rounded-[1.75rem] bg-[#FFF0DF] px-6 py-12 text-center sm:py-16">
                                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-[#FFD34E] text-[#29201D]">
                                    <Compass className="h-7 w-7" />
                                </span>
                                <h3 className="mb-0 mt-4 text-xl font-extrabold">
                                    {activeFilter === "past"
                                        ? "No past trips yet"
                                        : trips.length
                                          ? "Nothing on the calendar yet"
                                          : "Your next trip starts here"}
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#786A62]">
                                    {activeFilter === "past"
                                        ? "Your finished adventures will show up here."
                                        : "Pick a place, invite your people, and start making plans."}
                                </p>
                                {activeFilter !== "past" && (
                                    <button
                                        type="button"
                                        onClick={() => setCreateTripOpen(true)}
                                        className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#E9573F] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#CF4639]"
                                    >
                                        <Plus className="h-4 w-4" /> Create a
                                        trip
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:auto-rows-fr sm:grid-cols-2">
                                {visibleTrips.map((trip, index) => (
                                    <article
                                        key={trip._id}
                                        className="group relative flex h-full min-h-[225px] flex-col overflow-hidden rounded-[1.5rem] border border-[#EEE7DF] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(60,40,30,0.10)]"
                                    >
                                        <div
                                            className={`h-2 w-full ${["bg-[#E9573F]", "bg-[#7D9869]", "bg-[#FFD34E]"][index % 3]}`}
                                        />
                                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <span
                                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tripAccentTones[index % tripAccentTones.length]}`}
                                                >
                                                    <MapPin className="h-5 w-5" />
                                                </span>
                                                <span className="rounded-full bg-[#E7EFD9] px-2.5 py-1 text-[10px] font-bold capitalize text-[#5F7F59]">
                                                    {trip.role || "member"}
                                                </span>
                                            </div>
                                            <h3 className="mb-0 mt-4 text-base font-extrabold leading-snug">
                                                {trip.title || "Untitled trip"}
                                            </h3>
                                            <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#786A62]">
                                                <MapPin className="h-3.5 w-3.5 text-[#E9573F]" />
                                                {trip.destination ||
                                                    "Destination TBD"}
                                            </p>
                                            <p className="mt-3 pb-3 inline-flex items-center gap-2 text-xs font-medium text-[#65554D]">
                                                <CalendarDays className="h-3.5 w-3.5 text-[#7D9869]" />
                                                {formatDate(trip.startDate)} –{" "}
                                                {formatDate(trip.endDate)}
                                            </p>
                                            <p className="mt-3 min-h-10 line-clamp-2 text-xs leading-5 text-[#786A62]">
                                                {trip.description || " "}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#F0EAE3] pt-4">
                                                <Link
                                                    to={`/trips/${trip._id}`}
                                                    className="inline-flex min-h-9 items-center gap-2 rounded-full bg-[#FFF0C4] px-4 py-2 text-xs font-bold text-[#51443E] transition hover:bg-[#FFD34E]"
                                                >
                                                    Open trip{" "}
                                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                                </Link>
                                                {trip.role === "owner" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                trip._id,
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            trip._id
                                                        }
                                                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        {deletingId === trip._id
                                                            ? "Deleting…"
                                                            : "Delete"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            {createTripOpen && (
                <Suspense fallback={<div className="fixed inset-0 z-50 grid place-items-center bg-[#29201D]/30" role="status"><span className="rounded-xl bg-[#FFFCF7] px-4 py-3 text-sm text-[#65554D]">Preparing your trip form…</span></div>}>
                    <CreateTrip modal onClose={closeCreateTrip} />
                </Suspense>
            )}
            <Footer />
        </div>
    );
};

export default Dashboard;
