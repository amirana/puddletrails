import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, PlaneTakeoff } from "lucide-react";
import { getTrip as getTripService } from "../../services/TripService.js";
import AuthContext from "../../context/AuthContext.jsx";
import AppHeader from "../../components/layout/AppHeader.jsx";
import Footer from "../../components/layout/Footer.jsx";

const TripDetails = () => {
    const { tripId } = useParams();
    const { accessToken } = useContext(AuthContext);

    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            const response = await getTripService(tripId, accessToken);
            console.log(response.data);
            setTrip(response.data);
        };

        fetchTrip();
    }, [tripId, accessToken]);

    if (!trip) {
        return (
            <div className="min-h-screen bg-[#FFFDF8]">
                <AppHeader />
                <main className="px-6 py-12 sm:px-10 lg:px-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#172033]/60">
                            <ArrowLeft className="h-4 w-4" />
                            Back to dashboard
                        </div>

                        <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(23,32,51,0.08)]">
                            <div className="h-32 animate-pulse bg-gradient-to-r from-[#EAF3FF] via-[#F8FAFF] to-[#EEF7FF]" />
                            <div className="space-y-6 p-6 sm:p-8 lg:p-10">
                                <div className="h-5 w-28 animate-pulse rounded-full bg-[#172033]/5" />
                                <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#172033]/5" />
                                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[#172033]/5" />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="h-24 animate-pulse rounded-2xl bg-[#172033]/5" />
                                    <div className="h-24 animate-pulse rounded-2xl bg-[#172033]/5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const startDate = trip.startDate
        ? new Date(trip.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Dates to be confirmed";

    const endDate = trip.endDate
        ? new Date(trip.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Dates to be confirmed";

    return (
        <div className="min-h-screen bg-[#FFFDF8]">
            <AppHeader />

            <main className="px-6 py-12 sm:px-10 lg:px-12">
                <div className="mx-auto max-w-5xl">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172033]/60 transition-colors hover:text-[#172033]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Link>

                    <div className="mt-5 overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(23,32,51,0.08)]">
                        <div className="border-b border-black/5 bg-gradient-to-r from-[#EAF3FF] via-white to-[#F2F8FF] p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                                <div className="space-y-4">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/20 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
                                        <PlaneTakeoff className="h-3.5 w-3.5" />
                                        Trip overview
                                    </span>

                                    <div>
                                        <h1 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                                            {trip?.title}
                                        </h1>
                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#172033]/70">
                                            <span className="inline-flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-[#3B82F6]" />
                                                {trip?.destination}
                                            </span>
                                            <span className="inline-flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4 text-[#3B82F6]" />
                                                {startDate} – {endDate}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white/85 p-4 shadow-sm">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                                        Travel window
                                    </p>
                                    <p className="mt-2 text-lg font-semibold text-[#172033]">
                                        {startDate} – {endDate}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.6fr] lg:p-10">
                            <article className="rounded-2xl border border-black/10 bg-[#FFFDF8] p-5 sm:p-6">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                                    About this trip
                                </p>
                                <p className="mt-4 text-base leading-7 text-[#172033]/75">
                                    {trip?.description ||
                                        "No description added yet. Add a few details to capture the mood, plans, or goals for this trip."}
                                </p>
                            </article>

                            <aside className="space-y-4">
                                <div className="rounded-2xl border border-black/10 bg-white p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                                        Destination
                                    </p>
                                    <p className="mt-3 text-lg font-semibold text-[#172033]">
                                        {trip?.destination}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white p-5">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                                        Dates
                                    </p>
                                    <p className="mt-3 text-base font-medium text-[#172033]">
                                        {startDate}
                                    </p>
                                    <p className="mt-1 text-sm text-[#172033]/60">
                                        to
                                    </p>
                                    <p className="mt-1 text-base font-medium text-[#172033]">
                                        {endDate}
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TripDetails;
