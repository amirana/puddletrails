import { useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    ChevronUp,
    Clock3,
    GripVertical,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    X,
} from "lucide-react";
import ActivityForm from "./ActivityForm.jsx";
import ExplorePlacesMap from "./ExplorePlacesMap.jsx";
import DayComments from "./DayComments.jsx";
import posthog, { isPostHogConfigured } from "../../services/posthog.js";
import {
    createActivity,
    deleteActivity,
    reorderActivities,
    updateActivity,
} from "../../services/ActivityService.js";

const TripItinerary = ({
    tripId,
    accessToken,
    user,
    role,
    canEdit,
    days,
    setDays,
    loading,
    error,
    destination,
    active = true,
}) => {
    const [editor, setEditor] = useState(null);
    const [busy, setBusy] = useState("");
    const [activityError, setActivityError] = useState("");
    const [draggedActivityId, setDraggedActivityId] = useState("");
    const [dragOverDayId, setDragOverDayId] = useState("");

    const memberName = (member) =>
        [member?.firstName, member?.lastName].filter(Boolean).join(" ") || "Unknown member";
    const formatActivityTime = (value) => value
        ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
        : "";

    const updateLocalActivity = (activity) => {
        const dayId = activity.tripDay.toString();
        setDays((current) => current.map((day) => {
            if (day._id !== dayId) return day;
            const activities = (day.activities || []).some((item) => item._id === activity._id)
                ? day.activities.map((item) => item._id === activity._id ? activity : item)
                : [...(day.activities || []), activity];
            return { ...day, activities: activities.sort((a, b) => a.order - b.order) };
        }));
    };

    const handleSaveActivity = async (values) => {
        const editing = editor?.activity;
        const dayId = editor?.dayId;
        if (!dayId) return;
        setBusy(editing?._id || dayId);
        setActivityError("");
        try {
            const response = editing
                ? await updateActivity(tripId, editing._id, values, accessToken)
                : await createActivity(tripId, dayId, values, accessToken);
            updateLocalActivity(response.data);
            if (isPostHogConfigured) {
                posthog.capture("activity_saved", {
                    action: editing ? "updated" : "created",
                });
            }
            setEditor(null);
        } catch (saveError) {
            setActivityError(saveError.message);
        } finally {
            setBusy("");
        }
    };

    const handleDeleteActivity = async (activity) => {
        setBusy(activity._id);
        setActivityError("");
        try {
            await deleteActivity(tripId, activity._id, accessToken);
            setDays((current) => current.map((day) => {
                const activities = (day.activities || [])
                    .filter((item) => item._id !== activity._id)
                    .map((item, order) => ({ ...item, order }));
                return { ...day, activities };
            }));
        } catch (deleteError) {
            setActivityError(deleteError.message);
        } finally {
            setBusy("");
        }
    };

    const moveActivity = async (activityId, destinationDayId, destinationIndex) => {
        if (busy) return;
        const previousDays = days;
        const nextDays = days.map((day) => ({ ...day, activities: [...(day.activities || [])] }));
        let movedActivity;
        let sourceDay;
        let sourceIndex = -1;
        for (const day of nextDays) {
            sourceIndex = day.activities.findIndex((activity) => activity._id === activityId);
            if (sourceIndex !== -1) {
                sourceDay = day;
                [movedActivity] = day.activities.splice(sourceIndex, 1);
                break;
            }
        }
        const targetDay = nextDays.find((day) => day._id === destinationDayId);
        if (!movedActivity || !sourceDay || !targetDay) return;

        let insertionIndex = destinationIndex;
        if (sourceDay._id === targetDay._id && sourceIndex < insertionIndex) insertionIndex -= 1;
        insertionIndex = Math.max(0, Math.min(insertionIndex, targetDay.activities.length));
        targetDay.activities.splice(insertionIndex, 0, { ...movedActivity, tripDay: destinationDayId });
        for (const day of nextDays) {
            day.activities = day.activities.map((activity, order) => ({ ...activity, order }));
        }

        const positions = nextDays.flatMap((day) => day.activities.map((activity, order) => ({
            activityId: activity._id,
            tripDayId: day._id,
            order,
        })));
        setDays(nextDays);
        setBusy("reordering");
        setActivityError("");
        try {
            await reorderActivities(tripId, positions, accessToken);
        } catch (moveError) {
            setDays(previousDays);
            setActivityError(moveError.message);
        } finally {
            setBusy("");
            setDraggedActivityId("");
            setDragOverDayId("");
        }
    };

    return (
        <section className="rounded-2xl bg-transparent p-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.1em] text-[#9B4A3E]">The itinerary</p>
                    <h2 className="mb-0 mt-1 text-xl font-extrabold text-[#29201D]">Day by day</h2>
                    <p className="mt-1 text-xs text-[#786A62]">{canEdit ? "Plan each day together · Drag activities to reschedule" : "A shared plan for every day of the trip"}</p>
                </div>
                {!loading && !error && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF2E8] px-3 py-1.5 text-sm font-semibold text-[#9B4A3E]">
                        <CalendarDays className="h-4 w-4" /> {days.length} {days.length === 1 ? "day" : "days"}
                    </span>
                )}
            </div>

            {(error || activityError) && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error || activityError}</p>}
            {loading ? (
                    <div className="mt-3 space-y-3" aria-label="Loading itinerary">
                    <div className="h-20 animate-pulse rounded-2xl bg-[#F5EFE8]" />
                    <div className="h-20 animate-pulse rounded-2xl bg-[#F5EFE8]" />
                </div>
            ) : !error && (
                <>
                {days.length > 0 ? <ol className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3" aria-label="Itinerary days">
                    {days.map((day) => {
                        const dayActivities = day.activities || [];
                        const dayReservations = day.reservations || [];
                        const dayDate = new Date(day.date).toLocaleDateString("en-GB", {
                            weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
                        });
                        return (
                            <li
                                key={day._id}
                                aria-label={`Day ${day.dayNumber}, ${dayActivities.length} activities. Drop activities here to move them to this day.`}
                                onDragOver={(event) => {
                                    if (!canEdit || !draggedActivityId) return;
                                    event.preventDefault();
                                    setDragOverDayId(day._id);
                                }}
                                onDrop={(event) => {
                                    if (!canEdit) return;
                                    event.preventDefault();
                                    const activityId = event.dataTransfer.getData("text/plain") || draggedActivityId;
                                    if (activityId) moveActivity(activityId, day._id, dayActivities.length);
                                }}
                                className={`min-h-[16rem] w-[min(86vw,19rem)] shrink-0 snap-start rounded-2xl border p-3 transition-colors sm:w-[19rem] ${dragOverDayId === day._id ? "border-[#E9573F] bg-[#FFF0DF]" : "border-[#EEE7DF] bg-[#FFF9F1]"}`}
                            >
                                <div className="flex items-start gap-3">
                                        <span className="mt-0.5 shrink-0 font-label text-[10px] font-bold uppercase tracking-[0.12em] text-[#9B4A3E]">Day {day.dayNumber}</span>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-sm font-bold text-[#29201D]">{dayDate}</h3>
                                        <p className="mt-1 text-xs text-[#786A62]">{dayActivities.length ? `${dayActivities.length} ${dayActivities.length === 1 ? "activity" : "activities"}` : "The day is open"}</p>
                                    </div>
                                    {canEdit && (
                                        <button
                                            type="button"
                                            onClick={() => { setActivityError(""); setEditor({ dayId: day._id, activity: null }); }}
                                            disabled={Boolean(busy)}
                                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#F1C6B7] px-3 py-2 text-xs font-semibold text-[#9B4A3E] transition hover:bg-[#FFF4E3] disabled:opacity-50"
                                        >
                                            <Plus className="h-3.5 w-3.5" /> Add
                                        </button>
                                    )}
                                </div>

                                {dayActivities.length > 0 ? (
                                    <ul className="mt-4 space-y-2">
                                        {dayActivities.map((activity, index) => (
                                            <li
                                                key={activity._id}
                                                draggable={canEdit && !busy}
                                                onDragStart={(event) => {
                                                    event.dataTransfer.effectAllowed = "move";
                                                    event.dataTransfer.setData("text/plain", activity._id);
                                                    setDraggedActivityId(activity._id);
                                                }}
                                                onDragEnd={() => { setDraggedActivityId(""); setDragOverDayId(""); }}
                                                onDragOver={(event) => {
                                                    if (!canEdit || !draggedActivityId) return;
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onDrop={(event) => {
                                                    if (!canEdit) return;
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    const activityId = event.dataTransfer.getData("text/plain") || draggedActivityId;
                                                    if (activityId && activityId !== activity._id) moveActivity(activityId, day._id, index);
                                                }}
                                                className={`group rounded-xl border border-[#EEE7DF] bg-white p-3 transition-shadow hover:shadow-sm ${draggedActivityId === activity._id ? "opacity-40" : ""}`}
                                            >
                                                    <div className="grid grid-cols-[16px_minmax(0,1fr)] gap-x-2">
                                                        {canEdit ? <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-[#A5988E] active:cursor-grabbing" aria-label="Drag to reorder" /> : <span aria-hidden="true" />}
                                                        <div className="min-w-0">
                                                            <h4 className="break-words text-sm font-semibold leading-5 text-[#29201D]">{activity.title}</h4>
                                                            {(activity.startTime || activity.endTime) && (
                                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#786A62]">
                                                                    <Clock3 className="h-3.5 w-3.5" />
                                                                    {activity.startTime || "Time TBD"}{activity.endTime ? ` – ${activity.endTime}` : ""}
                                                                </p>
                                                            )}
                                                            {activity.location && <p className="mt-1 flex items-center gap-1.5 text-xs text-[#786A62]"><MapPin className="h-3.5 w-3.5" />{activity.location}</p>}
                                                            {activity.description && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-[#786A62]">{activity.description}</p>}
                                                            <p className="mt-2 break-words text-[10px] leading-4 text-[#8C7D74]">
                                                                Added by {memberName(activity.createdBy)} · {formatActivityTime(activity.createdAt)}
                                                            </p>
                                                            {activity.editedAt && (
                                                                <p className="mt-0.5 break-words text-[10px] leading-4 text-[#8C7D74]">
                                                                    Edited by {memberName(activity.updatedBy)} · {formatActivityTime(activity.editedAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {canEdit && (
                                                            <div className="col-start-2 mt-2 flex min-w-0 flex-wrap items-center justify-end gap-1 border-t border-[#F1EAE2] pt-2">
                                                                <button type="button" onClick={() => moveActivity(activity._id, day._id, index - 1)} disabled={Boolean(busy) || index === 0} className="rounded-md p-1.5 text-[#786A62] hover:bg-white hover:text-[#29201D] disabled:opacity-30" aria-label={`Move ${activity.title} earlier`} title="Move earlier"><ChevronUp className="h-4 w-4" /></button>
                                                                <button type="button" onClick={() => moveActivity(activity._id, day._id, index + 2)} disabled={Boolean(busy) || index === dayActivities.length - 1} className="rounded-md p-1.5 text-[#786A62] hover:bg-white hover:text-[#29201D] disabled:opacity-30" aria-label={`Move ${activity.title} later`} title="Move later"><ChevronDown className="h-4 w-4" /></button>
                                                                <select
                                                                    aria-label={`Move ${activity.title} to another day`}
                                                                    value={day._id}
                                                                    disabled={Boolean(busy)}
                                                                    onChange={(event) => moveActivity(activity._id, event.target.value, (days.find((item) => item._id === event.target.value)?.activities || []).length)}
                                                                    className="max-w-24 rounded-md border border-[#EAE2D9] bg-white px-1.5 py-1.5 text-[10px] text-[#786A62] disabled:opacity-50"
                                                                >
                                                                    {days.map((destination) => <option key={destination._id} value={destination._id}>Day {destination.dayNumber}</option>)}
                                                                </select>
                                                                <button type="button" onClick={() => { setActivityError(""); setEditor({ dayId: day._id, activity }); }} disabled={Boolean(busy)} className="rounded-md p-1.5 text-[#786A62] hover:bg-white hover:text-[#9B4A3E] disabled:opacity-50" aria-label={`Edit ${activity.title}`}><Pencil className="h-3.5 w-3.5" /></button>
                                                                <button type="button" onClick={() => handleDeleteActivity(activity)} disabled={Boolean(busy)} className="rounded-md p-1.5 text-[#786A62] hover:bg-white hover:text-red-700 disabled:opacity-50" aria-label={`Delete ${activity.title}`}><Trash2 className="h-3.5 w-3.5" /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-4 px-1 py-2 text-xs text-[#8C7D74]">
                                        {canEdit ? "Nothing planned yet. Add a stop or meal." : "No activities planned yet."}
                                    </p>
                                )}

                                {dayReservations.length > 0 && (
                                    <div className="mt-4 border-t border-[#EEE7DF] pl-6 pt-3">
                                        <p className="font-label text-[10px] font-bold uppercase tracking-wide text-[#9B4A3E]">Reservations</p>
                                        <ul className="mt-2 space-y-2">
                                            {dayReservations.map((reservation) => (
                                                <li key={reservation._id} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#51443E]">
                                                    <span className="font-semibold">{reservation.title}</span>
                                                    <span className="text-[10px] font-semibold uppercase text-[#9B4A3E]">{reservation.type}</span>
                                                    {reservation.time && <span>{reservation.time}</span>}
                                                    <span className={reservation.confirmed ? "text-emerald-700" : "text-[#8C7D74]"}>{reservation.confirmed ? "Confirmed" : "Not confirmed"}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <DayComments
                                    tripId={tripId}
                                    day={day}
                                    accessToken={accessToken}
                                    user={user}
                                    role={role}
                                    setDays={setDays}
                                />
                            </li>
                        );
                    })}
                </ol> : <p className="mt-6 rounded-2xl border border-dashed border-[#EAE2D9] bg-white p-6 text-sm text-[#786A62]">Trip dates haven’t been set yet, so there are no itinerary days to show.</p>}
                </>
            )}
            <ExplorePlacesMap destination={destination} enabled={active} />
            {editor && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#29201D]/45 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !busy) setEditor(null);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape" && !busy) setEditor(null);
                    }}
                >
                    <section role="dialog" aria-modal="true" aria-labelledby="activity-dialog-title" className="my-auto w-full max-w-xl rounded-3xl bg-[#FFFCF7] p-5 shadow-[0_24px_80px_rgba(41,32,29,0.24)] sm:p-6">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <p className="font-label text-[10px] font-bold uppercase tracking-[0.14em] text-[#9B4A3E]">Day {days.find((day) => day._id === editor.dayId)?.dayNumber}</p>
                                <h2 id="activity-dialog-title" className="mb-0 mt-1 text-xl font-extrabold text-[#29201D]">{editor.activity ? "Edit activity" : "Add to the itinerary"}</h2>
                                <p className="mt-1 text-xs text-[#786A62]">Keep the key details handy for your crew.</p>
                            </div>
                            <button type="button" onClick={() => setEditor(null)} disabled={Boolean(busy)} aria-label="Close activity form" className="rounded-full p-2 text-[#786A62] hover:bg-[#F5EFE8] disabled:opacity-50"><X className="h-5 w-5" /></button>
                        </div>
                        <ActivityForm activity={editor.activity} busy={Boolean(busy)} onCancel={() => setEditor(null)} onSave={handleSaveActivity} />
                    </section>
                </div>
            )}
        </section>
    );
};

export default TripItinerary;
