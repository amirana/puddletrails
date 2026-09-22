import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader.jsx";
import { ArrowLeft } from "lucide-react";
import AuthContext from "../../context/AuthContext.jsx";
import { useContext, useState } from "react";
import DestinationCombobox from "../../components/ui/DestinationCombobox.jsx";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        watch,
    } = useForm({ mode: "onTouched" });

    // const [tripCreated, setTripCreated] = useState(false);
    const [serverError, setServerError] = useState("");

    const { accessToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setServerError("");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/trips/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    credentials: "include",
                    body: JSON.stringify(data),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong");
            }

            navigate(`/trips/${result.data._id}`);

            // setTripCreated(true);
        } catch (error) {
            console.error("Trip creation error:", error);
            setServerError(error.message);
        }
    };

    const today = new Date().toISOString().slice(0, 10);
    const startDate = watch("startDate");

    // if (tripCreated === true) {
    //     return (
    //         <div className="min-h-screen bg-[#FFFDF8]">
    //             <AppHeader />
    //             <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
    //                 <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
    //                     <CheckCircle2 className="mx-auto h-10 w-10 text-[#3B82F6]" />
    //                     <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#172033]">
    //                         You&rsquo;re all set
    //                     </h1>
    //                     <p className="mt-3 text-sm leading-relaxed text-[#172033]/60">
    //                         Your trip has been created. Time to start planning.
    //                     </p>
    //                     <Link
    //                         to="/dashboard"
    //                         className="mt-8 inline-flex rounded-full bg-[#3B82F6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6]"
    //                     >
    //                         Back to dashboard
    //                     </Link>
    //                 </div>
    //             </main>
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-[#F8F6F2] text-[#172033]">
            <AppHeader />
            <main className="px-6 py-12 sm:py-16">
                <div className="mx-auto w-full max-w-4xl">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#172033]/60 transition-colors hover:text-[#172033]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to dashboard
                    </Link>

                    <div className="mt-6 overflow-hidden rounded-[30px] border border-[#DDE7F3] bg-white shadow-[0_24px_80px_rgba(23,32,51,0.08)]">
                        <div className="border-b border-[#EDF2F7] bg-gradient-to-r from-[#EAF3FF] via-white to-[#F7F4EE] p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">
                                        New trip
                                    </p>
                                    <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#172033] sm:text-4xl">
                                        Plan a new trip
                                    </h1>
                                </div>

                                <div className="inline-flex items-center rounded-full border border-[#D7E5FF] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#172033]/70">
                                    Ready when you are
                                </div>
                            </div>

                            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#172033]/65">
                                Give your trip a name and a destination — you
                                can invite people and build the itinerary after.
                            </p>
                        </div>

                        <form
                            className="p-6 sm:p-8 lg:p-10"
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                        >
                            <div className="grid gap-5">
                                <label className="flex flex-col gap-1.5 text-sm font-medium text-[#172033]">
                                    Trip title
                                    <input
                                        type="text"
                                        placeholder="e.g. Goa with the crew"
                                        className={`rounded-xl border bg-[#F9FBFF] px-4 py-3 text-sm text-[#172033] outline-none transition-colors placeholder:text-[#172033]/35 focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 ${
                                            errors.title
                                                ? "border-red-300"
                                                : "border-[#DEE7F3]"
                                        }`}
                                        {...register("title", {
                                            required: "Trip title is required.",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "Title must be at least 2 characters.",
                                            },
                                            maxLength: 60,
                                        })}
                                    />
                                    {errors.title && (
                                        <span className="text-xs text-red-500">
                                            {errors.title.message}
                                        </span>
                                    )}
                                </label>

                                <label className="flex flex-col gap-1.5 text-sm font-medium text-[#172033]">
                                    Destination
                                    <Controller
                                        name="destination"
                                        control={control}
                                        rules={{
                                            required:
                                                "Destination is required.",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "Destination must be at least 2 characters.",
                                            },
                                            maxLength: {
                                                value: 60,
                                                message:
                                                    "Destination must be at most 60 characters.",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <DestinationCombobox
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={errors.destination}
                                            />
                                        )}
                                    />
                                    {errors.destination && (
                                        <span className="text-xs text-red-500">
                                            {errors.destination.message}
                                        </span>
                                    )}
                                </label>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#172033]">
                                        Start date
                                        <input
                                            type="date"
                                            min={today}
                                            className={`rounded-xl border bg-[#F9FBFF] px-4 py-3 text-sm text-[#172033] outline-none transition-colors focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 ${
                                                errors.startDate
                                                    ? "border-red-300"
                                                    : "border-[#DEE7F3]"
                                            }`}
                                            {...register("startDate", {
                                                required:
                                                    "Start date is required.",
                                            })}
                                        />
                                        {errors.startDate && (
                                            <span className="text-xs text-red-500">
                                                {errors.startDate.message}
                                            </span>
                                        )}
                                    </label>

                                    <label className="flex flex-col gap-1.5 text-sm font-medium text-[#172033]">
                                        End date
                                        <input
                                            type="date"
                                            min={startDate || today}
                                            className={`rounded-xl border bg-[#F9FBFF] px-4 py-3 text-sm text-[#172033] outline-none transition-colors focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 ${
                                                errors.endDate
                                                    ? "border-red-300"
                                                    : "border-[#DEE7F3]"
                                            }`}
                                            {...register("endDate", {
                                                required:
                                                    "End date is required.",
                                                validate: (endDate) => {
                                                    const startDate =
                                                        getValues("startDate");

                                                    if (endDate < startDate) {
                                                        return "End date must be on or after the start date.";
                                                    }

                                                    return true;
                                                },
                                            })}
                                        />
                                        {errors.endDate && (
                                            <span className="text-xs text-red-500">
                                                {errors.endDate.message}
                                            </span>
                                        )}
                                    </label>
                                </div>

                                <label className="flex flex-col gap-1.5 text-sm font-medium text-[#172033]">
                                    Description{" "}
                                    <span className="font-normal text-[#172033]/40">
                                        (optional)
                                    </span>
                                    <textarea
                                        rows={4}
                                        placeholder="What's this trip about?"
                                        className="rounded-xl border border-[#DEE7F3] bg-[#F9FBFF] px-4 py-3 text-sm text-[#172033] outline-none transition-colors placeholder:text-[#172033]/35 focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10"
                                        {...register("description")}
                                    />
                                </label>

                                {serverError && (
                                    <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-600">
                                        {serverError}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_25px_rgba(59,130,246,0.25)] transition-colors hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? "Creating trip…"
                                        : "Create trip"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateTrip;
