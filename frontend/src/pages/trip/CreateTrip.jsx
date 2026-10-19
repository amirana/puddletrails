import { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, PlaneTakeoff, X } from "lucide-react";
import AppHeader from "../../components/layout/AppHeader.jsx";
import DestinationCombobox from "../../components/ui/DestinationCombobox.jsx";
import AuthContext from "../../context/AuthContext.jsx";
import posthog, { isPostHogConfigured } from "../../services/posthog.js";
import posthogLogger from "../../services/posthogLogger.js";

const CreateTrip = ({ modal = false, onClose }) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        watch,
    } = useForm({ mode: "onTouched" });
    const [serverError, setServerError] = useState("");
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const dialogRef = useRef(null);
    const returnFocusRef = useRef(null);
    const isSubmittingRef = useRef(isSubmitting);
    isSubmittingRef.current = isSubmitting;
    const today = new Date().toISOString().slice(0, 10);
    const startDate = watch("startDate");

    useEffect(() => {
        if (!modal) return undefined;
        const previousOverflow = document.body.style.overflow;
        returnFocusRef.current = document.activeElement;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();
        const handleDialogKeys = (event) => {
            if (event.key === "Escape" && !isSubmittingRef.current) {
                onClose?.();
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = dialogRef.current?.querySelectorAll("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex='-1'])");
            if (!focusable?.length) {
                event.preventDefault();
                return;
            }
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", handleDialogKeys);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleDialogKeys);
            returnFocusRef.current?.focus?.();
        };
    }, [modal, onClose]);

    const onSubmit = async (data) => {
        setServerError("");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trips/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Something went wrong");
            const creationSurface = modal ? "dashboard_modal" : "trip_page";
            if (isPostHogConfigured) {
                posthog.capture("trip_created", {
                    creation_surface: creationSurface,
                });
            }
            posthogLogger.info("trip creation completed", {
                operation: "trip_creation",
                creation_surface: creationSurface,
            });
            navigate(`/trips/${result.data._id}`);
        } catch (error) {
            console.error("Trip creation error:", error);
            setServerError(error.message);
        }
    };

    const formContent = (
        <>
            <header className="flex items-start justify-between gap-4 bg-[#FFF0DF] px-5 py-5 sm:px-7 sm:py-6">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 font-label text-[10px] font-bold uppercase tracking-[0.14em] text-[#9B4A3E]">
                        <PlaneTakeoff className="h-4 w-4 text-[#E9573F]" aria-hidden="true" /> A new adventure
                    </p>
                    <h1 id="create-trip-title" className="mb-0 mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[#29201D] sm:text-3xl">Plan your next trip</h1>
                    <p className="mt-1.5 max-w-xl text-sm leading-5 text-[#786A62]">Start with the basics. You can invite your crew and plan each day next.</p>
                </div>
                {modal ? (
                    <button type="button" onClick={onClose} disabled={isSubmitting} aria-label="Close create trip dialog" className="rounded-full p-2 text-[#786A62] transition hover:bg-white/70 hover:text-[#29201D] disabled:opacity-50">
                        <X className="h-5 w-5" />
                    </button>
                ) : null}
            </header>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-[#51443E]">
                        Trip name
                        <input
                            type="text"
                            placeholder="e.g. Goa with the crew"
                            aria-invalid={Boolean(errors.title)}
                            className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-normal text-[#29201D] outline-none transition placeholder:text-[#A99A90] focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15 ${errors.title ? "border-red-300" : "border-[#EAE2D9]"}`}
                            {...register("title", {
                                required: "Trip title is required.",
                                minLength: { value: 2, message: "Title must be at least 2 characters." },
                                maxLength: 60,
                            })}
                        />
                        {errors.title && <span className="text-xs font-normal text-red-600">{errors.title.message}</span>}
                    </label>

                    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-[#51443E]">
                        Destination
                        <Controller
                            name="destination"
                            control={control}
                            rules={{
                                required: "Destination is required.",
                                minLength: { value: 2, message: "Destination must be at least 2 characters." },
                                maxLength: { value: 60, message: "Destination must be at most 60 characters." },
                            }}
                            render={({ field }) => <DestinationCombobox value={field.value} onChange={field.onChange} error={errors.destination} />}
                        />
                        {errors.destination && <span className="text-xs font-normal text-red-600">{errors.destination.message}</span>}
                    </label>

                    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-[#51443E]">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#7D9869]" /> Start date</span>
                        <input
                            type="date"
                            min={today}
                            aria-invalid={Boolean(errors.startDate)}
                            className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-normal text-[#29201D] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15 ${errors.startDate ? "border-red-300" : "border-[#EAE2D9]"}`}
                            {...register("startDate", { required: "Start date is required." })}
                        />
                        {errors.startDate && <span className="text-xs font-normal text-red-600">{errors.startDate.message}</span>}
                    </label>

                    <label className="flex min-w-0 flex-col gap-1.5 text-sm font-semibold text-[#51443E]">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-[#E9573F]" /> End date</span>
                        <input
                            type="date"
                            min={startDate || today}
                            aria-invalid={Boolean(errors.endDate)}
                            className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm font-normal text-[#29201D] outline-none transition focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15 ${errors.endDate ? "border-red-300" : "border-[#EAE2D9]"}`}
                            {...register("endDate", {
                                required: "End date is required.",
                                validate: (endDate) => endDate >= getValues("startDate") || "End date must be on or after the start date.",
                            })}
                        />
                        {errors.endDate && <span className="text-xs font-normal text-red-600">{errors.endDate.message}</span>}
                    </label>

                    <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#51443E] sm:col-span-2">
                        <span className="inline-flex items-baseline gap-1.5">Description <span className="text-xs font-normal text-[#8C7C72]">(optional)</span></span>
                        <textarea
                            rows={3}
                            placeholder="What are you looking forward to?"
                            className="w-full resize-y rounded-xl border border-[#EAE2D9] bg-white px-3.5 py-3 text-sm font-normal leading-5 text-[#29201D] outline-none transition placeholder:text-[#A99A90] focus:border-[#E9573F] focus:ring-2 focus:ring-[#E9573F]/15"
                            {...register("description")}
                        />
                    </label>
                </div>

                {serverError && <p role="alert" className="mt-4 border-l-2 border-red-400 bg-red-50/70 px-3 py-2.5 text-sm text-red-700">{serverError}</p>}

                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#EEE7DF] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    {!modal ? (
                        <button type="button" onClick={() => navigate("/dashboard")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-[#65554D] transition hover:bg-[#FFF0DF]">
                            <ArrowLeft className="h-4 w-4" /> Back to trips
                        </button>
                    ) : <span className="hidden text-xs text-[#8C7C72] sm:inline">Your crew can join after you create it.</span>}
                    <button type="submit" disabled={isSubmitting} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#E9573F] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#CF4639] disabled:cursor-wait disabled:opacity-60">
                        {isSubmitting ? "Creating trip…" : "Create trip"}
                        {!isSubmitting && <MapPin className="h-4 w-4" aria-hidden="true" />}
                    </button>
                </div>
            </form>
        </>
    );

    if (modal) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#29201D]/45 p-3 backdrop-blur-[3px] sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose?.(); }}>
                <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="create-trip-title" className="flex max-h-[min(92vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] bg-[#FFFCF7] shadow-[0_28px_100px_rgba(41,32,29,0.28)] outline-none">
                    {formContent}
                </section>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#FFFCF7] text-[#29201D]">
            <AppHeader />
            <main className="mx-auto flex w-full max-w-[1440px] flex-1 items-start px-4 py-8 sm:px-8 sm:py-12">
                <div className="w-full overflow-hidden rounded-[28px] bg-white shadow-[0_12px_36px_rgba(60,40,30,0.08)]">
                    {formContent}
                </div>
            </main>
        </div>
    );
};

export default CreateTrip;
