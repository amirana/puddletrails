import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DestinationCombobox from "../../components/ui/DestinationCombobox.jsx";
import { updateTrip as updateTripService } from "../../services/TripService.js";
import { CalendarDays, MapPin, PlaneTakeoff, Pencil } from "lucide-react";
import AuthContext from "../../context/AuthContext.jsx";

const EditTripForm = ({ trip, setTrip }) => {
    const { tripId } = useParams();
    const { accessToken } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            title: "",
            destination: "",
            startDate: "",
            endDate: "",
            description: "",
        },
    });

    useEffect(() => {
        if (trip) {
            reset({
                title: trip.title || "",
                destination: trip.destination || "",
                startDate: trip.startDate
                    ? new Date(trip.startDate).toISOString().split("T")[0]
                    : "",
                endDate: trip.endDate
                    ? new Date(trip.endDate).toISOString().split("T")[0]
                    : "",
                description: trip.description || "",
            });
        }
    }, [trip, reset]);

    const onSubmit = async (data) => {
        try {
            const response = await updateTripService(tripId, data, accessToken);

            setTrip(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    const startDate = trip?.startDate
        ? new Date(trip.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Dates to be confirmed";

    const endDate = trip?.endDate
        ? new Date(trip.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Dates to be confirmed";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="block">
            <div className="mt-5 overflow-hidden rounded-[30px] border border-[#DDE7F3] bg-white shadow-[0_24px_80px_rgba(23,32,51,0.08)]">
                <div className="border-b border-[#EDF2F7] bg-gradient-to-r from-[#EAF3FF] via-white to-[#F7F4EE] p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/20 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3B82F6]">
                                <PlaneTakeoff className="h-3.5 w-3.5" />
                                Trip overview
                            </span>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {isEditing ? (
                                        <input
                                            {...register("title", {
                                                required: "Title is required",
                                            })}
                                            className="w-full max-w-md rounded-xl border border-[#D7E5FF] bg-white px-3.5 py-2.5 text-2xl font-semibold tracking-[-0.04em] text-[#172033] outline-none transition-colors focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 sm:text-3xl"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-semibold tracking-[-0.05em] text-[#172033] sm:text-4xl">
                                            {trip?.title}
                                        </h1>
                                    )}

                                    {!isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6E4FF] bg-white px-3 py-2 text-xs font-medium text-[#172033] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7C2FF] hover:shadow-[0_12px_28px_rgba(59,130,246,0.10)]"
                                            aria-label="Edit trip"
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-[#3B82F6]" />
                                            Edit
                                        </button>
                                    )}

                                    {isEditing && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="submit"
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6E4FF] bg-white px-3 py-2 text-xs font-medium text-[#172033] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7C2FF] hover:shadow-[0_12px_28px_rgba(59,130,246,0.10)]"
                                                aria-label="Save trip"
                                            >
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    reset();
                                                    setIsEditing(false);
                                                }}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6E4FF] bg-white px-3 py-2 text-xs font-medium text-[#172033] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#A7C2FF] hover:shadow-[0_12px_28px_rgba(59,130,246,0.10)]"
                                                aria-label="Cancel editing"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#172033]/70">
                                    {isEditing ? (
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
                                                />
                                            )}
                                        />
                                    ) : (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm text-[#172033]/70">
                                            <MapPin className="h-4 w-4 text-[#3B82F6]" />
                                            {trip?.destination}
                                        </span>
                                    )}

                                    {isEditing ? (
                                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#DDE7F3] bg-white/80 p-2">
                                            <input
                                                type="date"
                                                {...register("startDate", {
                                                    required:
                                                        "Start date is required",
                                                })}
                                                className="rounded-lg border border-[#DEE7F3] bg-[#F9FBFF] px-2.5 py-2 text-sm text-[#172033] outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10"
                                            />

                                            <input
                                                type="date"
                                                {...register("endDate", {
                                                    required:
                                                        "End date is required",
                                                })}
                                                className="rounded-lg border border-[#DEE7F3] bg-[#F9FBFF] px-2.5 py-2 text-sm text-[#172033] outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10"
                                            />
                                        </div>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-sm text-[#172033]/70">
                                            <CalendarDays className="h-4 w-4 text-[#3B82F6]" />
                                            {startDate} – {endDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[22px] border border-[#DDE7F3] bg-white/85 p-4 shadow-sm">
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
                    <article className="rounded-[22px] border border-[#E6EDF8] bg-[#FFFDF8] p-5 sm:p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                            About this trip
                        </p>

                        {isEditing ? (
                            <textarea
                                {...register("description")}
                                rows={6}
                                className="mt-4 w-full rounded-xl border border-[#DEE7F3] bg-white px-4 py-3 text-sm leading-6 text-[#172033] outline-none transition-colors focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10"
                            />
                        ) : (
                            <p className="mt-4 text-base leading-7 text-[#172033]/75">
                                {trip?.description ||
                                    "No description added yet. Add a few details to capture the mood, plans, or goals for this trip."}
                            </p>
                        )}
                    </article>

                    <aside className="space-y-4">
                        <div className="rounded-[22px] border border-[#E6EDF8] bg-white p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                                Destination
                            </p>

                            <p className="mt-3 text-lg font-semibold text-[#172033]">
                                {trip?.destination}
                            </p>
                        </div>

                        <div className="rounded-[22px] border border-[#E6EDF8] bg-white p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#172033]/50">
                                Dates
                            </p>

                            <p className="mt-3 text-base font-medium text-[#172033]">
                                {startDate}
                            </p>

                            <p className="mt-1 text-sm text-[#172033]/60">to</p>

                            <p className="mt-1 text-base font-medium text-[#172033]">
                                {endDate}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </form>
    );
};

export default EditTripForm;
