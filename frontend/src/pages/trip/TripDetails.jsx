import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AuthContext from "../../context/AuthContext.jsx";
import AppHeader from "../../components/layout/AppHeader.jsx";
import Footer from "../../components/layout/Footer.jsx";
import {
    getTrip as getTripService,
    sendInvitation as sendInvitationService,
} from "../../services/TripService.js";
import EditTripForm from "./EditTripForm.jsx";
import { useForm } from "react-hook-form";

const TripDetails = () => {
    const { tripId } = useParams();
    const { accessToken } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onTouched", defaultValues: { role: "viewer" } });

    const [trip, setTrip] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState("");
    const [sendError, setSendError] = useState("");

    const handleSendInvitation = async (data) => {
        try {
            setIsSending(true);
            setSendSuccess("");
            setSendError("");
            const response = await sendInvitationService(
                tripId,
                data.email,
                data.role,
                accessToken,
            );

            console.log(response);
            setSendSuccess(`Invitation sent to ${data.email}`);
        } catch (error) {
            console.error(error);
            setSendError(error.message);
        } finally {
            setIsSending(false);
        }
    };

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
                            <div className="h-32 animate-pulse bg-linear-to-r from-[#EAF3FF] via-[#F8FAFF] to-[#EEF7FF]" />

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

                    <section className="mt-6 w-full">
                        <div className="overflow-hidden rounded-[18px] border border-[#E6EEF8] bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-[#172033]">
                                Invite someone to this trip
                            </h3>
                            {sendSuccess && (
                                <p className="mt-3 text-sm text-green-600">
                                    {sendSuccess}
                                </p>
                            )}
                            {sendError && (
                                <div>
                                    <p className="mt-3 text-sm text-red-600">
                                        {sendError}
                                    </p>
                                </div>
                            )}
                            <form
                                className="grid gap-3 md:flex md:items-center md:gap-4"
                                onSubmit={handleSubmit(handleSendInvitation)}
                            >
                                <div className="flex-1">
                                    <label className="mb-1 block text-sm font-medium text-[#172033]/80">
                                        Email
                                    </label>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Enter a valid email",
                                            },
                                        })}
                                        type="email"
                                        placeholder="name@example.com"
                                        aria-invalid={
                                            errors.email ? "true" : "false"
                                        }
                                        className="w-full rounded-lg border border-[#D8E3F2] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDE0FF]"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="w-40">
                                    <label className="mb-1 block text-sm font-medium text-[#172033]/80">
                                        Role
                                    </label>
                                    <select
                                        {...register("role", {
                                            required: "Role is required",
                                        })}
                                        aria-invalid={
                                            errors.role ? "true" : "false"
                                        }
                                        className="w-full rounded-lg border border-[#D8E3F2] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDE0FF]"
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="editor">Editor</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.role.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-transparent">
                                        &nbsp;
                                    </label>
                                    <button
                                        type="submit"
                                        className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1E4BBB]"
                                        disabled={isSending}
                                    >
                                        {isSending
                                            ? "Sending..."
                                            : "Send Invitation"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>

                    <EditTripForm trip={trip} setTrip={setTrip} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TripDetails;
