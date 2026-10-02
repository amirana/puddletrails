import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarDays, Clock3, Pencil, Plus, TicketCheck, Trash2 } from "lucide-react";
import { createReservation, deleteReservation, getReservations, updateReservation } from "../../services/ReservationService.js";

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
        <form onSubmit={handleSubmit(submit)} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Reservation name
                    <input maxLength={120} placeholder="e.g. Evening flight to Rome" aria-invalid={Boolean(errors.title)} {...register("title", { required: "Enter a reservation name.", maxLength: { value: 120, message: "Use 120 characters or fewer." } })} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.title && <span className="mt-1 block font-normal text-red-600">{errors.title.message}</span>}
                </label>
                <label className="text-xs font-semibold text-slate-700">Type
                    <select {...register("type", { required: "Choose a reservation type." })} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal">
                        {TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-slate-700">Date
                    <input type="date" min={minDate} aria-invalid={Boolean(errors.date)} {...register("date", { required: "Choose a reservation date.", validate: (value) => value >= minDate || (value === originalDate) || "Reservation date cannot be before today." })} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.date && <span className="mt-1 block font-normal text-red-600">{errors.date.message}</span>}
                </label>
                <label className="text-xs font-semibold text-slate-700">Time <span className="font-normal text-slate-500">(optional)</span>
                    <input type="time" {...register("time")} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal" />
                </label>
                <label className="text-xs font-semibold text-slate-700">Attach to itinerary day <span className="font-normal text-slate-500">(optional)</span>
                    <select {...register("tripDayId")} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal">
                        <option value="">Trip-wide reservation</option>
                        {days.map((day) => <option key={day._id} value={day._id}>Day {day.dayNumber} · {displayDate(day.date)}</option>)}
                    </select>
                </label>
                <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Confirmation number <span className="font-normal text-slate-500">(optional)</span>
                    <input maxLength={100} {...register("confirmationNumber", { maxLength: { value: 100, message: "Use 100 characters or fewer." } })} className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.confirmationNumber && <span className="mt-1 block font-normal text-red-600">{errors.confirmationNumber.message}</span>}
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
                    <input type="checkbox" {...register("confirmed")} className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600" />
                    Reservation is confirmed
                </label>
                <label className="text-xs font-semibold text-slate-700 sm:col-span-2">Notes <span className="font-normal text-slate-500">(optional)</span>
                    <textarea rows={3} maxLength={2000} {...register("notes", { maxLength: { value: 2000, message: "Use 2,000 characters or fewer." } })} className="mt-1.5 block w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal" />
                    {errors.notes && <span className="mt-1 block font-normal text-red-600">{errors.notes.message}</span>}
                </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={onCancel} disabled={busy || isSubmitting} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={busy || isSubmitting} className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSubmitting ? "Saving…" : reservation ? "Save reservation" : "Add reservation"}</button>
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

    const dayLabel = (tripDayId) => {
        const day = days.find((item) => item._id === tripDayId);
        return day ? `Day ${day.dayNumber} · ${displayDate(day.date)}` : "Trip-wide";
    };

    return (
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">Trip details</p>
                    <h2 className="mb-0 mt-2 !text-2xl font-semibold text-slate-900">Reservations</h2>
                    <p className="mt-1 text-sm text-slate-500">Keep confirmations and important booking details in one place.</p>
                </div>
                {canEdit && formReservation === undefined && <button type="button" onClick={() => { setError(""); setFormReservation(null); }} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"><Plus className="h-4 w-4" /> Add reservation</button>}
            </div>

            {error && !loadError && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
            {formReservation !== undefined && <ReservationForm reservation={formReservation} days={days} busy={busy} onCancel={() => setFormReservation(undefined)} onSave={handleSave} />}
            {loading ? (
                <div className="mt-5 space-y-3" aria-label="Loading reservations"><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /><div className="h-24 animate-pulse rounded-2xl bg-slate-100" /></div>
            ) : loadError ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
                    <p className="text-sm text-red-700">{error || "Reservations could not be loaded."}</p>
                    <button type="button" onClick={() => setReloadCount((count) => count + 1)} className="mt-2 text-sm font-semibold text-red-800 underline">Try again</button>
                </div>
            ) : !reservations.length ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center">
                    <TicketCheck className="mx-auto h-7 w-7 text-slate-400" />
                    <p className="mt-2 text-sm font-semibold text-slate-800">No reservations yet</p>
                    <p className="mt-1 text-xs text-slate-500">Add a flight, hotel, restaurant, or other booking for this trip.</p>
                </div>
            ) : (
                <ul className="mt-5 space-y-3">
                    {reservations.map((reservation) => (
                        <li key={reservation._id} className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-semibold text-slate-900">{reservation.title}</h3>
                                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-800">{reservation.type}</span>
                                        <label className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${reservation.confirmed ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                                            <input type="checkbox" checked={Boolean(reservation.confirmed)} disabled={!canEdit || busy} onChange={() => toggleConfirmed(reservation)} className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 disabled:opacity-60" />
                                            {reservation.confirmed ? "Confirmed" : "Not confirmed"}
                                        </label>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-slate-400" />{displayDate(reservation.date)}</span>
                                        {reservation.time && <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-slate-400" />{reservation.time}</span>}
                                        <span>{dayLabel(reservation.tripDayId)}</span>
                                    </div>
                                    {reservation.confirmationNumber && <p className="mt-2 text-xs text-slate-600"><span className="font-semibold">Confirmation:</span> {reservation.confirmationNumber}</p>}
                                    {reservation.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{reservation.notes}</p>}
                                </div>
                                {canEdit && <div className="flex shrink-0 gap-1">
                                    <button type="button" disabled={busy} onClick={() => { setError(""); setFormReservation(reservation); }} aria-label={`Edit ${reservation.title}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-violet-700 disabled:opacity-50"><Pencil className="h-4 w-4" /></button>
                                    <button type="button" disabled={busy} onClick={() => handleDelete(reservation)} aria-label={`Delete ${reservation.title}`} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
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
