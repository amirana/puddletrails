import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthContext from "../../context/AuthContext.jsx";
import AppHeader from "../../components/layout/AppHeader.jsx";
import Footer from "../../components/layout/Footer.jsx";
import { getTrip as getTripService } from "../../services/TripService.js";
import EditTripForm from "./EditTripForm.jsx";

const TripDetails = () => {
    const { tripId } = useParams();
    const { accessToken } = useContext(AuthContext);

    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            const response = await getTripService(tripId, accessToken);
            setTrip(response.data);
        };

        fetchTrip();
    }, [tripId, accessToken]);

    if (!trip) {
        return (
            <div className="min-h-screen bg-[#F8F6F2] text-[#172033]">
                <AppHeader />

                <main className="px-6 py-12 sm:px-10 lg:px-12">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#172033]/60">
                            <ArrowLeft className="h-4 w-4" />
                            Back to dashboard
                        </div>

                        <div className="overflow-hidden rounded-[30px] border border-[#DDE7F3] bg-white shadow-[0_24px_80px_rgba(23,32,51,0.08)]">
                            <div className="h-32 animate-pulse bg-gradient-to-r from-[#EAF3FF] via-[#F8FAFF] to-[#EEF7FF]" />

                            <div className="space-y-6 p-6 sm:p-8 lg:p-10">
                                <div className="h-5 w-28 animate-pulse rounded-full bg-[#172033]/5" />

                                <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#172033]/5" />

                                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-[#172033]/5" />

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="h-24 animate-pulse rounded-[22px] bg-[#172033]/5" />

                                    <div className="h-24 animate-pulse rounded-[22px] bg-[#172033]/5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F6F2] text-[#172033]">
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

                    <EditTripForm trip={trip} setTrip={setTrip} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TripDetails;
