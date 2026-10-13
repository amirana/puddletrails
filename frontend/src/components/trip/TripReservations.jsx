import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, Clock3, FileText, Image as ImageIcon, Pencil, Plus, TicketCheck, Trash2, Upload } from "lucide-react";
import {
    createReservation,
    deleteReservation,
    deleteReservationAttachment,
    getReservations,
    updateReservation,
    uploadReservationAttachment,
} from "../../services/ReservationService.js";

const TYPES = ["Flight", "Hotel", "Restaurant", "Transport", "Other"];

const today = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
};

const displayDate = (value) => new Date(value).toLocaleDateString(undefined, {
    weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
});

const ReservationForm = ({ reservation, days, busy, onCancel, onSave }) => {
    const minDate = today();
    const originalDate = reservation?.date ? new Date(reservation.date).toISOString().slice(0, 10) : "";
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            title: reservation?.title || "",
            type: reservation?.type || "Flight",
            date: reservation?.date ? new Date(reservation.date).toISOString().slice(0, 10) : "",
            time: reservation?.time || "",
            confirmationNumber: reservation?.confirmationNumber || "",
            confirmed: reservation?.confirmed || false,
            notes: reservation?.notes || "",
            tripDayId: reservation?.tripDayId || "",
        },
    });
    const submit = (values) => onSave({ ...values, tripDayId: values.tripDayId || null });

    return (
        <form onSubmit={handleSubmit(submit)} className="mt-5 rounded-2xl border border-[#EAE2D9] bg-[#FFFCF7] p-4 sm:p-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">Reservation name
                    <input maxLength={120} placeholder="e.g. Evening flight to Rome" aria-invalid={Boolean(errors.title)} {...register("title", { required: "Enter a reservation name.", maxLength: { value: 120, message: "Use 120 characters or fewer." } })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.title && <span className="mt-1 block font-normal text-red-600">{errors.title.message}</span>}
                </label>
                <label className="text-xs font-semibold text-[#51443E]">Type
                    <select {...register("type", { required: "Choose a reservation type." })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal">
                        {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-[#51443E]">Date
                    <input type="date" min={minDate} aria-invalid={Boolean(errors.date)} {...register("date", { required: "Choose a reservation date.", validate: (value) => value >= minDate || (value === originalDate) || "Reservation date cannot be before today." })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.date && <span className="mt-1 block font-normal text-red-600">{errors.date.message}</span>}
                </label>
                <label className="text-xs font-semibold text-[#51443E]">Time <span className="font-normal text-[#786A62]">(optional)</span>
                    <input type="time" {...register("time")} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal" />
                </label>
                <label className="text-xs font-semibold text-[#51443E]">Attach to itinerary day <span className="font-normal text-[#786A62]">(optional)</span>
                    <select {...register("tripDayId")} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal">
                        <option value="">Trip-wide reservation</option>
                        {days.map((day) => <option key={day._id} value={day._id}>Day {day.dayNumber} · {displayDate(day.date)}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">Confirmation number <span className="font-normal text-[#786A62]">(optional)</span>
                    <input maxLength={100} {...register("confirmationNumber", { maxLength: { value: 100, message: "Use 100 characters or fewer." } })} className="mt-1.5 block w-full rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.confirmationNumber && <span className="mt-1 block font-normal text-red-600">{errors.confirmationNumber.message}</span>}
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#51443E] sm:col-span-2">
                    <input type="checkbox" {...register("confirmed")} className="h-4 w-4 rounded border-[#D8CEC4] text-[#C94F3D] focus:ring-[#E9573F]" />
                    Reservation is confirmed
                </label>
                <label className="text-xs font-semibold text-[#51443E] sm:col-span-2">Notes <span className="font-normal text-[#786A62]">(optional)</span>
                    <textarea rows={3} maxLength={2000} {...register("notes", { maxLength: { value: 2000, message: "Use 2,000 characters or fewer." } })} className="mt-1.5 block w-full resize-y rounded-lg border border-[#EAE2D9] bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.notes && <span className="mt-1 block font-normal text-red-600">{errors.notes.message}</span>}
                </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#65554D] hover:bg-[#F1EAE2]">Cancel</button>
                <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-[#E9573F] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSubmitting ? "Saving…" : reservation ? "Save reservation" : "Add reservation"}</button>
            </div>
        </form>
    );
};

const TripReservations = ({ tripId, accessToken, role, days, setDays }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loadError, setLoadError] = useState(false);
    const [reloadCount, setReloadCount] = useState(0);
    const [busy, setBusy] = useState(false);
    const [uploadingReservationId, setUploadingReservationId] = useState("");
    const [formReservation, setFormReservation] = useState(undefined);
    const canEdit = role === "owner" || role === "editor";

    const saveReservations = (nextReservations) => {
        setReservations(nextReservations);
        setDays((current) => current.map((day) => ({
            ...day,
            reservations: nextReservations.filter((item) => String(item.tripDayId?._id || item.tripDayId || "") === day._id),
        })));
    };

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError("");
            setLoadError(false);
            try {
                const response = await getReservations(tripId, accessToken);
                if (!cancelled) saveReservations(response.data);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError.message);
                    setLoadError(true);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => { cancelled = true; };
    }, [tripId, accessToken, reloadCount]);

    const handleSave = async (values) => {
        setBusy(true);
        setError("");
        try {
            if (formReservation?._id) {
                const response = await updateReservation(tripId, formReservation._id, values, accessToken);
                saveReservations(reservations.map((item) => item._id === response.data._id ? response.data : item).sort((a, b) => new Date(a.date) - new Date(b.date)));
            } else {
                const response = await createReservation(tripId, values, accessToken);
                saveReservations([...reservations, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
            }
            setFormReservation(undefined);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async (reservation) => {
        if (!window.confirm(`Delete “${reservation.title}”?`)) return;
        setBusy(true);
        setError("");
        try {
            await deleteReservation(tripId, reservation._id, accessToken);
            saveReservations(reservations.filter((item) => item._id !== reservation._id));
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setBusy(false);
        }
    };

    const toggleConfirmed = async (reservation) => {
        setBusy(true);
        setError("");
        try {
            const tripDayId = reservation.tripDayId?._id || reservation.tripDayId || null;
            const response = await updateReservation(tripId, reservation._id, { ...reservation, tripDayId, confirmed: !reservation.confirmed }, accessToken);
            saveReservations(reservations.map((item) => item._id === response.data._id ? response.data : item));
        } catch (toggleError) {
            setError(toggleError.message);
        } finally {
            setBusy(false);
        }
    };

    const handleUploadAttachment = async (reservation, file) => {
        if (file.size > 10 * 1024 * 1024) {
            setError("Choose a file that is 10 MB or smaller.");
            return;
        }
        setBusy(true);
        setUploadingReservationId(reservation._id);
        setError("");
        try {
            const response = await uploadReservationAttachment(tripId, reservation._id, file, accessToken);
            saveReservations(reservations.map((item) => item._id === response.data._id ? response.data : item));
        } catch (uploadError) {
            setError(uploadError.message);
        } finally {
            setUploadingReservationId("");
            setBusy(false);
        }
    };

    const handleDeleteAttachment = async (reservation, attachment) => {
        if (!window.confirm(`Remove “${attachment.originalName}” from this reservation?`)) return;
        setBusy(true);
        setError("");
        try {
            const response = await deleteReservationAttachment(tripId, reservation._id, attachment._id, accessToken);
            saveReservations(reservations.map((item) => item._id === response.data._id ? response.data : item));
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setBusy(false);
        }
    };

    const dayLabel = (tripDayId) => {
        const day = days.find((item) => item._id === tripDayId);
        return day ? `Day ${day.dayNumber} · ${displayDate(day.date)}` : "Trip-wide";
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C94F3D]">Trip details</p>
                    <h2 className="mb-0 mt-2 !text-2xl font-semibold text-[#29201D]">Reservations</h2>
                    <p className="mt-1 text-sm text-[#786A62]">Keep confirmations and important booking details in one place.</p>
                </div>
                {canEdit && formReservation === undefined && <button type="button" onClick={() => { setError(""); setFormReservation(null); }} className="inline-flex items-center gap-1.5 rounded-lg bg-[#E9573F] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#CF4639]"><Plus className="h-4 w-4" /> Add reservation</button>}
            </div>

            {error && !loadError && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
            {formReservation !== undefined && <ReservationForm reservation={formReservation} days={days} busy={busy} onCancel={() => setFormReservation(undefined)} onSave={handleSave} />}
            {loading ? (
                <div className="mt-5 space-y-3" aria-label="Loading reservations"><div className="h-24 animate-pulse rounded-2xl bg-[#F7F0E8]" /><div className="h-24 animate-pulse rounded-2xl bg-[#F7F0E8]" /></div>
            ) : loadError ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                    <p className="text-sm text-red-700">{error || "Reservations could not be loaded."}</p>
                    <button type="button" onClick={() => setReloadCount((count) => count + 1)} className="mt-2 text-sm font-semibold text-red-800 underline">Try again</button>
                </div>
            ) : !reservations.length ? (
                <div className="mt-5 rounded-2xl border border-dashed border-[#EAE2D9] px-5 py-8 text-center">
                    <TicketCheck className="mx-auto h-7 w-7 text-[#A99A90]" />
                    <p className="mt-2 text-sm font-semibold text-[#29201D]">No reservations yet</p>
                    <p className="mt-1 text-xs text-[#786A62]">Add a flight, hotel, restaurant, or other booking for this trip.</p>
                </div>
            ) : (
                <ul className="mt-5 divide-y divide-[#EEE7DF]">
                    {reservations.map((reservation) => (
                        <li key={reservation._id} className="py-5 first:pt-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-semibold text-[#29201D]">{reservation.title}</h3>
                                        <span className="rounded-full bg-[#FFF0E8] px-2.5 py-1 text-[10px] font-semibold text-[#9B4A3E]">{reservation.type}</span>
                                        <label className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${reservation.confirmed ? "bg-emerald-50 text-emerald-800" : "bg-[#F7F0E8] text-[#65554D]"}`}>
                                            <input type="checkbox" checked={Boolean(reservation.confirmed)} disabled={!canEdit || busy} onChange={() => toggleConfirmed(reservation)} className="h-3.5 w-3.5 rounded border-[#D8CEC4] text-emerald-700 focus:ring-emerald-600 disabled:opacity-60" />
                                            {reservation.confirmed ? "Confirmed" : "Not confirmed"}
                                        </label>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#65554D]">
                                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#A99A90]" />{displayDate(reservation.date)}</span>
                                        {reservation.time && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-[#A99A90]" />{reservation.time}</span>}
                                        <span>{dayLabel(reservation.tripDayId)}</span>
                                    </div>
                                    {reservation.confirmationNumber && <p className="mt-2 text-xs text-[#65554D]"><span className="font-semibold">Confirmation:</span> {reservation.confirmationNumber}</p>}
                                    {reservation.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-[#65554D]">{reservation.notes}</p>}
                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        {canEdit && (
                                            <label className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#EAE2D9] px-2.5 py-1.5 text-xs font-semibold text-[#51443E] hover:bg-[#FFFCF7] focus-within:ring-2 focus-within:ring-[#FFE4D8] ${busy ? "pointer-events-none opacity-50" : ""}`}>
                                                <Upload className="h-3.5 w-3.5" /> {uploadingReservationId === reservation._id ? "Uploading…" : "Attach file"}
                                                <input
                                                    type="file"
                                                    accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
                                                    disabled={busy || (reservation.attachments || []).length >= 5}
                                                    onChange={(event) => {
                                                        const file = event.target.files?.[0];
                                                        if (file) handleUploadAttachment(reservation, file);
                                                        event.target.value = "";
                                                    }}
                                                    className="sr-only"
                                                />
                                            </label>
                                        )}
                                        {(reservation.attachments || []).length >= 5 && <span className="text-xs text-[#786A62]">5 file limit reached</span>}
                                    </div>
                                    {(reservation.attachments || []).length > 0 && (
                                        <ul className="mt-2 space-y-1.5">
                                            {reservation.attachments.map((attachment) => {
                                                const isImage = attachment.resourceType === "image";
                                                return (
                                                    <li key={attachment._id} className="flex items-center gap-2 text-xs">
                                                        {isImage ? <ImageIcon className="h-3.5 w-3.5 shrink-0 text-[#A99A90]" /> : <FileText className="h-3.5 w-3.5 shrink-0 text-[#A99A90]" />}
                                                        <a href={attachment.url} target="_blank" rel="noreferrer" className="min-w-0 truncate font-medium text-[#C94F3D] underline decoration-[#F4C9BC] underline-offset-2 hover:text-[#9B3F32]">
                                                            {attachment.originalName}
                                                        </a>
                                                        <span className="shrink-0 text-[#A99A90]">{attachment.bytes < 1024 * 1024 ? `${Math.max(1, Math.round(attachment.bytes / 1024))} KB` : `${(attachment.bytes / (1024 * 1024)).toFixed(1)} MB`}</span>
                                                        {canEdit && <button type="button" disabled={busy} onClick={() => handleDeleteAttachment(reservation, attachment)} aria-label={`Remove ${attachment.originalName}`} className="rounded p-1 text-[#A99A90] hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button>}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                                {canEdit && <div className="flex shrink-0 gap-1">
                                    <button type="button" disabled={busy} onClick={() => { setError(""); setFormReservation(reservation); }} aria-label={`Edit ${reservation.title}`} className="rounded-md p-1.5 text-[#786A62] hover:bg-[#F7F0E8] hover:text-[#C94F3D] disabled:opacity-50"><Pencil className="h-4 w-4" /></button>
                                    <button type="button" disabled={busy} onClick={() => handleDelete(reservation)} aria-label={`Delete ${reservation.title}`} className="rounded-md p-1.5 text-[#786A62] hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                                </div>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default TripReservations;
