import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DestinationCombobox from "../../components/ui/DestinationCombobox.jsx";
import { updateTrip as updateTripService } from "../../services/TripService.js";
import { PlaneTakeoff, Pencil } from "lucide-react";
import AuthContext from "../../context/AuthContext.jsx";

const EditTripForm = ({ trip, setTrip, days = [] }) => {
    const { tripId } = useParams();
    const { accessToken } = useContext(AuthContext);

    const [isEditing, setIsEditing] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const todayDate = today.toISOString().slice(0, 10);
    const originalStartDate = trip?.startDate ? new Date(trip.startDate).toISOString().slice(0, 10) : "";
    const originalEndDate = trip?.endDate ? new Date(trip.endDate).toISOString().slice(0, 10) : "";

    const {
        register,
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { isSubmitting, errors },
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
        setSubmitError("");
        try {
            const utcDay = (value) => Date.UTC(...value.split("-").map((part, index) => index === 1 ? Number(part) - 1 : Number(part)));
            const nextDayCount = Math.floor((utcDay(data.endDate) - utcDay(data.startDate)) / 86_400_000) + 1;
            const currentDayCount = Math.floor((utcDay(trip.endDate.slice(0, 10)) - utcDay(trip.startDate.slice(0, 10))) / 86_400_000) + 1;
            const commentsOnRemovedDays = nextDayCount < currentDayCount
                ? days.filter((day) => day.dayNumber > nextDayCount).reduce((count, day) => count + (day.comments?.length || 0), 0)
                : 0;
            if (commentsOnRemovedDays && !window.confirm(`Shortening this trip will delete ${commentsOnRemovedDays} comment${commentsOnRemovedDays === 1 ? "" : "s"} and any replies on the removed days. Continue?`)) return;

            const tripUpdate = {
                ...data,
                ...(commentsOnRemovedDays ? { confirmCommentDeletion: true } : {}),
            };
            let response;
            try {
                response = await updateTripService(tripId, tripUpdate, accessToken);
            } catch (error) {
                if (!tripUpdate.confirmCommentDeletion && error.message.includes("Confirm to continue")) {
                    if (!window.confirm("Shortening this trip will delete comments and replies on the removed days. Continue?")) return;
                    response = await updateTripService(tripId, { ...tripUpdate, confirmCommentDeletion: true }, accessToken);
                } else {
                    throw error;
                }
            }

            setTrip((prev) => ({
                ...response.data,
                role: prev.role,
                members: prev.members,
            }));
            setIsEditing(false);
        } catch (error) {
            setSubmitError(error.message || "Unable to save trip changes.");
        }
    };

    const cancelEditing = () => {
        reset({
            title: trip.title || "",
            destination: trip.destination || "",
            startDate: trip.startDate ? new Date(trip.startDate).toISOString().split("T")[0] : "",
            endDate: trip.endDate ? new Date(trip.endDate).toISOString().split("T")[0] : "",
            description: trip.description || "",
        });
        setSubmitError("");
        setIsEditing(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="block">
            <div className="space-y-5">
                {isEditing && <div className="rounded-3xl border border-[#F1D7C0] bg-[#FFF4E3] p-6 sm:p-8 lg:p-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#D65343]/20 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D65343]">
                                <PlaneTakeoff className="h-3.5 w-3.5" />
                                Edit trip details
                            </span>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                            {...register("title", {
                                                required: "Title is required",
                                                minLength: { value: 2, message: "Use at least 2 characters." },
                                                maxLength: { value: 100, message: "Keep the title under 100 characters." },
                                            })}
                                            aria-invalid={Boolean(errors.title)}
                                            className="w-full max-w-md rounded-xl border border-[#EAE2D9] bg-white px-3.5 py-2.5 text-2xl font-semibold tracking-[-0.04em] text-[#29201D] outline-none transition-colors focus:border-[#D65343] focus:ring-4 focus:ring-[#D65343]/10 sm:text-3xl"
                                        />

                                    {isEditing && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EAE2D9] bg-white px-3 py-2 text-xs font-medium text-[#29201D] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E3A18F] hover:shadow-[0_12px_28px_rgba(217,83,67,0.10)]"
                                                aria-label="Save trip"
                                            >
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : "Save"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EAE2D9] bg-white px-3 py-2 text-xs font-medium text-[#29201D] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E3A18F] hover:shadow-[0_12px_28px_rgba(217,83,67,0.10)]"
                                                aria-label="Cancel editing"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {isEditing && errors.title && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.title.message}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#29201D]/70">
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
                                        {errors.destination && <p className="basis-full text-xs text-red-600">{errors.destination.message}</p>}

                                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#EAE2D9] bg-white/80 p-2">
                                            <input
                                                type="date"
                                                min={todayDate}
                                                {...register("startDate", {
                                                    required:
                                                        "Start date is required",
                                                    validate: (value) => value >= todayDate || value === originalStartDate || "Start date cannot be before today.",
                                                })}
                                                className="rounded-lg border border-[#EAE2D9] bg-[#FFFCF7] px-2.5 py-2 text-sm text-[#29201D] outline-none focus:border-[#D65343] focus:ring-4 focus:ring-[#D65343]/10"
                                            />
                                            <input
                                                type="date"
                                                min={todayDate}
                                                {...register("endDate", {
                                                    required:
                                                        "End date is required",
                                                    validate: (value) => {
                                                        if (value < todayDate && value !== originalEndDate) return "End date cannot be before today.";
                                                        return value >= getValues("startDate") || "End date must be on or after the start date.";
                                                    },
                                                })}
                                                className="rounded-lg border border-[#EAE2D9] bg-[#FFFCF7] px-2.5 py-2 text-sm text-[#29201D] outline-none focus:border-[#D65343] focus:ring-4 focus:ring-[#D65343]/10"
                                            />
                                            {errors.startDate && <p className="basis-full text-xs text-red-600">{errors.startDate.message}</p>}
                                            {errors.endDate && <p className="basis-full text-xs text-red-600">{errors.endDate.message}</p>}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

                <div>
                    <article className="border-t border-[#EEE7DF] py-5 sm:py-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#29201D]/50">
                            About this trip
                        </p>
                            {!isEditing && (trip.role === "owner" || trip.role === "editor") && (
                                <button
                                    type="button"
                                    onClick={() => { setSubmitError(""); setIsEditing(true); }}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#EAE2D9] bg-white px-3.5 py-2 text-xs font-semibold text-[#51443E] transition hover:border-[#E3A18F] hover:bg-[#FFF4E3]"
                                >
                                    <Pencil className="h-3.5 w-3.5 text-[#D65343]" /> Edit trip
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <textarea
                                {...register("description")}
                                rows={6}
                                className="mt-4 w-full rounded-xl border border-[#EAE2D9] bg-white px-4 py-3 text-sm leading-6 text-[#29201D] outline-none transition-colors focus:border-[#D65343] focus:ring-4 focus:ring-[#D65343]/10"
                            />
                        ) : (
                            <p className="mt-4 text-base leading-7 text-[#29201D]/75">
                                {trip?.description ||
                                    "No description added yet. Add a few details to capture the mood, plans, or goals for this trip."}
                            </p>
                        )}
                    </article>
                </div>

                {submitError && <p className="mb-4 border-l-2 border-red-400 bg-red-50/70 px-4 py-3 text-sm text-red-700" role="alert">{submitError}</p>}
            </div>
        </form>
    );
};

export default EditTripForm;
